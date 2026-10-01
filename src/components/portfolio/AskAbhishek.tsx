import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { BorderTrail } from "@/components/motion/border-trail";
import { TextShimmerWave } from "@/components/motion/text-shimmer-wave";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "What's his strongest project?",
  "Is he available for internships?",
  "Explain O(patience) in one line.",
  "What's his GPA and coursework?",
];

export function AskAbhishek() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm the assistant trained on Abhishek's resume and projects. Ask me anything about his background, projects, or availability.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [animeMode, setAnimeMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, animeMode }),
      });
      if (!res.ok || !res.body) {
        let msg = "Sorry — something went wrong.";
        try {
          const err = (await res.json()) as { error?: string };
          if (err.error) msg = err.error;
        } catch {
          /* non-JSON error body */
        }
        setMessages((m) => [...m, { role: "assistant", content: msg }]);
        return;
      }

      // Stream Server-Sent Events and append each delta to the last message.
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let got = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const ev = JSON.parse(payload) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };
            const delta = ev.choices?.[0]?.delta?.content;
            if (delta) {
              got = true;
              setMessages((m) => {
                const copy = [...m];
                const last = copy[copy.length - 1];
                if (last && last.role === "assistant") {
                  copy[copy.length - 1] = { ...last, content: last.content + delta };
                }
                return copy;
              });
            }
          } catch {
            /* partial frame — ignore */
          }
        }
      }
      if (!got) {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last && last.role === "assistant" && !last.content) {
            copy[copy.length - 1] = { ...last, content: "Sorry — no reply came through. Try again." };
          }
          return copy;
        });
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Network error. Try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur overflow-hidden shadow-[0_20px_80px_-30px_rgba(59,130,246,0.35)]">
      <BorderTrail
        className={animeMode
          ? "bg-accent"
          : "bg-primary"}
        size={32}
      />
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full animate-pulse ${animeMode ? "bg-accent" : "bg-primary"}`} />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            abhi's.ai · {animeMode ? "anime mode 🌀" : "online"}
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">Powered by AI</span>
      </div>
      <div ref={scrollRef} className="h-[380px] overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : `${animeMode && i > 0 ? "bg-accent/10 border-accent/40" : "bg-secondary border-border"} text-secondary-foreground border`
              }`}
            >
              <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl px-4 py-2.5 border ${animeMode ? "bg-accent/10 border-accent/40" : "bg-secondary border-border"}`}>
              <TextShimmerWave
                className="font-mono text-xs uppercase tracking-widest text-primary"
                duration={1.1}
                spread={2}
              >
                thinking...
              </TextShimmerWave>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-border px-5 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={loading}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAnimeMode((v) => !v)}
            aria-pressed={animeMode}
            title="Toggle Anime Mode (easter egg)"
            className={`shrink-0 ml-2 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest rounded-full border px-2.5 py-1 transition-colors ${
              animeMode
                ? "border-accent text-accent bg-accent/10"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <span className={`h-3 w-6 rounded-full relative transition-colors ${animeMode ? "bg-accent/40" : "bg-muted"}`}>
              <span className={`absolute top-0.5 h-2 w-2 rounded-full bg-background transition-all ${animeMode ? "left-3" : "left-0.5"}`} />
            </span>
            Anime {animeMode ? "ON" : "OFF"}
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={animeMode ? "Ask away — expect the occasional anime detour…" : "Ask about Abhishek's projects, skills, availability…"}
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}