const mockCourses = [
  { id: "1", title: "Introduction to Mathematics", subject: "Mathematics", gradeLevel: "Grade 9", modules: 8, students: 24, status: "Active" },
  { id: "2", title: "Physics Fundamentals", subject: "Physics", gradeLevel: "Grade 10", modules: 12, students: 18, status: "Active" },
  { id: "3", title: "English Literature", subject: "English", gradeLevel: "Grade 11", modules: 6, students: 30, status: "Draft" },
];

export default function CoursesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your courses and curriculum</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition">
          Create Course
        </button>
      </div>

      <div className="grid gap-4">
        {mockCourses.map((course) => (
          <div key={course.id} className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-blue-400/30 transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                  <span>{course.subject}</span>
                  <span>·</span>
                  <span>{course.gradeLevel}</span>
                  <span>·</span>
                  <span>{course.modules} modules</span>
                  <span>·</span>
                  <span>{course.students} students</span>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${course.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                {course.status}
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-400 transition">Edit Course</button>
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-400 transition">Manage Content</button>
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-400 transition">View Analytics</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
