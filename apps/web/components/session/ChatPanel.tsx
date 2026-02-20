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
  isListening?: boolean;
  interimTranscript?: string;
  onStartVoice?: () => void;
  onStopVoice?: () => void;
  voiceSupported?: boolean;
}

export function ChatPanel({
  messages,
  onSendMessage,
  isListening,
  interimTranscript,
  onStartVoice,
  onStopVoice,
  voiceSupported = true,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimTranscript]);

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

        {/* Live speech transcript */}
        {isListening && interimTranscript && (
          <div className="flex flex-col items-end">
            <span className="mb-1 text-[10px] uppercase text-gray-600">
              You (speaking)
            </span>
            <div className="max-w-[90%] rounded-lg px-3 py-2 text-sm bg-blue-600/10 text-blue-200/70 border border-blue-400/20 italic">
              {interimTranscript}
              <span className="inline-block w-1 h-3 bg-blue-400 animate-pulse ml-0.5 align-middle" />
            </div>
          </div>
        )}

        {/* Listening indicator */}
        {isListening && !interimTranscript && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 rounded-lg px-3 py-2 bg-blue-600/10 border border-blue-400/20">
              <div className="flex gap-0.5">
                <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" />
                <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-blue-300">Listening...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area with mic button */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {/* Mic toggle */}
        {voiceSupported && (
          <div className="flex items-center justify-center">
            {isListening ? (
              <button
                type="button"
                onClick={onStopVoice}
                className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/30 transition"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop Voice
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartVoice}
                className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/30 transition"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Start Voice
              </button>
            )}
          </div>
        )}

        {/* Text input */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening... or type here" : "Type a message..."}
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
    </div>
  );
}
