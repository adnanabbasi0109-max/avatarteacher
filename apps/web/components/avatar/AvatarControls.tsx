"use client";

import React from "react";

interface AvatarControlsProps {
  onChangeExpression?: (expression: string) => void;
  className?: string;
}

const EXPRESSIONS = [
  { id: "neutral", label: "Neutral" },
  { id: "happy", label: "Happy" },
  { id: "thinking", label: "Thinking" },
  { id: "encouraging", label: "Encouraging" },
  { id: "concerned", label: "Concerned" },
];

export function AvatarControls({ onChangeExpression, className }: AvatarControlsProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <span className="text-xs text-gray-500">Expression:</span>
      {EXPRESSIONS.map((expr) => (
        <button
          key={expr.id}
          onClick={() => onChangeExpression?.(expr.id)}
          className="rounded-md border border-white/10 px-2 py-1 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-400 transition"
          title={expr.label}
        >
          {expr.label}
        </button>
      ))}
    </div>
  );
}
