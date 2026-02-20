import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createLiveKitToken } from "@/lib/livekit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { personaId, courseId, moduleId } = await req.json();

  if (!personaId || !courseId) {
    return NextResponse.json(
      { error: "personaId and courseId are required" },
      { status: 400 }
    );
  }

  const roomName = `session-${session.user.id}-${Date.now()}`;

  const token = await createLiveKitToken(
    session.user.id,
    session.user.name,
    roomName,
    JSON.stringify({ role: "student" })
  );

  return NextResponse.json({
    token,
    roomName,
    sessionId: `sess-${Date.now()}`,
    url: process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880",
  });
}
