"use client";

import { useState } from "react";
import { SessionView } from "@/components/session/SessionView";
import { useSession } from "@/hooks/useSession";

const mockPersonas = [
  { id: "p1", name: "Prof. Ada", subject: "Mathematics", style: "Socratic" },
  { id: "p2", name: "Dr. Newton", subject: "Physics", style: "Example-Based" },
  { id: "p3", name: "Ms. Sharma", subject: "Hindi", style: "Collaborative" },
];

export default function SessionPage() {
  const session = useSession();
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  if (session.isConnected && session.token && session.livekitUrl) {
    return (
      <SessionView
        sessionConfig={{ personaId: selectedPersona || "p1", courseId: "c1" }}
        livekitUrl={session.livekitUrl}
        token={session.token}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Start a Session</h1>
      <p className="text-gray-400 mb-8">Choose a tutor to begin your learning session</p>

      <div className="grid gap-4">
        {mockPersonas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => setSelectedPersona(persona.id)}
            className={`rounded-xl border p-6 text-left transition ${
              selectedPersona === persona.id
                ? "border-blue-400 bg-blue-600/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-lg font-bold text-white">{persona.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">{persona.name}</h3>
                <p className="text-sm text-gray-400">{persona.subject} · {persona.style}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => session.startSession({ personaId: selectedPersona || "p1", courseId: "c1" })}
        disabled={!selectedPersona || session.isConnecting}
        className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {session.isConnecting ? "Connecting..." : "Start Session"}
      </button>

      {session.error && <p className="mt-4 text-sm text-red-400">{session.error}</p>}
    </div>
  );
}
