"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AudioProcessor } from "@/lib/audio-processor";

export function useVoiceActivity() {
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const processorRef = useRef<AudioProcessor | null>(null);
  const rafRef = useRef<number>(0);

  const start = useCallback(async () => {
    const processor = new AudioProcessor();
    const mediaStream = await processor.initialize();
    processorRef.current = processor;
    setStream(mediaStream);

    const monitor = () => {
      if (!processorRef.current) return;
      const vol = processorRef.current.getVolume();
      setVolume(vol);
      setIsActive(processorRef.current.isVoiceActive());
      rafRef.current = requestAnimationFrame(monitor);
    };
    monitor();
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    processorRef.current?.dispose();
    processorRef.current = null;
    setStream(null);
    setIsActive(false);
    setVolume(0);
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      processorRef.current?.dispose();
    };
  }, []);

  return { isActive, volume, stream, start, stop };
}
