"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LiveKitRoom,
  useRoomContext,
  useTracks,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { Track, RoomEvent } from "livekit-client";
import { AvatarCanvas } from "../avatar/AvatarCanvas";
import { ChatPanel } from "./ChatPanel";
import { SessionControls } from "./SessionControls";
import { VoiceIndicator } from "./VoiceIndicator";

interface ChatMessage {
  role: string;
  content: string;
  timestamp: Date;
  sentiment?: string;
}

interface VisualContent {
  type: string;
  description: string;
}

interface SessionConfig {
  personaId: string;
  courseId: string;
  moduleId?: string;
  language?: string;
}

interface SessionViewProps {
  sessionConfig: SessionConfig;
  livekitUrl: string;
  token: string;
}

export function SessionView({ sessionConfig, livekitUrl, token }: SessionViewProps) {
  return (
    <LiveKitRoom
      serverUrl={livekitUrl}
      token={token}
      connect={true}
      audio={true}
      video={false}
      options={{
        adaptiveStream: true,
        dynacast: true,
      }}
    >
      <SessionContent config={sessionConfig} />
    </LiveKitRoom>
  );
}

function SessionContent({ config }: { config: SessionConfig }) {
  const room = useRoomContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sentiment, setSentiment] = useState("neutral");
  const [visualContent, setVisualContent] = useState<VisualContent | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const avatarRef = useRef<any>(null);

  const agentTracks = useTracks([Track.Source.Microphone], {
    onlySubscribed: true,
  });

  useEffect(() => {
    const agentAudioTrack = agentTracks.find(
      (t) => t.participant.identity === "agent"
    );

    if (agentAudioTrack?.publication?.track) {
      const mediaStream = new MediaStream([
        agentAudioTrack.publication.track.mediaStreamTrack,
      ]);

      if (audioRef.current) {
        audioRef.current.srcObject = mediaStream;
        audioRef.current.play().catch(() => {});
      }

      if (avatarRef.current) {
        avatarRef.current.setAudioStream(mediaStream);
      }

      setIsAvatarSpeaking(true);
    } else {
      setIsAvatarSpeaking(false);
    }
  }, [agentTracks]);

  useEffect(() => {
    const handleDataReceived = (payload: Uint8Array) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));

        switch (data.type) {
          case "transcript":
            setMessages((prev) => [
              ...prev,
              {
                role: data.role,
                content: data.text,
                timestamp: new Date(),
                sentiment: data.sentiment,
              },
            ]);
            break;
          case "display_visual":
            setVisualContent(data.payload);
            break;
          case "sentiment_update":
            setSentiment(data.sentiment);
            break;
        }
      } catch (e) {
        console.error("Failed to parse data message:", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  useEffect(() => {
    room.localParticipant?.registerRpcMethod("display_visual", async (data: any) => {
      const payload = JSON.parse(data.payload);
      setVisualContent(payload);
      return JSON.stringify({ success: true });
    });
  }, [room]);

  const handleMute = () => {
    room.localParticipant?.setMicrophoneEnabled(false);
    setIsMuted(true);
  };

  const handleUnmute = () => {
    room.localParticipant?.setMicrophoneEnabled(true);
    setIsMuted(false);
  };

  const handleSendMessage = (text: string) => {
    room.localParticipant?.publishData(
      new TextEncoder().encode(
        JSON.stringify({ type: "text_message", text })
      ),
      { reliable: true }
    );
    setMessages((prev) => [
      ...prev,
      { role: "STUDENT", content: text, timestamp: new Date() },
    ]);
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <AvatarCanvas
            ref={avatarRef}
            isSpeaking={isAvatarSpeaking}
            sentiment={sentiment}
            className="w-full h-full"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
            <VoiceIndicator label="You" isActive={isUserSpeaking} />
            <VoiceIndicator label="Tutor" isActive={isAvatarSpeaking} />
          </div>

          {visualContent && (
            <div className="absolute top-4 right-4 max-w-md rounded-xl border border-white/10 bg-gray-900/90 p-4 shadow-2xl backdrop-blur">
              <button
                onClick={() => setVisualContent(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <div className="text-sm text-gray-300">
                <p className="mb-1 text-xs font-medium uppercase text-blue-400">
                  {visualContent.type}
                </p>
                <p>{visualContent.description}</p>
              </div>
            </div>
          )}
        </div>

        <SessionControls
          isMuted={isMuted}
          onMute={handleMute}
          onUnmute={handleUnmute}
          onEndSession={() => room.disconnect()}
        />
      </div>

      <ChatPanel messages={messages} onSendMessage={handleSendMessage} />

      <audio ref={audioRef} autoPlay />
      <RoomAudioRenderer />
    </div>
  );
}
