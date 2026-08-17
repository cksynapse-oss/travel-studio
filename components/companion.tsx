"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sparkle, X, ArrowUp, MapPin, Plus } from "lucide-react"
import { useStore, type CompanionMode } from "@/lib/store"
import { cn } from "@/lib/utils"
import { SourceChip, PrimaryButton, GhostButton } from "@/components/shared"

type Msg = {
  role: "user" | "assistant"
  text: string
  sources?: string[]
  actions?: { label: string; icon?: "route" | "add" }[]
}

const MODE_LABEL: Record<CompanionMode, string> = {
  planning: "Planning mode",
  "in-place": "In-place",
  reflecting: "Reflecting",
}

const SUGGESTIONS: Record<CompanionMode, string[]> = {
  planning: [
    "Can I fit these saved places into one day?",
    "Build a route from the things I saved",
    "Is the food walk worth it for me?",
  ],
  "in-place": [
    "What's worth doing near me right now?",
    "Which of my saved places works best tonight?",
    "Find hidden places near me",
  ],
  reflecting: ["Turn yesterday into a story", "Draft my trip story", "What did I miss?"],
}

// Scripted, grounded responses that reference human-generated content.
function respond(input: string, mode: CompanionMode): Msg {
  const q = input.toLowerCase()
  if (q.includes("fit") || q.includes("one day") || q.includes("route")) {
    return {
      role: "assistant",
      text: "Yes — this holds together as one day. Vashisht and Old Manali are 3.2 km apart, and the food walk starts at 7 PM near two places you already saved. Start before 11 AM and you'll have the courtyard café in the late-afternoon light before dinner.",
      sources: ["From your saves", "From Aarav's itinerary", "From current context"],
      actions: [{ label: "Show route", icon: "route" }, { label: "Add to plan", icon: "add" }],
    }
  }
  if (q.includes("worth") || q.includes("food walk")) {
    return {
      role: "assistant",
      text: "I think the food walk fits you well. You've already saved two places on the same lane, and three travelers with taste close to yours saved it. It's hosted by a Verified local, so the stories are first-hand rather than repackaged.",
      sources: ["From your saves", "From a local lore artifact"],
      actions: [{ label: "Add to plan", icon: "add" }],
    }
  }
  if (q.includes("near me") || q.includes("tonight") || q.includes("hidden")) {
    return {
      role: "assistant",
      text: "Three options fit what you usually save. The Old Courtyard Café is 1.8 km away and open now — you saved it last week. The Beas riverside deck is quiet after 6. If you want something new, the hidden courtyard above Vashisht is 3.2 km and almost always empty.",
      sources: ["From your saves", "From current context", "From Aarav's itinerary"],
      actions: [{ label: "Show on map", icon: "route" }],
    }
  }
  if (q.includes("story") || q.includes("yesterday") || q.includes("draft")) {
    return {
      role: "assistant",
      text: "Here's a first draft from 23 photos, 4 places and your note about the rain. It opens on the courtyard café and ends on the final morning by the river. You can reorder or change the cover in Story Studio.",
      sources: ["From your photos", "From your notes", "From your saved places"],
      actions: [{ label: "Open Story Studio", icon: "add" }],
    }
  }
  return {
    role: "assistant",
    text: "I can only work from what's real here — your saves, human itineraries, and local lore. Try one of the suggestions below and I'll ground the answer in those.",
    sources: ["From current context"],
  }
}

export function Companion() {
  const { companionOpen, companionMode, setCompanionMode, openCompanion, closeCompanion, tripState, toast, setTab, openOverlay } =
    useStore()
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  // Nudge companion mode to match trip lifecycle.
  useEffect(() => {
    if (tripState === "active") setCompanionMode("in-place")
    else if (tripState === "completed" || tripState === "memory") setCompanionMode("reflecting")
    else setCompanionMode("planning")
  }, [tripState, setCompanionMode])

  function send(text: string) {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: "user", text }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, respond(text, companionMode)])
    }, 750)
  }

  function runAction(label: string) {
    if (label === "Open Story Studio") {
      closeCompanion()
      setTab("trips")
      openOverlay({ type: "story" })
      return
    }
    if (label === "Show on map" || label === "Show route") {
      closeCompanion()
      setTab("explore")
      toast("Route drawn on the map", "success")
      return
    }
    toast("Added to your plan", "success")
  }

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!companionOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            onClick={() => openCompanion()}
            className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full border border-border bg-card/90 py-2.5 pl-3 pr-4 shadow-lg backdrop-blur lg:bottom-6 lg:right-6"
            aria-label="Open Companion"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkle className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-medium">Companion</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contextual panel */}
      <AnimatePresence>
        {companionOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCompanion}
            />
            <motion.aside
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-[86vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl lg:inset-auto lg:bottom-6 lg:right-6 lg:h-[640px] lg:rounded-3xl"
            >
              {/* header */}
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Sparkle className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="font-serif text-lg leading-none">Companion</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> Manali · {MODE_LABEL[companionMode]}
                  </div>
                </div>
                <button onClick={closeCompanion} className="rounded-full bg-secondary p-1.5 hover:bg-muted" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* mode switch */}
              <div className="flex gap-1.5 border-b border-border px-5 py-2.5">
                {(["planning", "in-place", "reflecting"] as CompanionMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setCompanionMode(m)}
                    className={cn(
                      "rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
                      companionMode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {MODE_LABEL[m]}
                  </button>
                ))}
              </div>

              {/* thread */}
              <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-4">
                {messages.length === 0 && (
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-[14px] leading-relaxed text-foreground">
                      I&apos;m your contextual layer for this trip. I only answer from what&apos;s real — your saves, human
                      itineraries, and local lore. What are you thinking about?
                    </p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed",
                        m.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-background text-foreground",
                      )}
                    >
                      <p>{m.text}</p>
                      {m.sources && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {m.sources.map((s) => (
                            <SourceChip key={s}>{s}</SourceChip>
                          ))}
                        </div>
                      )}
                      {m.actions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {m.actions.map((a) => (
                            <button
                              key={a.label}
                              onClick={() => runAction(a.label)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12px] font-medium text-accent-foreground hover:brightness-95"
                            >
                              {a.icon === "route" ? <MapPin className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                              {a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="flex gap-1 rounded-2xl border border-border bg-background px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* suggestions + input */}
              <div className="border-t border-border px-5 pb-4 pt-3">
                <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
                  {SUGGESTIONS[companionMode].map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    send(input)
                  }}
                  className="flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pl-4 pr-1.5"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about this trip…"
                    className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
                    disabled={!input.trim()}
                    aria-label="Send"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
