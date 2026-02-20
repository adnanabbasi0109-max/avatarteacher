"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/courses", label: "Courses" },
  { href: "/personas", label: "Personas" },
  { href: "/analytics", label: "Analytics" },
  { href: "/content", label: "Content" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-white/10 bg-gray-900/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="text-xl font-bold text-white">
            Edu<span className="text-blue-400">Avatar</span>
          </Link>
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Teacher</span>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-medium">T</div>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-400 transition">Logout</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
