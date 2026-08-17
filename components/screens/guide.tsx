"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Users,
  Sparkles,
  Camera,
  Star,
  ArrowRight,
  Check,
  TrendingUp,
  BookOpen,
  Clock,
  ChevronLeft,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { EXPERIENCES, PEOPLE, OPERATORS, person } from "@/lib/data"
import { Avatar, Eyebrow, PrimaryButton, GhostButton, SectionHeader, Stat, SourceChip } from "@/components/shared"

const GUIDE_EXPERIENCE = EXPERIENCES[0] // food-walk
const UPCOMING = [
  { time: "7:00 PM", title: "Old Manali Food Walk", spots: 8, date: "Tonight" },
  { time: "4:45 AM", title: "Sunrise trek to the dawn ridge", spots: 4, date: "Tomorrow" },
]

function DashboardView({ onSelect }: { onSelect: (id: string) => void }) {
  const host = person("tenzin")
  return (
    <div className="space-y-7">
      {/* Guide header */}
      <div className="relative overflow-hidden rounded-3xl border border-border">
        <div className="relative aspect-[16/8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/places/food-walk.png" alt="Guide studio" className="h-full w-full object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-5">
            <Avatar src={host.avatar} name={host.name} size={60} ring className="shrink-0" />
            <div className="text-background">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl leading-tight">{host.name}</h1>
                <SourceChip>Verified local</SourceChip>
              </div>
              <p className="mt-0.5 text-[12px] text-background/80">Guide Studio · Old Manali</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-2xl border border-border bg-card p-3.5 text-center">
          <Stat value="2,100" label="Total saves" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-3.5 text-center">
          <Stat value="340" label="Visits" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-3.5 text-center">
          <Stat value="17" label="Completed" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-3.5 text-center">
          <Stat value="6" label="Artifacts" />
        </div>
      </div>

      {/* Upcoming experiences */}
      <div>
        <SectionHeader eyebrow="Your schedule" title="Upcoming experiences" />
        <div className="space-y-3">
          {UPCOMING.map((u, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelect(EXPERIENCES[i]?.id ?? GUIDE_EXPERIENCE.id)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-foreground/20"
            >
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
                <span className="mt-0.5 text-[10px] font-medium">{u.time}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-serif text-[15px] leading-snug">{u.title}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {u.spots} participants · {u.date}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Operators */}
      <div>
        <SectionHeader eyebrow="Your operations" title="Active listings" />
        <div className="space-y-2">
          {OPERATORS.slice(0, 2).map((op) => {
            const p = person(op.personId)
            return (
              <div key={op.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <Avatar src={p.avatar} name={p.name} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium">{op.name}</div>
                  <div className="text-[11px] text-muted-foreground">{op.specialty}</div>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">Active</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Create lore CTA */}
      <div className="rounded-2xl border border-copper/20 bg-copper/5 p-5">
        <Eyebrow className="text-copper">Leave local knowledge</Eyebrow>
        <h3 className="mt-1.5 font-serif text-lg leading-tight">Create a lore entry</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          Share the story behind a place. This attaches human knowledge directly to the map and builds your reputation as a Verified local.
        </p>
        <div className="mt-3">
          <GhostButton>
            <BookOpen className="h-4 w-4" />
            Share local lore
          </GhostButton>
        </div>
      </div>
    </div>
  )
}

function ExperienceManageView({ expId, onBack }: { expId: string; onBack: () => void }) {
  const exp = EXPERIENCES.find((e) => e.id === expId) ?? GUIDE_EXPERIENCE
  const { toast } = useStore()
  const [completed, setCompleted] = useState(false)

  const participants = [
    { id: "aarav", label: "Aarav Menon" },
    { id: "priya", label: "Priya Nair" },
    { id: "rohan", label: "Rohan Bhatt" },
    { id: "chandan", label: "Chandan Rao" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <Eyebrow>Manage experience</Eyebrow>
          <h2 className="font-serif text-lg leading-tight">{exp.title}</h2>
        </div>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={exp.image || "/placeholder.svg"} alt={exp.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-background">
          <div className="font-serif text-xl">{exp.title}</div>
          <div className="mt-1 text-[12px] text-background/80">Tonight · {exp.startsAt} · {exp.durationHrs}h</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { v: participants.length, l: "Participants" },
          { v: exp.spotsLeft, l: "Spots left" },
          { v: exp.artifacts, l: "Artifacts" },
          { v: exp.saves, l: "Saves" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-3">
            <div className="font-serif text-xl leading-none">{s.v}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Participants */}
      <div>
        <SectionHeader eyebrow="Participants" title={`${participants.length} people joining tonight`} />
        <div className="space-y-2">
          {participants.map((p, i) => {
            const pr = person(p.id)
            return (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <Avatar src={pr.avatar} name={pr.name} size={36} />
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{pr.name}</div>
                  <div className="text-[11px] text-muted-foreground">{pr.trust.label}</div>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                  Confirmed
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <PrimaryButton
          full
          onClick={() => toast("Group link sent to all participants", "success")}
        >
          <Users className="h-4 w-4" />
          Send group link
        </PrimaryButton>
        {!completed ? (
          <PrimaryButton
            full
            onClick={() => {
              setCompleted(true)
              toast("Experience marked complete — artifacts unlocked", "success")
            }}
          >
            <Check className="h-4 w-4" />
            Mark as completed
          </PrimaryButton>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center"
          >
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <h3 className="font-serif text-lg">Experience complete</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-left">
              {[
                { v: participants.length, l: "Participants" },
                { v: exp.artifacts, l: "Artifacts created" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-border bg-card p-3">
                  <Stat value={s.v} label={s.l} />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-muted-foreground">
              {participants.length} participants can now connect with each other through shared experience.
            </p>
          </motion.div>
        )}
        <GhostButton onClick={() => toast("Create lore flow opened")}>
          <BookOpen className="h-4 w-4" />
          Create lore entry
        </GhostButton>
      </div>
    </div>
  )
}

export function GuideStudio({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<"dashboard" | "manage">("dashboard")
  const [selectedExp, setSelectedExp] = useState<string>(GUIDE_EXPERIENCE.id)

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-copper text-copper-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="font-serif text-lg leading-none">Guide Studio</div>
            <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Operator view</div>
          </div>
        </div>
        <button
          onClick={onExit}
          className="rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground"
        >
          Back to Traveler
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === "dashboard" ? (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DashboardView
              onSelect={(id) => {
                setSelectedExp(id)
                setView("manage")
              }}
            />
          </motion.div>
        ) : (
          <motion.div key="manage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ExperienceManageView expId={selectedExp} onBack={() => setView("dashboard")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
