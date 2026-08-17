"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MessageCircle, Users, Sparkles, BookOpen, ChevronRight, Check } from "lucide-react"
import { useStore } from "@/lib/store"
import { PEOPLE, EXPERIENCES, person } from "@/lib/data"
import { Avatar, Eyebrow, SectionHeader, SourceChip, PrimaryButton } from "@/components/shared"
import { cn } from "@/lib/utils"

type InboxFilter = "All" | "Connections" | "Groups" | "Questions"

const MOCK_CONVERSATIONS = [
  {
    id: "aarav",
    personId: "aarav",
    experienceRef: "Old Manali Food Walk · 17 Aug",
    preview: "Would you do Vashisht again?",
    when: "2h ago",
    unread: true,
    type: "connection" as const,
  },
  {
    id: "priya",
    personId: "priya",
    experienceRef: null,
    preview: "That Spiti route was incredible. How long did the pass take?",
    when: "yesterday",
    unread: false,
    type: "connection" as const,
  },
  {
    id: "rohan",
    personId: "rohan",
    experienceRef: "Sunrise trek · 14 Aug",
    preview: "The chai at the top was Tenzin's grandmother's recipe",
    when: "3 days ago",
    unread: false,
    type: "connection" as const,
  },
]

const MOCK_GROUPS = [
  {
    id: "food-walk-group",
    title: "Old Manali Food Walk",
    experienceId: "food-walk",
    participants: ["aarav", "priya", "rohan", "tenzin"],
    lastMsg: "Tenzin: See everyone at the market gate at 7 PM",
    when: "Today",
    unread: true,
  },
]

const MOCK_QUESTIONS = [
  {
    id: "q1",
    personId: "meera",
    artifact: "Hidden courtyard above Vashisht",
    question: "Is the courtyard accessible in the rain?",
    when: "4h ago",
    unread: true,
  },
  {
    id: "q2",
    personId: "priya",
    artifact: "Old Courtyard Café",
    question: "Does the café serve anything besides chai?",
    when: "2 days ago",
    unread: false,
  },
]

function ConnectionThread({ conv }: { conv: typeof MOCK_CONVERSATIONS[0] }) {
  const { openOverlay } = useStore()
  const p = person(conv.personId)
  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => openOverlay({ type: "conversation", id: conv.personId })}
      className="flex w-full items-start gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-foreground/20"
    >
      <div className="relative shrink-0">
        <Avatar src={p.avatar} name={p.name} size={46} />
        {conv.unread && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("text-[14px] font-semibold", conv.unread ? "text-foreground" : "text-foreground/70")}>
            {p.name}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">{conv.when}</span>
        </div>
        {conv.experienceRef && (
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-copper">
            <Sparkles className="h-3 w-3" />
            {conv.experienceRef}
          </div>
        )}
        <p className={cn("mt-1 truncate text-[13px]", conv.unread ? "text-foreground" : "text-muted-foreground")}>
          {conv.preview}
        </p>
      </div>
    </motion.button>
  )
}

function GroupCard({ group }: { group: typeof MOCK_GROUPS[0] }) {
  const exp = EXPERIENCES.find((e) => e.id === group.experienceId)
  const { toast } = useStore()
  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => toast("Experience group chat opened")}
      className="flex w-full items-start gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-foreground/20"
    >
      <div className="relative shrink-0">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Users className="h-5 w-5" />
        </span>
        {group.unread && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-copper" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-semibold">{group.title}</span>
          <span className="shrink-0 text-[11px] text-muted-foreground">{group.when}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <span className="text-copper">{group.participants.length} participants</span>
        </div>
        <p className="mt-1 truncate text-[13px] text-muted-foreground">{group.lastMsg}</p>
      </div>
    </motion.button>
  )
}

function QuestionCard({ q }: { q: typeof MOCK_QUESTIONS[0] }) {
  const [answered, setAnswered] = useState(false)
  const { toast } = useStore()
  const p = person(q.personId)
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex items-start gap-3">
        <Avatar src={p.avatar} name={p.name} size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-semibold">{p.name.split(" ")[0]}</span>
            <span className="text-[11px] text-muted-foreground">{q.when}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <BookOpen className="h-3 w-3 text-copper" />
            About: {q.artifact}
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">{q.question}</p>
        </div>
      </div>
      {!answered ? (
        <div className="mt-3 flex gap-2">
          <input
            placeholder="Share what you know…"
            className="flex-1 rounded-full border border-border bg-secondary/40 px-3.5 py-2 text-[13px] outline-none focus:border-primary"
          />
          <button
            onClick={() => {
              setAnswered(true)
              toast("Answer shared — your knowledge helps others", "success")
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-primary">
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          Answered — this helps people who read your artifact
        </div>
      )}
    </motion.div>
  )
}

function EmptyInbox() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <MessageCircle className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="font-serif text-lg text-foreground">No conversations yet</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        Connections form through shared experiences. Complete an experience to unlock messaging.
      </p>
    </div>
  )
}

export function InboxScreen() {
  const { connections, completedExp } = useStore()
  const [filter, setFilter] = useState<InboxFilter>("All")

  const filters: InboxFilter[] = ["All", "Connections", "Groups", "Questions"]

  const hasConnections = completedExp.length > 0 || MOCK_CONVERSATIONS.length > 0

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Meaningful conversations</Eyebrow>
        <h1 className="mt-1.5 font-serif text-2xl leading-tight text-foreground text-balance sm:text-3xl">
          Your Inbox
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          Only people you&apos;ve experienced something with. No cold messages. Presence first.
        </p>
      </div>

      {/* filter row */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          {/* Connections */}
          {(filter === "All" || filter === "Connections") && (
            <section>
              <SectionHeader eyebrow="Connections" title="People you've shared something with" />
              {hasConnections ? (
                <div className="space-y-3">
                  {MOCK_CONVERSATIONS.map((conv) => (
                    <ConnectionThread key={conv.id} conv={conv} />
                  ))}
                </div>
              ) : (
                <EmptyInbox />
              )}
            </section>
          )}

          {/* Experience groups */}
          {(filter === "All" || filter === "Groups") && (
            <section>
              <SectionHeader eyebrow="Experience groups" title="Ongoing shared journeys" />
              {MOCK_GROUPS.length > 0 ? (
                <div className="space-y-3">
                  {MOCK_GROUPS.map((g) => (
                    <GroupCard key={g.id} group={g} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
                  Book an experience to join a shared group conversation.
                </div>
              )}
            </section>
          )}

          {/* Questions about your artifacts */}
          {(filter === "All" || filter === "Questions") && (
            <section>
              <SectionHeader eyebrow="Questions" title="People asking about your artifacts" />
              <div className="space-y-3">
                {MOCK_QUESTIONS.map((q) => (
                  <QuestionCard key={q.id} q={q} />
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Principle note */}
      <div className="rounded-2xl border border-copper/20 bg-copper/5 p-4">
        <Eyebrow className="text-copper">Why this inbox feels different</Eyebrow>
        <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
          Follow is open to anyone from public content. Connection requires shared real-world experience and mutual
          consent. Your inbox stays signal, not noise.
        </p>
      </div>
    </div>
  )
}
