import { NextResponse } from "next/server";

// Curated list of popular ElevenLabs premade voices
// These are always available on all ElevenLabs accounts
const PREMADE_VOICES = [
  {
    voice_id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    labels: { accent: "American", gender: "Female", age: "Young", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/df6788f9-5c96-470d-8571-1f25d5f56aca.mp3",
  },
  {
    voice_id: "29vD33N1CtxCmqQRPOHJ",
    name: "Drew",
    labels: { accent: "American", gender: "Male", age: "Middle Aged", use_case: "News" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/29vD33N1CtxCmqQRPOHJ/e8b52a3f-9732-440f-b78a-16d5e26407a1.mp3",
  },
  {
    voice_id: "2EiwWnXFnvU5JabPnv8n",
    name: "Clyde",
    labels: { accent: "American", gender: "Male", age: "Middle Aged", use_case: "Characters" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/2EiwWnXFnvU5JabPnv8n/65d80f52-703f-4cae-a91d-75d4e200ed02.mp3",
  },
  {
    voice_id: "5Q0t7uMcjvnagumLfvZi",
    name: "Paul",
    labels: { accent: "American", gender: "Male", age: "Middle Aged", use_case: "News" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/5Q0t7uMcjvnagumLfvZi/3ce8e81c-4f33-406a-ae1a-8e26bae1e014.mp3",
  },
  {
    voice_id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    labels: { accent: "American", gender: "Female", age: "Young", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/AZnzlk1XvdvUeBnXmlld/69c5373f-0dc2-4efd-9232-a0140182c0a9.mp3",
  },
  {
    voice_id: "CYw3kZ02Hs0563khs1Fj",
    name: "Dave",
    labels: { accent: "British-Essex", gender: "Male", age: "Young", use_case: "Conversational" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/CYw3kZ02Hs0563khs1Fj/872cb056-45d3-419e-914c-7c3dc90e7474.mp3",
  },
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    labels: { accent: "American", gender: "Female", age: "Young", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/04b81273-1276-4684-8c79-2e8e1a2f8822.mp3",
  },
  {
    voice_id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    labels: { accent: "American", gender: "Male", age: "Young", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/ErXwobaYiN019PkySvjV/38d8f8f0-1122-4333-b323-0b87478d506a.mp3",
  },
  {
    voice_id: "MF3mGyEYCl7XYWbV9V6O",
    name: "Elli",
    labels: { accent: "American", gender: "Female", age: "Young", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/MF3mGyEYCl7XYWbV9V6O/d8539e7c-b727-4d55-b5eb-8eae8545643c.mp3",
  },
  {
    voice_id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh",
    labels: { accent: "American", gender: "Male", age: "Young", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/TxGEqnHWrfWFTfGW9XjX/1e4b3e97-a7a1-4519-a531-a0a1c2e4e9e0.mp3",
  },
  {
    voice_id: "VR6AewLTigWG4xSOukaG",
    name: "Arnold",
    labels: { accent: "American", gender: "Male", age: "Middle Aged", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWG4xSOukaG/efd03df8-31e4-4019-8357-4fe0f92d02ee.mp3",
  },
  {
    voice_id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    labels: { accent: "American", gender: "Male", age: "Middle Aged", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/e0b45450-78db-49b9-aaa4-04082a6d48b4.mp3",
  },
  {
    voice_id: "yoZ06aMxZJJ28mfd3POQ",
    name: "Sam",
    labels: { accent: "American", gender: "Male", age: "Young", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/yoZ06aMxZJJ28mfd3POQ/b4cde543-0b55-4f36-8e8b-cca6534be2c6.mp3",
  },
  {
    voice_id: "pqHfZKP75CvOlQylNhV4",
    name: "Bill",
    labels: { accent: "American", gender: "Male", age: "Old", use_case: "Documentary" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3",
  },
  {
    voice_id: "nPczCjzI2devNBz1zQrb",
    name: "Brian",
    labels: { accent: "American", gender: "Male", age: "Middle Aged", use_case: "Narration" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/0c97abae-c846-462a-ba7a-5e4e78a074eb.mp3",
  },
  {
    voice_id: "onwK4e9ZLuTAKqWW03F9",
    name: "Daniel",
    labels: { accent: "British", gender: "Male", age: "Middle Aged", use_case: "News" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/2e0ef7ea-24a1-4e22-bd5b-4c2cf52db82c.mp3",
  },
  {
    voice_id: "XB0fDUnXU5powFXDhCwa",
    name: "Charlotte",
    labels: { accent: "English-Swedish", gender: "Female", age: "Young", use_case: "Characters" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/XB0fDUnXU5powFXDhCwa/c3f44162-6599-4942-b5a3-0c39be9dfe99.mp3",
  },
  {
    voice_id: "Xb7hH8MSUJpSbSDYk0k2",
    name: "Alice",
    labels: { accent: "British", gender: "Female", age: "Middle Aged", use_case: "News" },
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d1fb21e9-7e3b-4903-b1bc-c80bc7c63291.mp3",
  },
];

export async function GET() {
  // Try fetching from API first; if it fails (permissions), use premade list
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": apiKey },
      });

      if (res.ok) {
        const data = await res.json();
        const voices = data.voices.map((v: any) => ({
          voice_id: v.voice_id,
          name: v.name,
          labels: v.labels || {},
          preview_url: v.preview_url || null,
        }));
        return NextResponse.json({ voices });
      }
    } catch {
      // Fall through to premade list
    }
  }

  // Return curated premade voices
  return NextResponse.json({ voices: PREMADE_VOICES });
}
