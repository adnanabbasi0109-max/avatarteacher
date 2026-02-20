import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = body.event;

  switch (event) {
    case "room_started":
      console.log("Room started:", body.room?.name);
      break;
    case "room_finished":
      console.log("Room finished:", body.room?.name);
      break;
    case "participant_joined":
      console.log("Participant joined:", body.participant?.identity);
      break;
    case "participant_left":
      console.log("Participant left:", body.participant?.identity);
      break;
    default:
      console.log("Unknown webhook event:", event);
  }

  return NextResponse.json({ received: true });
}
