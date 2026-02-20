import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const sessions: Record<string, any> = {};

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userSessions = Object.values(sessions).filter(
    (s: any) => s.studentId === session.user.id
  );

  return NextResponse.json({ sessions: userSessions });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const newSession = {
    id: `sess-${Date.now()}`,
    studentId: session.user.id,
    personaId: data.personaId,
    livekitRoomId: data.roomName,
    startedAt: new Date().toISOString(),
    status: "ACTIVE",
    ...data,
  };

  sessions[newSession.id] = newSession;

  return NextResponse.json({ session: newSession });
}
