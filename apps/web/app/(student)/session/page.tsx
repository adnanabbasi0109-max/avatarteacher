"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { ChatPanel } from "@/components/session/ChatPanel";
import { SessionControls } from "@/components/session/SessionControls";
import { VoiceIndicator } from "@/components/session/VoiceIndicator";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useElevenLabsTTS } from "@/hooks/useElevenLabsTTS";

interface Persona {
  id: string;
  name: string;
  subject: string;
  style: string;
  avatar: string;
  greeting: string;
  language?: string;
}

const personas: Persona[] = [
  {
    id: "p1",
    name: "Prof. Ada",
    subject: "Mathematics",
    style: "Socratic",
    avatar: "/avatars/prof-ada.jpg",
    greeting:
      "Hello! I'm Prof. Ada, your mathematics tutor. I love using the Socratic method — I'll guide you with questions rather than just giving answers. What topic would you like to explore today?",
  },
  {
    id: "p2",
    name: "Sir Walter Lewin",
    subject: "Physics",
    style: "Example-Based",
    avatar: "/avatars/sir-walter-lewin.jpg",
    greeting:
      "Welcome! I am Sir Walter Lewin, and physics is beautiful! I believe in learning through demonstrations and examples. Tell me — what fascinates you about the physical world?",
  },
  {
    id: "p3",
    name: "Ms. Sharma",
    subject: "Hindi",
    style: "Collaborative",
    avatar: "/avatars/ms-sharma.jpg",
    language: "hi-IN",
    greeting:
      "Namaste! Main Ms. Sharma hoon, aur hum saath mein Hindi seekhenge! Would you like to work on grammar, vocabulary, or conversational Hindi?",
  },
];

interface ChatMessage {
  role: string;
  content: string;
  timestamp: Date;
}

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  preview_url: string | null;
}

