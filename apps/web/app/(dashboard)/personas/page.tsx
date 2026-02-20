const mockPersonas = [
  { id: "1", name: "Prof. Ada", subject: "Mathematics", teachingStyle: "SOCRATIC", language: "English", voiceProvider: "cartesia" },
  { id: "2", name: "Dr. Newton", subject: "Physics", teachingStyle: "EXAMPLE_BASED", language: "English", voiceProvider: "elevenlabs" },
  { id: "3", name: "Ms. Sharma", subject: "Hindi Literature", teachingStyle: "COLLABORATIVE", language: "Hindi", voiceProvider: "cartesia" },
];

const styleLabels: Record<string, string> = {
  SOCRATIC: "Socratic Method",
  DIRECT: "Direct Instruction",
  EXAMPLE_BASED: "Example-Based",
  COLLABORATIVE: "Collaborative",
  ADAPTIVE: "Adaptive",
};

export default function PersonasPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Avatar Personas</h1>
          <p className="text-sm text-gray-400 mt-1">Configure AI tutor personalities and teaching styles</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition">
          Create Persona
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPersonas.map((persona) => (
          <div key={persona.id} className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-blue-400/30 transition">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto">
              <span className="text-2xl font-bold text-white">{persona.name.charAt(0)}</span>
            </div>
            <h3 className="text-center text-lg font-semibold text-white">{persona.name}</h3>
            <p className="text-center text-sm text-gray-400 mt-1">{persona.subject}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Teaching Style</span>
                <span className="text-gray-300">{styleLabels[persona.teachingStyle]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Language</span>
                <span className="text-gray-300">{persona.language}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Voice</span>
                <span className="text-gray-300">{persona.voiceProvider}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg border border-white/10 py-2 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-400 transition">Edit</button>
              <button className="flex-1 rounded-lg bg-blue-600/20 py-2 text-xs text-blue-400 hover:bg-blue-600/30 transition">Test Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
