"use client";

import React, { useRef, useEffect, useState } from "react";

interface ChatMessage {
  role: string;
  content: string;
  timestamp: Date;
  sentiment?: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex w-80 flex-col border-l border-white/10 bg-gray-900/50">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-medium text-white">Chat</h3>
        <p className="text-xs text-gray-500">Transcript of your conversation</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-600 mt-8">
            Your conversation will appear here...
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.role === "STUDENT" ? "items-end" : "items-start"
            }`}
          >
            <span className="mb-1 text-[10px] uppercase text-gray-600">
              {msg.role === "STUDENT" ? "You" : "Tutor"}
            </span>
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "STUDENT"
                  ? "bg-blue-600/20 text-blue-100"
                  : "bg-white/5 text-gray-300"
              }`}
            >
              {msg.content}
            </div>
            <span className="mt-1 text-[10px] text-gray-700">
              {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
