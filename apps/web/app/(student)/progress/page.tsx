const mockProgress = {
  overallScore: 82,
  sessionsCompleted: 12,
  hoursLearned: 4.5,
  streak: 3,
  subjects: [
    {
      name: "Mathematics",
      progress: 68,
      objectives: [
        { name: "Quadratic Equations", status: "MASTERED", score: 92 },
        { name: "Linear Functions", status: "MASTERED", score: 88 },
        { name: "Polynomials", status: "IN_PROGRESS", score: 65 },
        { name: "Trigonometry", status: "NOT_STARTED", score: 0 },
      ],
    },
    {
      name: "Physics",
      progress: 45,
      objectives: [
        { name: "Newton's Laws", status: "IN_PROGRESS", score: 72 },
        { name: "Kinematics", status: "IN_PROGRESS", score: 55 },
        { name: "Energy & Work", status: "NOT_STARTED", score: 0 },
      ],
    },
  ],
};

const statusColors: Record<string, string> = {
  MASTERED: "text-green-400 bg-green-400/10",
  IN_PROGRESS: "text-yellow-400 bg-yellow-400/10",
  NOT_STARTED: "text-gray-500 bg-gray-500/10",
  NEEDS_REVIEW: "text-red-400 bg-red-400/10",
};

const statusLabels: Record<string, string> = {
  MASTERED: "Mastered",
  IN_PROGRESS: "In Progress",
  NOT_STARTED: "Not Started",
  NEEDS_REVIEW: "Needs Review",
};

export default function ProgressPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">My Progress</h1>
      <p className="text-gray-400 mb-8">Track your learning journey</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {[
          { label: "Overall Score", value: `${mockProgress.overallScore}%` },
          { label: "Sessions", value: mockProgress.sessionsCompleted },
          { label: "Hours Learned", value: mockProgress.hoursLearned },
          { label: "Day Streak", value: `${mockProgress.streak} days` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {mockProgress.subjects.map((subject) => (
          <div key={subject.name} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{subject.name}</h2>
              <span className="text-sm text-gray-400">{subject.progress}% complete</span>
            </div>
            <div className="mb-4 h-2 rounded-full bg-gray-800">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${subject.progress}%` }} />
            </div>
            <div className="space-y-2">
              {subject.objectives.map((obj) => (
                <div key={obj.name} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                  <span className="text-sm text-white">{obj.name}</span>
                  <div className="flex items-center gap-3">
                    {obj.score > 0 && <span className="text-sm text-gray-400">{obj.score}%</span>}
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[obj.status]}`}>{statusLabels[obj.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
