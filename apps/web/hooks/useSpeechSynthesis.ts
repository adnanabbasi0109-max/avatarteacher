"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseSpeechSynthesisOptions {
  voice?: string; // Voice name preference
  rate?: number;
  pitch?: number;
  language?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const { rate = 1, pitch = 1, language = "en-US", onStart, onEnd } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const callbacksRef = useRef({ onStart, onEnd });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  callbacksRef.current = { onStart, onEnd };

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);

    const loadVoices = () => {
      const available = window.speechSynthesis?.getVoices() || [];
      setVoices(available);
    };

    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const selectVoice = useCallback(
    (voiceName?: string): SpeechSynthesisVoice | null => {
      if (!voices.length) return null;

      // Try exact match
      if (voiceName) {
        const exact = voices.find((v) =>
          v.name.toLowerCase().includes(voiceName.toLowerCase())
        );
        if (exact) return exact;
      }

      // Prefer a natural-sounding voice for the language
      const langVoices = voices.filter((v) => v.lang.startsWith(language.split("-")[0]));
      // Prefer voices with "Natural", "Premium", or "Enhanced" in the name
      const natural = langVoices.find(
        (v) =>
          v.name.includes("Natural") ||
          v.name.includes("Premium") ||
          v.name.includes("Enhanced")
      );
      if (natural) return natural;

      // Fall back to first voice for the language, or first available voice
      return langVoices[0] || voices[0] || null;
    },
    [voices, language]
  );

  const speak = useCallback(
    (text: string, voiceName?: string) => {
      if (!isSupported || !text.trim()) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Strip markdown formatting for cleaner speech
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/#{1,6}\s/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = language;

      const voice = selectVoice(voiceName);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        callbacksRef.current.onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        callbacksRef.current.onEnd?.();
      };

      utterance.onerror = (e) => {
        if (e.error === "canceled") return; // Normal when we cancel
        console.error("Speech synthesis error:", e.error);
        setIsSpeaking(false);
        callbacksRef.current.onEnd?.();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, rate, pitch, language, selectVoice]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    isSupported,
    voices,
    speak,
    stop,
  };
}
