"use client";

import { useRef, useState, useCallback } from "react";

export function useAvatar() {
  const avatarRef = useRef<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emotion, setEmotion] = useState("neutral");

  const setAudioStream = useCallback((stream: MediaStream) => {
    avatarRef.current?.setAudioStream(stream);
  }, []);

  const setAvatarEmotion = useCallback((newEmotion: string) => {
    setEmotion(newEmotion);
    avatarRef.current?.setEmotion(newEmotion);
  }, []);

  const speak = useCallback(async (audioUrl: string) => {
    setIsSpeaking(true);
    await avatarRef.current?.speak(audioUrl);
    setIsSpeaking(false);
  }, []);

  return {
    avatarRef,
    isSpeaking,
    setIsSpeaking,
    emotion,
    setEmotion: setAvatarEmotion,
    setAudioStream,
    speak,
  };
}
