export interface AvatarState {
  isLoaded: boolean;
  isSpeaking: boolean;
  currentEmotion: string;
  currentPose: string;
}

export const DEFAULT_AVATAR_STATE: AvatarState = {
  isLoaded: false,
  isSpeaking: false,
  currentEmotion: "neutral",
  currentPose: "standing",
};

export const EMOTION_MAP: Record<string, string> = {
  neutral: "neutral",
  confused: "concerned",
  excited: "happy",
  frustrated: "concerned",
  engaged: "encouraging",
  bored: "neutral",
};

export function mapSentimentToEmotion(sentiment: string): string {
  return EMOTION_MAP[sentiment] || "neutral";
}
