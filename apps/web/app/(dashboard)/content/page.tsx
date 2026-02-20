const mockContent = [
  { id: "1", name: "Algebra Basics.pdf", course: "Mathematics", type: "PDF", size: "2.4 MB", chunks: 45, date: "2 days ago" },
  { id: "2", name: "Newton Laws Notes.docx", course: "Physics", type: "DOCX", size: "1.1 MB", chunks: 22, date: "1 week ago" },
  { id: "3", name: "Grammar Rules.pdf", course: "English", type: "PDF", size: "3.7 MB", chunks: 68, date: "2 weeks ago" },
];

export default function ContentPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Library</h1>
          <p className="text-sm text-gray-400 mt-1">Upload and manage curriculum content for RAG</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition">Upload Content</button>
      </div>

      <div className="mb-8 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-12 text-center hover:border-blue-400/30 transition cursor-pointer">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10">
          <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-sm text-gray-400">Drag and drop files here, or click to browse</p>
        <p className="mt-1 text-xs text-gray-600">Supports PDF, DOCX, TXT, MD (max 50MB)</p>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">File</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Chunks</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Uploaded</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockContent.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600/10 text-xs font-medium text-blue-400">{item.type}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.size}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{item.course}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{item.chunks}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-gray-500 hover:text-red-400 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
