"use client";

import { useState, useCallback, useRef } from "react";

interface SessionConfig {
  personaId: string;
  courseId: string;
  moduleId?: string;
  language?: string;
}

interface SessionState {
  isConnected: boolean;
  isConnecting: boolean;
  sessionId: string | null;
  roomName: string | null;
  token: string | null;
  livekitUrl: string | null;
  error: string | null;
}

export function useSession() {
  const [state, setState] = useState<SessionState>({
    isConnected: false,
    isConnecting: false,
    sessionId: null,
    roomName: null,
    token: null,
    livekitUrl: null,
    error: null,
  });
  const startTimeRef = useRef<Date | null>(null);

  const startSession = useCallback(async (config: SessionConfig) => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error("Failed to get session token");

      const data = await res.json();

      setState({
        isConnected: true,
        isConnecting: false,
        sessionId: data.sessionId,
        roomName: data.roomName,
        token: data.token,
        livekitUrl: data.url,
        error: null,
      });

      startTimeRef.current = new Date();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: err instanceof Error ? err.message : "Failed to start session",
      }));
    }
  }, []);

  const endSession = useCallback(() => {
    setState({
      isConnected: false,
      isConnecting: false,
      sessionId: null,
      roomName: null,
      token: null,
      livekitUrl: null,
      error: null,
    });
    startTimeRef.current = null;
  }, []);

  return {
    ...state,
    startSession,
    endSession,
  };
}
