import Image from "next/image";

const personaAvatars: Record<string, string> = {
  "Prof. Ada": "/avatars/prof-ada.jpg",
  "Sir Walter Lewin": "/avatars/sir-walter-lewin.jpg",
  "Ms. Sharma": "/avatars/ms-sharma.jpg",
};

const mockHistory = [
  { id: "1", persona: "Prof. Ada", subject: "Mathematics", topic: "Quadratic Equations", duration: "22 min", score: 85, date: "Today, 2:30 PM" },
  { id: "2", persona: "Sir Walter Lewin", subject: "Physics", topic: "Newton's Laws", duration: "18 min", score: 72, date: "Yesterday, 4:15 PM" },
  { id: "3", persona: "Prof. Ada", subject: "Mathematics", topic: "Linear Algebra", duration: "30 min", score: 91, date: "Feb 18, 10:00 AM" },
  { id: "4", persona: "Ms. Sharma", subject: "Hindi", topic: "Grammar Basics", duration: "15 min", score: 88, date: "Feb 17, 3:45 PM" },
];

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Session History</h1>
      <p className="text-gray-400 mb-8">Review your past learning sessions</p>

      <div className="space-y-4">
        {mockHistory.map((session, i) => (
          <div key={session.id} className="avatar-card rounded-xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="avatar-animated h-10 w-10 rounded-full overflow-hidden ring-2 ring-blue-400/20">
                  <Image
                    src={personaAvatars[session.persona] || "/avatars/prof-ada.jpg"}
                    alt={session.persona}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white">{session.topic}</h3>
                  <p className="text-sm text-gray-500">{session.persona} · {session.subject} · {session.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${session.score >= 80 ? "text-green-400" : session.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>{session.score}%</p>
                <p className="text-xs text-gray-600">{session.date}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition">View Transcript</button>
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition">Continue Topic</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
