import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950/20 to-gray-950">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Edu<span className="text-blue-400">Avatar</span>
          </h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm text-gray-300 hover:text-white transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            AI Tutors That{" "}
            <span className="text-blue-400">Understand</span> You
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Talk to intelligent 3D avatars that teach, adapt, and grow with your
            students. Built on cutting-edge AI with real-time voice conversation,
            pedagogical reasoning, and learning analytics.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition"
            >
              Start Teaching with AI
            </Link>
            <Link
              href="/session"
              className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-white/40 transition"
            >
              Try a Demo Session
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              title: "Adaptive Teaching",
              description:
                "Avatars adjust difficulty, pace, and teaching style based on student responses using Bloom's Taxonomy.",
            },
            {
              title: "Real-Time Voice",
              description:
                "Sub-second voice-to-voice latency with natural conversation, interruption handling, and emotional awareness.",
            },
            {
              title: "Learning Analytics",
              description:
                "Track comprehension, engagement, misconceptions, and progress across sessions with detailed dashboards.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-left"
            >
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
