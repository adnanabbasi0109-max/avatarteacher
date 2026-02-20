// ============================================================
// EduAvatar Shared Configuration
// ============================================================

export const config = {
  app: {
    name: "EduAvatar",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  livekit: {
    url: process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880",
    apiKey: process.env.LIVEKIT_API_KEY || "devkey",
    apiSecret: process.env.LIVEKIT_API_SECRET || "secret",
  },

  session: {
    maxDurationSeconds: 3600, // 1 hour
    tokenExpirySeconds: 3600,
    maxConcurrentSessions: 50,
  },

  avatar: {
    defaultModelUrl: "/avatars/default-tutor.glb",
    defaultVoiceId: "default",
    defaultVoiceProvider: "cartesia",
    defaultLanguage: "en",
  },

  pedagogy: {
    defaultTeachingStyle: "ADAPTIVE" as const,
    quizCooldownMinutes: 5,
    maxQuizQuestions: 5,
    comprehensionThreshold: 0.7,
    masteryThreshold: 0.85,
  },

  analytics: {
    sentimentUpdateIntervalMs: 5000,
    analyticsFlushIntervalMs: 30000,
  },

  supported: {
    languages: [
      { code: "en", name: "English" },
      { code: "hi", name: "Hindi" },
      { code: "ur", name: "Urdu" },
      { code: "mr", name: "Marathi" },
    ],
    voiceProviders: ["cartesia", "elevenlabs", "kokoro"] as const,
    teachingStyles: [
      "SOCRATIC",
      "DIRECT",
      "EXAMPLE_BASED",
      "COLLABORATIVE",
      "ADAPTIVE",
    ] as const,
    bloomLevels: [
      "REMEMBER",
      "UNDERSTAND",
      "APPLY",
      "ANALYZE",
      "EVALUATE",
      "CREATE",
    ] as const,
  },
} as const;

export type Config = typeof config;
