import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CoachMessageRole,
  getAutonomousCoachFocus,
  getCoachReply,
  getCoachSuggestions,
  getCoachTier,
  getInitialCoachMessage,
  getTierKnowledgeCount,
} from "../lib/aiCoachKnowledge";

type CoachMessage = {
  id: string;
  role: CoachMessageRole;
  content: string;
};

interface AICoachPanelProps {
  tier?: string | null;
  pageContext?: string;
  title?: string;
  userName?: string | null;
  className?: string;
}

function createMessage(role: CoachMessageRole, content: string): CoachMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
  };
}

export default function AICoachPanel({
  tier,
  pageContext = "learn",
  title = "InkPlan AI Coach",
  userName,
  className = "",
}: AICoachPanelProps) {
  const resolvedTier = getCoachTier(tier);
  const knowledgeCount = getTierKnowledgeCount(tier);
  const focus = useMemo(
    () => getAutonomousCoachFocus(tier, pageContext),
    [tier, pageContext]
  );
  const suggestions = useMemo(
    () => getCoachSuggestions(tier, pageContext),
    [tier, pageContext]
  );

  const initialMessage = useMemo(
    () => getInitialCoachMessage(tier, pageContext, userName),
    [tier, pageContext, userName]
  );

  const [messages, setMessages] = useState<CoachMessage[]>(() => [
    createMessage("coach", initialMessage),
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const initializedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setMessages([createMessage("coach", initialMessage)]);
  }, [initialMessage]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  const sendMessage = (rawValue: string) => {
    const trimmed = rawValue.trim();

    if (!trimmed || isThinking) return;

    const userMessage = createMessage("user", trimmed);

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    window.setTimeout(() => {
      const reply = getCoachReply({
        message: trimmed,
        tier,
        pageContext,
      });

      setMessages((prev) => [...prev, createMessage("coach", reply)]);
      setIsThinking(false);
    }, 180);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <aside
      className={`rounded-3xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-sm ${className}`}
    >
      <div className="border-b border-neutral-800 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              Built-in mentor
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">
              Calm, local-first guidance for becoming more apprenticeship-ready.
              This is not a replacement for real mentorship.
            </p>
          </div>

          <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-red-300">
            {resolvedTier}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
              Coach focus
            </p>
            <h3 className="mt-2 text-sm font-semibold text-white">{focus.title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-400">{focus.body}</p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
              Local memory
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              ~{knowledgeCount} local guidance pairs
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Tiered study guidance with stronger safety boundaries and practical
              fundamentals-first responses.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
            Safety boundary
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            Do not tattoo real skin while self-teaching. Infections, scarring,
            and permanent damage are serious. Respect the trade, respect future
            clients, and wait until a real mentor says you are ready.
          </p>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            What to work on now
          </p>

          <ul className="mt-3 space-y-2">
            {focus.checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-6 text-neutral-300"
              >
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={scrollRef}
          className="mt-4 max-h-[360px] space-y-3 overflow-y-auto rounded-2xl border border-neutral-800 bg-black/30 p-4"
        >
          {messages.map((message) => {
            const isCoach = message.role === "coach";

            return (
              <div
                key={message.id}
                className={`flex ${isCoach ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isCoach
                      ? "border border-neutral-800 bg-neutral-900 text-neutral-200"
                      : "border border-red-500/20 bg-red-500/10 text-red-50"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-400">
                Thinking through that...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <label className="sr-only" htmlFor="ai-coach-input">
            Ask the AI coach
          </label>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-3">
            <textarea
              id="ai-coach-input"
              rows={3}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about fundamentals, design, study habits, reference use, or portfolio prep..."
              className="w-full resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-neutral-500"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-neutral-500">
                Direct answers, local-first, safety-aware.
              </p>

              <button
                type="submit"
                disabled={isThinking || input.trim().length === 0}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ask coach
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            Good prompts
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-2 text-xs text-neutral-300 transition hover:border-neutral-700 hover:bg-neutral-900"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}