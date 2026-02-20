// ============================================================
// EduAvatar Shared Types
// ============================================================

// --- User & Auth ---
export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

// --- Course ---
export interface Course {
  id: string;
  title: string;
  description?: string;
  subject: string;
  gradeLevel: string;
  teacherId: string;
  modules?: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  courseId: string;
  learningObjectives?: LearningObjective[];
  contentChunks?: ContentChunk[];
  createdAt: string;
}

// --- Learning ---
export type BloomLevel =
  | "REMEMBER"
  | "UNDERSTAND"
  | "APPLY"
  | "ANALYZE"
  | "EVALUATE"
  | "CREATE";

export interface LearningObjective {
  id: string;
  description: string;
  bloomLevel: BloomLevel;
  moduleId: string;
}

export type ContentType =
  | "TEXT"
  | "CONCEPT"
  | "EXAMPLE"
  | "EXERCISE"
  | "FORMULA"
  | "DEFINITION"
  | "DIAGRAM_DESCRIPTION";

export interface ContentChunk {
  id: string;
  content: string;
  contentType: ContentType;
  sourceFile?: string;
  moduleId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// --- Persona ---
export type TeachingStyle =
  | "SOCRATIC"
  | "DIRECT"
  | "EXAMPLE_BASED"
  | "COLLABORATIVE"
  | "ADAPTIVE";

export interface Persona {
  id: string;
  name: string;
  avatarModelUrl: string;
  voiceId: string;
  voiceProvider: string;
  personalityPrompt: string;
  teachingStyle: TeachingStyle;
  languageCode: string;
  courseId?: string;
  teacherId: string;
  createdAt: string;
}

// --- Session ---
export type SessionStatus = "ACTIVE" | "COMPLETED" | "INTERRUPTED" | "ERROR";
export type MessageRole = "STUDENT" | "AVATAR" | "SYSTEM";

export interface Session {
  id: string;
  studentId: string;
  personaId: string;
  livekitRoomId?: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  status: SessionStatus;
  transcript?: SessionMessage[];
}

export interface SessionMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  audioUrl?: string;
  duration?: number;
  confidence?: number;
  sentiment?: string;
  bloomLevel?: BloomLevel;
}

export interface SessionAnalytics {
  id: string;
  sessionId: string;
  totalTurns: number;
  avgResponseLatency: number;
  studentSpeakTime: number;
  avatarSpeakTime: number;
  interruptionCount: number;
  questionsAsked: number;
  questionsAnswered: number;
  comprehensionScore?: number;
  engagementScore?: number;
  topicsDiscussed: string[];
  misconceptions?: Record<string, unknown>;
  createdAt: string;
}

export interface SentimentEntry {
  id: string;
  sessionId: string;
  timestamp: string;
  sentiment: string;
  confidence: number;
  trigger?: string;
}

// --- Progress ---
export type ProgressStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "MASTERED"
  | "NEEDS_REVIEW";

export interface LearningProgress {
  id: string;
  studentId: string;
  objectiveId: string;
  status: ProgressStatus;
  score?: number;
  attempts: number;
  lastAttemptAt?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
}

// --- LiveKit ---
export interface LiveKitTokenResponse {
  token: string;
  roomName: string;
  sessionId: string;
  url: string;
}

export interface SessionConfig {
  personaId: string;
  courseId: string;
  moduleId?: string;
  language?: string;
}

// --- Chat ---
export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: Date;
  sentiment?: string;
}

// --- Visual Content ---
export interface VisualContent {
  type: "diagram" | "chart" | "formula" | "image";
  description: string;
  data?: unknown;
}
