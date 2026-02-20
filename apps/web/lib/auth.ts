import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
}

export async function auth(): Promise<{ user: AuthUser } | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session-token")?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(sessionToken, "base64").toString()
    );
    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      },
    };
  } catch {
    return null;
  }
}

export function createSessionToken(user: AuthUser): string {
  return Buffer.from(JSON.stringify(user)).toString("base64");
}
