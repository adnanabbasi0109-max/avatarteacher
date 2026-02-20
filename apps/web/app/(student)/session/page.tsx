"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { ChatPanel } from "@/components/session/ChatPanel";
import { SessionControls } from "@/components/session/SessionControls";
import { VoiceIndicator } from "@/components/session/VoiceIndicator";

interface Persona {
  id: string;
  name: string;
  subject: string;
  style: string;
  avatar: string;
  greeting: string;
  responses: Record<string, string[]>;
}

const mockPersonas: Persona[] = [
  {
    id: "p1",
    name: "Prof. Ada",
    subject: "Mathematics",
    style: "Socratic",
    avatar: "/avatars/prof-ada.jpg",
    greeting: "Hello! I'm Prof. Ada, your mathematics tutor. I love using the Socratic method — I'll guide you with questions rather than just giving answers. What topic would you like to explore today? We can work on algebra, calculus, geometry, or anything else!",
    responses: {
      algebra: [
        "Great choice! Let's start with a question: what do you think happens when we have an equation like x² + 5x + 6 = 0? Can you think of two numbers that multiply to 6 and add to 5?",
        "Excellent thinking! Those factors give us (x+2)(x+3) = 0. Now, why does each factor being zero give us a solution?",
        "Exactly right! So x = -2 and x = -3. You're building strong algebraic intuition. Want to try a harder one?",
      ],
      calculus: [
        "Wonderful! Let me ask you this: if you're driving and your speedometer shows your speed at each moment, what does the total distance traveled represent mathematically?",
        "That's the key insight — distance is the integral of speed! The area under the speed-time curve. Can you think of why we call it the 'anti-derivative'?",
        "Perfect understanding! Integration and differentiation are inverse operations. Let's practice with some concrete functions.",
      ],
      default: [
        "That's an interesting question! Let me think about how to approach this with you. What do you already know about this topic?",
        "Good foundation! Now let me challenge you — can you see how this connects to what we discussed earlier?",
        "Excellent progress! You're developing strong mathematical reasoning. Shall we go deeper or try a new topic?",
      ],
    },
  },
  {
    id: "p2",
    name: "Sir Walter Lewin",
    subject: "Physics",
    style: "Example-Based",
    avatar: "/avatars/sir-walter-lewin.jpg",
    greeting: "Welcome! I am Sir Walter Lewin, and physics is beautiful! I believe in learning through demonstrations and examples. Tell me — what fascinates you about the physical world? Newton's laws? Electromagnetism? Waves? Let's make physics come alive!",
    responses: {
      newton: [
        "Ah, Newton's Laws! Let me give you an example: imagine you're sitting in a bus that suddenly brakes. You lurch forward — why? That's Newton's First Law, inertia! Your body wants to keep moving at the speed the bus was going.",
        "Now here's the beautiful part — Newton's Second Law, F=ma, tells us exactly HOW MUCH force is needed. If you double the mass, you need double the force for the same acceleration. It's elegant!",
        "And the Third Law — every action has an equal and opposite reaction. When you push against a wall, the wall pushes back with exactly the same force. That's why you don't fall through the floor!",
      ],
      energy: [
        "Energy is one of the most beautiful concepts in physics! Think of a roller coaster at the top of a hill. It has potential energy — the energy of position. As it rolls down, that transforms into kinetic energy — the energy of motion.",
        "Here's the key insight: energy is NEVER created or destroyed, only transformed! A pendulum swings back and forth, converting between potential and kinetic energy. This is conservation of energy.",
        "Now, you might ask — where does the energy 'go' when the pendulum eventually stops? Friction converts it to heat. Every bit is accounted for. Physics is bookkeeping at its finest!",
      ],
      default: [
        "What a great question! Let me think of a real-world example to illustrate this... Imagine you're standing on a beach watching waves come in. Physics is everywhere around us!",
        "That's a wonderful observation! The beauty of physics is that a few simple laws can explain so many phenomena. Can you think of another situation where this principle applies?",
        "Fantastic! You're thinking like a physicist now — always looking for the underlying principles. Keep that curiosity alive!",
      ],
    },
  },
  {
    id: "p3",
    name: "Ms. Sharma",
    subject: "Hindi",
    style: "Collaborative",
    avatar: "/avatars/ms-sharma.jpg",
    greeting: "Namaste! Main Ms. Sharma hoon, aur hum saath mein Hindi seekhenge! I use a collaborative approach — we'll learn together through conversation and practice. Would you like to work on grammar, vocabulary, reading comprehension, or conversational Hindi?",
    responses: {
      grammar: [
        "Let's work on Hindi grammar together! In Hindi, the verb usually comes at the end of the sentence. For example: 'Main school jaata hoon' (I go to school). Notice how 'jaata hoon' (go) is at the end?",
        "Bahut accha! Now let's look at gender in Hindi. Unlike English, Hindi nouns have gender — masculine (pulling) and feminine (stree-ling). 'Ladka' (boy) is masculine, 'Ladki' (girl) is feminine. The adjectives change too!",
        "Shaandaar! You're getting the hang of it. Now try forming your own sentence using what we've learned. Remember: Subject + Object + Verb.",
      ],
      vocabulary: [
        "Let's build your vocabulary! Today's theme: the family. 'Parivar' means family. 'Mata' is mother, 'Pita' is father, 'Bhai' is brother, 'Behen' is sister. Can you try using one in a sentence?",
        "Bahut badhiya! Now let's learn some common verbs: 'Khaana' (to eat), 'Peena' (to drink), 'Padhna' (to read), 'Likhna' (to write). These are the foundation of everyday Hindi!",
        "Excellent practice! You're building a strong vocabulary base. Let's try combining these words into more complex sentences.",
      ],
      default: [
        "Yeh bahut accha sawaal hai! (That's a very good question!) Let's explore this together. Can you try to express your thoughts in Hindi, even if it's just a few words?",
        "Bahut accha prayaas! (Very good attempt!) Don't worry about making mistakes — that's how we learn. Let me help you refine that.",
        "Waah, kitni tezi se seekh rahe ho! (Wow, you're learning so fast!) You're making great progress. Keep practicing and it will become natural.",
      ],
    },
  },
];

