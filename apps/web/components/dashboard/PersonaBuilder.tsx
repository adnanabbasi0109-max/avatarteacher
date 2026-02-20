"use client";

import React, { useState } from "react";

interface PersonaBuilderProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const TEACHING_STYLES = [
  { value: "SOCRATIC", label: "Socratic", desc: "Guides through questions" },
  { value: "DIRECT", label: "Direct", desc: "Clear step-by-step explanations" },
  { value: "EXAMPLE_BASED", label: "Example-Based", desc: "Teaches through examples" },
  { value: "COLLABORATIVE", label: "Collaborative", desc: "Works through problems together" },
  { value: "ADAPTIVE", label: "Adaptive", desc: "Switches style based on needs" },
];

const VOICE_PROVIDERS = [
  { value: "cartesia", label: "Cartesia Sonic", desc: "Ultra-low latency" },
  { value: "elevenlabs", label: "ElevenLabs", desc: "Premium quality" },
  { value: "kokoro", label: "Kokoro", desc: "Open-source, self-hosted" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ur", label: "Urdu" },
  { value: "mr", label: "Marathi" },
];

export function PersonaBuilder({ onSave, onCancel }: PersonaBuilderProps) {
  const [name, setName] = useState("");
  const [personalityPrompt, setPersonalityPrompt] = useState(
    "You are a friendly, patient, and encouraging tutor who loves helping students learn."
  );
  const [teachingStyle, setTeachingStyle] = useState("ADAPTIVE");
  const [voiceProvider, setVoiceProvider] = useState("cartesia");
  const [language, setLanguage] = useState("en");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, personalityPrompt, teachingStyle, voiceProvider, language });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Persona Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
          placeholder="e.g. Prof. Ada, Dr. Newton"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Personality Prompt
        </label>
        <textarea
          value={personalityPrompt}
          onChange={(e) => setPersonalityPrompt(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none resize-none"
          placeholder="Describe the persona's personality, tone, and teaching approach..."
        />
        <p className="mt-1 text-xs text-gray-600">
          This becomes part of the AI system prompt. Be specific about personality traits.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Teaching Style
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TEACHING_STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setTeachingStyle(style.value)}
              className={`rounded-lg border p-3 text-left transition ${
                teachingStyle === style.value
                  ? "border-blue-400 bg-blue-600/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <p className="text-sm font-medium text-white">{style.label}</p>
              <p className="text-xs text-gray-500">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Voice Provider
          </label>
          <select
            value={voiceProvider}
            onChange={(e) => setVoiceProvider(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
          >
            {VOICE_PROVIDERS.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label} - {v.desc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
        >
          Create Persona
        </button>
      </div>
    </form>
  );
}
