"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface TalkingHeadProps {
  modelUrl: string;
  audioStream?: MediaStream | null;
  emotion?: string;
  className?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

/**
 * TalkingHead wrapper component.
 *
 * Integrates with the TalkingHead library (https://github.com/met4citizen/TalkingHead)
 * for production use with Ready Player Me GLB avatars.
 *
 * For MVP, provides a placeholder. In production:
 * 1. Add TalkingHead library to public/lib/ or install via npm
 * 2. Load Ready Player Me GLB model URL
 * 3. Connect WebRTC audio stream for real-time lip-sync
 * 4. Map sentiment states to TalkingHead mood system
 */
export function TalkingHead({
  modelUrl,
  audioStream,
  emotion = "neutral",
  className,
  onReady,
  onError,
}: TalkingHeadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  const initTalkingHead = useCallback(async () => {
    try {
      // Production integration:
      // const { TalkingHead } = await import("talkinghead");
      // instanceRef.current = new TalkingHead(container, { modelUrl, ... });
      // await instanceRef.current.loadModel();
      onReady?.();
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error("TalkingHead init failed"));
    }
  }, [modelUrl, onReady, onError]);

  useEffect(() => {
    initTalkingHead();
    return () => {
      instanceRef.current?.dispose?.();
    };
  }, [initTalkingHead]);

  useEffect(() => {
    if (instanceRef.current && audioStream) {
      instanceRef.current.setAudioStream?.(audioStream);
    }
  }, [audioStream]);

  useEffect(() => {
    if (instanceRef.current && emotion) {
      instanceRef.current.setMood?.(emotion);
    }
  }, [emotion]);

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      {!instanceRef.current && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-gray-600">TalkingHead: {modelUrl}</p>
        </div>
      )}
    </div>
  );
}
