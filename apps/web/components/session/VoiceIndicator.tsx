"use client";

import React from "react";

interface VoiceIndicatorProps {
  label: string;
  isActive: boolean;
}

export function VoiceIndicator({ label, isActive }: VoiceIndicatorProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-gray-900/80 px-4 py-2 backdrop-blur">
      <div className="relative">
        <div
          className={`h-3 w-3 rounded-full transition-colors ${
            isActive ? "bg-green-400" : "bg-gray-600"
          }`}
        />
        {isActive && (
          <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75" />
        )}
      </div>
      <span className="text-xs text-gray-300">{label}</span>
    </div>
  );
}
