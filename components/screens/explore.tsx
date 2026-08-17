"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { MapPin, Sparkles, BookOpen, Compass, Search } from "lucide-react"
import { useStore } from "@/lib/store"
import { PLACES, EXPERIENCES, LORE, ARTIFACTS, person, place } from "@/lib/data"
import {
  Avatar,
  Chip,
  Eyebrow,
  SaveButton,
  SectionHeader,
  SourceChip,
  DemoLabel,
} from "@/components/shared"
import { cn } from "@/lib/utils"

const FILTERS = ["All", "Hidden gems", "Experiences", "Lore", "Cafés", "Trails"] as const
type Filter = (typeof FILTERS)[number]

function markerColor(type: string) {
  switch (type) {
    case "experience":
      return "bg-primary text-primary-foreground"
    case "lore":
      return "bg-copper text-copper-foreground"
    case "hidden":
      return "bg-foreground text-background"
    default:
      return "bg-card text-foreground border border-border"
  }
}

function StylizedMap() {
  const { openOverlay } = useStore()
  const experienceMarkers = EXPERIENCES.map((e) => ({ id: e.id, x: e.x, y: e.y, type: "experience" as const, label: e.title }))
  const loreMarkers = LORE.map((l) => ({ id: l.id, x: l.x, y: l.y, type: "lore" as const, label: l.title }))
  const placeMarkers = PLACES.map((p) => ({ id: p.id, x: p.x, y: p.y, type: p.markerType, label: p.name }))

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border sm:aspect-[16/9]">
      {/* stylized terrain */}
      <div className="absolute inset-0 bg-map-base" />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 15%, var(--map-ridge) 0%, transparent 45%), radial-gradient(ellipse at 78% 38%, var(--map-ridge) 0%, transparent 40%), radial-gradient(ellipse at 55% 78%, var(--map-valley) 0%, transparent 55%)",
        }}
      />
      {/* river */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden>
        <path
          d="M10,72 C30,60 40,68 48,58 C56,48 60,50 68,38 C74,30 82,26 92,10"
          fill="none"
          stroke="var(--map-river)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M18,74 C34,66 44,54 55,52 C66,50 74,44 90,44"
          fill="none"
          stroke="var(--map-trail)"
          strokeWidth="0.6"
          strokeDasharray="1.5 1.5"
          opacity="0.7"
        />
      </svg>

      {/* markers */}
      {[...placeMarkers, ...loreMarkers, ...experienceMarkers].map((m, i) => (
        <motion.button
          key={`${m.type}-${m.id}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 * i, type: "spring", stiffness: 400, damping: 20 }}
          onClick={() =>
            openOverlay(
              m.type === "experience"
                ? { type: "experience", id: m.id }
                : m.type === "lore"
                  ? { type: "lore", id: m.id }
                  : { type: "place", id: m.id },
            )
          }
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          aria-label={m.label}
        >
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full shadow-md ring-2 ring-background transition-transform group-hover:scale-110",
              markerColor(m.type),
            )}
          >
            {m.type === "experience" ? (
              <Sparkles className="h-3.5 w-3.5" />
            ) : m.type === "lore" ? (
              <BookOpen className="h-3.5 w-3.5" />
            ) : m.type === "hidden" ? (
              <Compass className="h-3.5 w-3.5" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
          </span>
        </motion.button>
      ))}

      {/* "you" pin */}
      <div className="absolute left-[42%] top-[52%] -translate-x-1/2 -translate-y-1/2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-copper ring-2 ring-background" />
        </span>
      </div>

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 text-[11px] backdrop-blur">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Experience
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-copper" /> Lore
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground" /> Hidden gem
        </span>
      </div>
      <div className="absolute right-3 top-3">
        <DemoLabel />
      </div>
    </div>
  )
}

function ArtifactCard({ id }: { id: string }) {
  const { openOverlay } = useStore()
  const a = ARTIFACTS.find((x) => x.id === id)!
  const author = person(a.authorId)
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      {a.image && (
        <button
          onClick={() => a.placeId && openOverlay({ type: "place", id: a.placeId })}
          className="relative block aspect-[16/10] w-full overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.image || "/placeholder.svg"} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" crossOrigin="anonymous" />
          <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
            {a.type}
          </span>
        </button>
      )}
      <div className="p-4">
        <button onClick={() => openOverlay({ type: "person", id: author.id })} className="mb-2.5 flex items-center gap-2">
          <Avatar src={author.avatar} name={author.name} size={28} />
          <div className="text-left leading-tight">
            <div className="flex items-center gap-1.5 text-[13px] font-medium">
              {author.name}
              {author.verifiedLocal && <SourceChip>Verified local</SourceChip>}
            </div>
            <div className="text-[11px] text-muted-foreground">{a.when}</div>
          </div>
        </button>
        <h3 className="font-serif text-lg leading-snug text-foreground text-balance">{a.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{a.body}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[12px] text-muted-foreground">
            {a.saves} saved · {a.helpful} found helpful · {a.downstreamVisits} visited after
          </div>
        </div>
        <div className="mt-3">
          {a.placeId ? (
            <SaveButton kind="place" id={a.placeId} full />
          ) : (
            <SaveButton kind="artifact" id={a.id} full />
          )}
        </div>
      </div>
    </article>
  )
}

export function ExploreScreen() {
  const { openOverlay } = useStore()
  const [filter, setFilter] = useState<Filter>("All")

  const filteredArtifacts = ARTIFACTS.filter((a) => {
    if (filter === "All") return true
    if (filter === "Hidden gems") return a.type === "Hidden gem"
    if (filter === "Lore") return a.type === "Lore"
    if (filter === "Experiences") return false
    if (filter === "Cafés") return a.placeId ? place(a.placeId)?.category === "Cafés" : false
    if (filter === "Trails") return a.placeId ? place(a.placeId)?.category === "Hidden trail" : false
    return true
  })

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Explore Manali</Eyebrow>
        <h1 className="mt-1.5 font-serif text-2xl leading-tight text-foreground text-balance sm:text-3xl">
          A map made of people, not pins.
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          Every marker is something a real traveler or local left behind — an experience, a piece of lore, a hidden
          place worth the walk.
        </p>
      </div>

      <button
        onClick={() => openOverlay({ type: "conversation", id: "search" })}
        className="flex w-full items-center gap-2.5 rounded-full border border-border bg-card px-4 py-3 text-[14px] text-muted-foreground transition-colors hover:border-foreground/30"
      >
        <Search className="h-4 w-4" />
        Ask for a place, a mood, or a kind of day…
      </button>

      <StylizedMap />

      <div>
        <SectionHeader eyebrow="The human layer" title="What people left behind here" />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {filteredArtifacts.map((a) => (
            <ArtifactCard key={a.id} id={a.id} />
          ))}
          {filteredArtifacts.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
              Nothing here yet under this filter — try another lens.
            </div>
          )}
        </div>
      </div>

      <div>
        <SectionHeader eyebrow="Human-led" title="Experiences hosted near you" />
        <div className="grid gap-4 sm:grid-cols-3">
          {EXPERIENCES.map((e) => {
            const host = person(e.hostId)
            return (
              <button
                key={e.id}
                onClick={() => openOverlay({ type: "experience", id: e.id })}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.image || "/placeholder.svg"} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" crossOrigin="anonymous" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                    <Sparkles className="h-3 w-3" /> Experience
                  </span>
                </div>
                <div className="p-3.5">
                  <h3 className="font-serif text-[15px] leading-snug text-balance">{e.title}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar src={host.avatar} name={host.name} size={22} />
                    <span className="text-[12px] text-muted-foreground">
                      {host.name}
                      {host.verifiedLocal ? " · Verified local" : ""}
                    </span>
                  </div>
                  <div className="mt-2 text-[12px] text-muted-foreground">
                    {e.durationHrs}h · ₹{e.priceInr} · {e.spotsLeft} spots left
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
