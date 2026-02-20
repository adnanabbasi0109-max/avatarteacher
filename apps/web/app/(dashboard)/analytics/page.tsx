const mockAnalytics = {
  totalSessions: 156,
  totalStudents: 42,
  avgSessionDuration: "18 min",
  avgComprehension: 78,
  recentSessions: [
    { student: "Aarav Patel", course: "Mathematics", duration: "22 min", score: 85, date: "Today" },
    { student: "Priya Singh", course: "Physics", duration: "15 min", score: 72, date: "Today" },
    { student: "Rahul Kumar", course: "Mathematics", duration: "25 min", score: 91, date: "Yesterday" },
    { student: "Ananya Sharma", course: "English", duration: "12 min", score: 68, date: "Yesterday" },
    { student: "Vikram Reddy", course: "Physics", duration: "20 min", score: 79, date: "2 days ago" },
  ],
  topMisconceptions: [
    { topic: "Quadratic Formula", count: 12, course: "Mathematics" },
    { topic: "Newton's Third Law", count: 8, course: "Physics" },
    { topic: "Subject-Verb Agreement", count: 6, course: "English" },
  ],
};

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Monitor student engagement and learning outcomes</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Total Sessions", value: mockAnalytics.totalSessions },
          { label: "Active Students", value: mockAnalytics.totalStudents },
          { label: "Avg. Duration", value: mockAnalytics.avgSessionDuration },
          { label: "Avg. Comprehension", value: `${mockAnalytics.avgComprehension}%` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Sessions</h2>
          <div className="space-y-3">
            {mockAnalytics.recentSessions.map((session, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{session.student}</p>
                  <p className="text-xs text-gray-500">{session.course} · {session.duration}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${session.score >= 80 ? "text-green-400" : session.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>{session.score}%</p>
                  <p className="text-xs text-gray-600">{session.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Common Misconceptions</h2>
          <div className="space-y-3">
            {mockAnalytics.topMisconceptions.map((item, i) => (
              <div key={i} className="rounded-lg bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">{item.topic}</p>
                  <span className="text-xs text-gray-500">{item.course}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-gray-800">
                    <div className="h-full rounded-full bg-red-400" style={{ width: `${(item.count / 15) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{item.count} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