interface ChatMessage {
  role: string;
  content: string;
  timestamp: Date;
}

export default function SessionPage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [inSession, setInSession] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [sentiment, setSentiment] = useState("neutral");
  const responseIndexRef = useRef<Record<string, number>>({});
  const avatarRef = useRef<any>(null);

  const persona = mockPersonas.find((p) => p.id === selectedPersona);

  const startSession = () => {
    if (!persona) return;
    setInSession(true);
    setMessages([
      { role: "TUTOR", content: persona.greeting, timestamp: new Date() },
    ]);
    setIsAvatarSpeaking(true);
    setTimeout(() => setIsAvatarSpeaking(false), 3000);
  };

  const getResponse = (text: string): string => {
    if (!persona) return "";
    const lower = text.toLowerCase();

    let category = "default";
    for (const key of Object.keys(persona.responses)) {
      if (key !== "default" && lower.includes(key)) {
        category = key;
        break;
      }
    }

    const responses = persona.responses[category] || persona.responses.default;
    const idx = responseIndexRef.current[category] || 0;
    responseIndexRef.current[category] = (idx + 1) % responses.length;
    return responses[idx];
  };

  const handleSendMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "STUDENT", content: text, timestamp: new Date() },
    ]);

    // Simulate tutor typing and responding
    setIsAvatarSpeaking(true);
    setSentiment("thinking");

    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [
        ...prev,
        { role: "TUTOR", content: response, timestamp: new Date() },
      ]);
      setSentiment("positive");
      setTimeout(() => {
        setIsAvatarSpeaking(false);
        setSentiment("neutral");
      }, 2000);
    }, 1000 + Math.random() * 1500);
  };

  const handleEndSession = () => {
    setInSession(false);
    setMessages([]);
    setSelectedPersona(null);
    setIsAvatarSpeaking(false);
    setSentiment("neutral");
    responseIndexRef.current = {};
  };

  // Active session view
  if (inSession && persona) {
    return (
      <div className="fixed inset-0 flex bg-gray-950 z-50">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <AvatarCanvas
              ref={avatarRef}
              isSpeaking={isAvatarSpeaking}
              sentiment={sentiment}
              className="w-full h-full"
            />

            {/* Persona name overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-3 rounded-xl bg-gray-900/80 px-4 py-2 backdrop-blur">
              <div className="avatar-animated h-10 w-10 rounded-full overflow-hidden ring-2 ring-blue-400/30">
                <Image src={persona.avatar} alt={persona.name} width={40} height={40} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{persona.name}</p>
                <p className="text-xs text-gray-400">{persona.subject} · {persona.style}</p>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <VoiceIndicator label="You" isActive={!isMuted} />
              <VoiceIndicator label="Tutor" isActive={isAvatarSpeaking} />
            </div>
          </div>

          <SessionControls
            isMuted={isMuted}
            onMute={() => setIsMuted(true)}
            onUnmute={() => setIsMuted(false)}
            onEndSession={handleEndSession}
          />
        </div>

        <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
      </div>
    );
  }

  // Persona selection view
  return (
    <div className="mx-auto max-w-2xl py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Start a Session</h1>
      <p className="text-gray-400 mb-8">Choose a tutor to begin your learning session</p>

      <div className="grid gap-4">
        {mockPersonas.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPersona(p.id)}
            className={`avatar-card rounded-xl border p-6 text-left transition ${
              selectedPersona === p.id
                ? "border-blue-400 bg-blue-600/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="avatar-animated h-14 w-14 rounded-full overflow-hidden ring-2 ring-blue-400/30">
                  <Image src={p.avatar} alt={p.name} width={56} height={56} className="h-full w-full object-cover" />
                </div>
                {selectedPersona === p.id && <div className="avatar-pulse-ring" />}
              </div>
              <div>
                <h3 className="font-semibold text-white">{p.name}</h3>
                <p className="text-sm text-gray-400">{p.subject} · {p.style}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={startSession}
        disabled={!selectedPersona}
        className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Start Session
      </button>
    </div>
  );
}