export default function SessionPage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [inSession, setInSession] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [sentiment, setSentiment] = useState("neutral");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);

  // Voice selection
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState("");
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const avatarRef = useRef<any>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSpeechRef = useRef("");
  const isLoadingRef = useRef(false);
  const selectedVoiceRef = useRef("");

  // Keep refs in sync
  messagesRef.current = messages;
  isLoadingRef.current = isLoading;
  selectedVoiceRef.current = selectedVoiceId;

  const persona = personas.find((p) => p.id === selectedPersona);

  // --- Fetch ElevenLabs voices on mount ---
  useEffect(() => {
    setLoadingVoices(true);
    fetch("/api/voices")
      .then((r) => r.json())
      .then((data) => {
        if (data.voices) {
          setVoices(data.voices);
          // Default to first voice
          if (data.voices.length > 0) {
            setSelectedVoiceId(data.voices[0].voice_id);
          }
        }
      })
      .catch((err) => console.error("Failed to load voices:", err))
      .finally(() => setLoadingVoices(false));
  }, []);

  // --- ElevenLabs TTS ---
  const {
    isSpeaking: ttsSpeaking,
    speak: elevenLabsSpeak,
    stop: stopSpeaking,
  } = useElevenLabsTTS({
    onStart: () => setIsAvatarSpeaking(true),
    onEnd: () => setIsAvatarSpeaking(false),
  });

  // Wrapper to speak with selected voice
  const speak = useCallback(
    (text: string) => {
      const voiceId = selectedVoiceRef.current;
      if (voiceId) {
        elevenLabsSpeak(text, voiceId);
      }
    },
    [elevenLabsSpeak]
  );

  // --- Core chat function ---
  const sendToAI = useCallback(
    async (text: string) => {
      if (!persona || isLoadingRef.current) return;

      const studentMsg: ChatMessage = {
        role: "STUDENT",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, studentMsg]);
      setIsAvatarSpeaking(true);
      setSentiment("thinking");
      setIsLoading(true);

      const historyForAI = [...messagesRef.current, studentMsg]
        .filter((m) => m.role === "STUDENT" || m.role === "TUTOR")
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [
        ...prev,
        { role: "TUTOR", content: "", timestamp: new Date() },
      ]);

      try {
        abortRef.current = new AbortController();

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: historyForAI,
            persona: {
              name: persona.name,
              subject: persona.subject,
              style: persona.style,
            },
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error("Chat request failed");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulated = "";

        setSentiment("positive");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastIdx = updated.length - 1;
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      content: accumulated,
                    };
                    return updated;
                  });
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }

        // Speak the complete response with ElevenLabs
        if (accumulated && !isMuted) {
          speak(accumulated);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx].content === "") {
            updated[lastIdx] = {
              ...updated[lastIdx],
              content:
                "I'm sorry, I had trouble responding. Could you try again?",
            };
          }
          return updated;
        });
      } finally {
        if (!ttsSpeaking) setIsAvatarSpeaking(false);
        setSentiment("neutral");
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [persona, isMuted, speak, ttsSpeaking]
  );

  // --- STT: speech recognition ---
  const {
    isListening,
    interimTranscript,
    isSupported: sttSupported,
    start: startListening,
    stop: stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: persona?.language || "en-US",
    continuous: true,
    onResult: (transcript: string, isFinal: boolean) => {
      if (!isFinal) {
        pendingSpeechRef.current = transcript;
        return;
      }

      pendingSpeechRef.current +=
        (pendingSpeechRef.current ? " " : "") + transcript;

      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

      speechTimerRef.current = setTimeout(() => {
        const text = pendingSpeechRef.current.trim();
        if (text && !isLoadingRef.current) {
          pendingSpeechRef.current = "";
          resetTranscript();
          sendToAI(text);
        }
      }, 1500);
    },
  });

  // --- Voice chat controls ---
  const handleStartVoice = useCallback(() => {
    setVoiceListening(true);
    setIsMuted(false);
    if (sttSupported) startListening();
  }, [sttSupported, startListening]);

  const handleStopVoice = useCallback(() => {
    setVoiceListening(false);
    stopListening();
    pendingSpeechRef.current = "";
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
  }, [stopListening]);

  // --- Session lifecycle ---
  const startSession = () => {
    if (!persona) return;
    setInSession(true);
    setMessages([
      { role: "TUTOR", content: persona.greeting, timestamp: new Date() },
    ]);

    // Speak the greeting with ElevenLabs
    if (selectedVoiceId) {
      elevenLabsSpeak(persona.greeting, selectedVoiceId);
    }
  };

  const handleMute = useCallback(() => {
    setIsMuted(true);
    stopListening();
    stopSpeaking();
    pendingSpeechRef.current = "";
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
  }, [stopListening, stopSpeaking]);

  const handleUnmute = useCallback(() => {
    setIsMuted(false);
    if (voiceListening && sttSupported) startListening();
  }, [voiceListening, sttSupported, startListening]);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      pendingSpeechRef.current = "";
      resetTranscript();
      stopSpeaking();
      sendToAI(text);
    },
    [sendToAI, resetTranscript, stopSpeaking]
  );

  const handleEndSession = () => {
    if (abortRef.current) abortRef.current.abort();
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    stopListening();
    stopSpeaking();
    pendingSpeechRef.current = "";
    setInSession(false);
    setMessages([]);
    setSelectedPersona(null);
    setIsAvatarSpeaking(false);
    setSentiment("neutral");
    setIsLoading(false);
    setIsMuted(false);
    setVoiceListening(false);
  };

  // Preview a voice
  const handlePreviewVoice = (url: string | null) => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
    }
    if (!url) return;
    const audio = new Audio(url);
    audio.onended = () => setPreviewAudio(null);
    audio.play();
    setPreviewAudio(audio);
  };

  // ===== ACTIVE SESSION VIEW =====
  if (inSession && persona) {
    return (
      <div className="fixed inset-0 flex bg-gray-950 z-50">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <AvatarCanvas
              ref={avatarRef}
              isSpeaking={isAvatarSpeaking}
              sentiment={sentiment}
              className="w-full h-full"
            />

            {/* Persona name overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-3 rounded-xl bg-gray-900/80 px-4 py-2 backdrop-blur">
              <div className="avatar-animated h-10 w-10 rounded-full overflow-hidden ring-2 ring-blue-400/30">
                <Image
                  src={persona.avatar}
                  alt={persona.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {persona.name}
                </p>
                <p className="text-xs text-gray-400">
                  {persona.subject} · {persona.style}
                </p>
              </div>
            </div>

            {/* Status indicators */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {isLoading && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-600/20 px-3 py-1.5 backdrop-blur">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs text-blue-300">
                    AI is thinking...
                  </span>
                </div>
              )}
              {voiceListening && isListening && !isMuted && (
                <div className="flex items-center gap-2 rounded-lg bg-green-600/20 px-3 py-1.5 backdrop-blur">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-300">Voice active</span>
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <VoiceIndicator
                label="You"
                isActive={voiceListening && isListening && !isMuted}
              />
              <VoiceIndicator label="Tutor" isActive={isAvatarSpeaking} />
            </div>
          </div>

          <SessionControls
            isMuted={isMuted}
            onMute={handleMute}
            onUnmute={handleUnmute}
            onEndSession={handleEndSession}
          />
        </div>

        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isListening={voiceListening && isListening && !isMuted}
          interimTranscript={interimTranscript || pendingSpeechRef.current}
          onStartVoice={handleStartVoice}
          onStopVoice={handleStopVoice}
          voiceSupported={sttSupported}
        />
      </div>
    );
  }

  // ===== PERSONA SELECTION + VOICE PICKER =====
  return (
    <div className="mx-auto max-w-2xl py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Start a Session</h1>
      <p className="text-gray-400 mb-8">
        Choose a tutor and voice to begin your learning session
      </p>

      {!sttSupported && (
        <div className="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
          <p className="text-sm text-yellow-300">
            Your browser doesn&apos;t support voice input. You can still type.
            For voice, use Chrome or Edge.
          </p>
        </div>
      )}

      {/* Persona selection */}
      <div className="grid gap-4 mb-8">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPersona(p.id)}
            className={`avatar-card rounded-xl border p-6 text-left transition ${
              selectedPersona === p.id
                ? "border-blue-400 bg-blue-600/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="avatar-animated h-14 w-14 rounded-full overflow-hidden ring-2 ring-blue-400/30">
                  <Image
                    src={p.avatar}
                    alt={p.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                {selectedPersona === p.id && (
                  <div className="avatar-pulse-ring" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{p.name}</h3>
                <p className="text-sm text-gray-400">
                  {p.subject} · {p.style}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Voice selection */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-1">
          Choose a Voice
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Select an ElevenLabs voice for the tutor
        </p>

        {loadingVoices ? (
          <div className="flex items-center gap-2 py-4">
            <div className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Loading voices...</span>
          </div>
        ) : voices.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">
            No voices available. Check your ElevenLabs API key.
          </p>
        ) : (
          <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
            {voices.map((voice) => (
              <div
                key={voice.voice_id}
                onClick={() => setSelectedVoiceId(voice.voice_id)}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition ${
                  selectedVoiceId === voice.voice_id
                    ? "border-blue-400 bg-blue-600/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      selectedVoiceId === voice.voice_id
                        ? "bg-blue-400"
                        : "bg-gray-600"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {voice.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {voice.labels?.accent || voice.labels?.gender || voice.category}
                      {voice.labels?.age ? ` · ${voice.labels.age}` : ""}
                      {voice.labels?.use_case
                        ? ` · ${voice.labels.use_case}`
                        : ""}
                    </p>
                  </div>
                </div>
                {voice.preview_url && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewVoice(voice.preview_url);
                    }}
                    className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-gray-300 hover:bg-white/20 hover:text-white transition"
                  >
                    Preview
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={startSession}
        disabled={!selectedPersona || !selectedVoiceId}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Start Session
      </button>
    </div>
  );
}
