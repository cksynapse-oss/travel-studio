"use client"

import { motion } from "motion/react"
import { MapPin, Sparkles, Users, Camera, BookOpen, ArrowRight, Circle, Radio, Check, Clock } from "lucide-react"
import { useStore, type TripState } from "@/lib/store"
import { PLACES, EXPERIENCES, ITINERARIES, TRIP_STORY, person } from "@/lib/data"
import {
  Avatar,
  Eyebrow,
  PrimaryButton,
  GhostButton,
  SectionHeader,
  Stat,
  SourceChip,
} from "@/components/shared"
import { cn } from "@/lib/utils"

const STATES: { id: TripState; label: string; icon: typeof Circle; note: string }[] = [
  { id: "planning", label: "Planning", icon: Circle, note: "A loose collection of intent" },
  { id: "active", label: "Active", icon: Radio, note: "You're in Manali now" },
  { id: "completed", label: "Completed", icon: Check, note: "Ready to remember" },
  { id: "memory", label: "Memory", icon: Clock, note: "A finished story" },
]

function StateSwitcher() {
  const { tripState, setTripState } = useStore()
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      {STATES.map((s) => {
        const Icon = s.icon
        const active = tripState === s.id
        return (
          <button
            key={s.id}
            onClick={() => setTripState(s.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {s.label}
          </button>
        )
      })}
    </div>
  )
}

function TripHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border">
      <div className="relative aspect-[16/10] sm:aspect-[21/9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/trips/manali-cover.png" alt="Manali valley" className="h-full w-full object-cover" crossOrigin="anonymous" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-background sm:p-7">
          <Eyebrow className="text-background/80">My Trip · Manali</Eyebrow>
          <h1 className="mt-1 font-serif text-2xl leading-tight text-balance sm:text-3xl">Four days in Manali</h1>
          <p className="mt-1 max-w-md text-[13px] leading-relaxed text-background/85">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- PLANNING ---------- */
function PlanningView() {
  const { savedPlaces, savedExperiences, openOverlay, setTripState } = useStore()
  const places = PLACES.filter((p) => savedPlaces.includes(p.id))
  const exps = EXPERIENCES.filter((e) => savedExperiences.includes(e.id))

  return (
    <div className="space-y-8">
      <TripHeader subtitle="A loose collection of what caught your eye — no rigid itinerary, just intent." />

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <Stat value={places.length} label="Places saved" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Stat value={exps.length} label="Experiences" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Stat value={ITINERARIES.length} label="Routes to borrow" />
        </div>
      </div>

      <div>
        <SectionHeader eyebrow="Saved to this trip" title="Places you're curious about" />
        {places.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
            Nothing saved yet. Save a place from Explore and it lands here.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {places.map((p) => (
              <button
                key={p.id}
                onClick={() => openOverlay({ type: "place", id: p.id })}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left"
              >
                <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-[15px]">{p.name}</div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">{p.category} · {p.distanceKm} km</div>
                  {p.recommendedBy && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-copper">
                      <Sparkles className="h-3 w-3" /> via {person(p.recommendedBy.personId).name}
                    </div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        )}
      </div>

      {exps.length > 0 && (
        <div>
          <SectionHeader eyebrow="Human-led" title="Experiences on your list" />
          <div className="grid gap-3 sm:grid-cols-2">
            {exps.map((e) => {
              const host = person(e.hostId)
              return (
                <button
                  key={e.id}
                  onClick={() => openOverlay({ type: "experience", id: e.id })}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left"
                >
                  <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.image || "/placeholder.svg"} alt={e.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-serif text-[15px]">{e.title}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <Avatar src={host.avatar} name={host.name} size={16} /> {host.name}
                      {host.verifiedLocal && <SourceChip>Local</SourceChip>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-accent/40 p-5">
        <Eyebrow>When you arrive</Eyebrow>
        <p className="mt-1.5 text-[14px] leading-relaxed text-foreground">
          The moment you&apos;re in Manali, switch this trip to Active — the whole app becomes ambient, surfacing what&apos;s
          near you and what you saved.
        </p>
        <div className="mt-3">
          <PrimaryButton onClick={() => setTripState("active")}>
            <Radio className="h-4 w-4" /> Start the trip
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

/* ---------- ACTIVE ---------- */
function ActiveView() {
  const { savedExperiences, openOverlay, openCompanion, setTripState, booked, completedExp } = useStore()
  const nearby = PLACES.slice(0, 3)
  const nextExp = EXPERIENCES.find((e) => savedExperiences.includes(e.id)) ?? EXPERIENCES[0]
  const host = person(nextExp.hostId)

  return (
    <div className="space-y-7">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-primary">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <Eyebrow className="text-primary">Trip active · Old Manali · 4:40 PM</Eyebrow>
        </div>
        <h1 className="mt-2 font-serif text-2xl leading-tight text-balance">You&apos;re here. The valley is yours.</h1>
        <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
          Everything below reacts to where you are, what you saved, and the time of day.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-copper text-copper-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <div className="text-[13px] font-medium">Something you saved is 400 m away</div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              The Old Courtyard Café closes at dusk. Aarav says the light is best right about now.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <GhostButton onClick={() => openOverlay({ type: "place", id: "courtyard-cafe" })}>
                <MapPin className="h-3.5 w-3.5" /> Take me there
              </GhostButton>
              <GhostButton onClick={() => openCompanion("in-place")}>
                <Sparkles className="h-3.5 w-3.5" /> Ask the Companion
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionHeader eyebrow="Next up" title="Your booked experience" />
        <button
          onClick={() => openOverlay({ type: "experience", id: nextExp.id })}
          className="group block w-full overflow-hidden rounded-2xl border border-border bg-card text-left"
        >
          <div className="relative aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={nextExp.image || "/placeholder.svg"} alt={nextExp.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" crossOrigin="anonymous" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-background">
              <div className="font-serif text-lg">{nextExp.title}</div>
              <div className="mt-1 flex items-center gap-1.5 text-[12px] text-background/85">
                <Avatar src={host.avatar} name={host.name} size={18} /> {host.name} · Tonight {nextExp.startsAt}
              </div>
            </div>
            <span className="absolute right-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
              {booked.includes(nextExp.id) ? "Booked" : "Saved"}
            </span>
          </div>
        </button>
      </div>

      <div>
        <SectionHeader eyebrow="Around you now" title="Within walking distance" />
        <div className="grid gap-3 sm:grid-cols-3">
          {nearby.map((p) => (
            <button
              key={p.id}
              onClick={() => openOverlay({ type: "place", id: p.id })}
              className="group overflow-hidden rounded-2xl border border-border bg-card text-left"
            >
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" crossOrigin="anonymous" />
              </div>
              <div className="p-3">
                <div className="truncate font-serif text-[14px]">{p.name}</div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">{p.distanceKm} km · {p.openNow ? "Open now" : "Closed"}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-secondary/50 p-5 text-center">
        <p className="text-[13px] text-muted-foreground">
          When your days here are done, close the trip to turn it into something you keep.
        </p>
        <div className="mt-3 flex justify-center">
          <PrimaryButton onClick={() => setTripState("completed")}>
            <Check className="h-4 w-4" /> Complete this trip
          </PrimaryButton>
        </div>
        {completedExp.length > 0 && (
          <div className="mt-2 text-[12px] text-copper">You completed {completedExp.length} experience together.</div>
        )}
      </div>
    </div>
  )
}

/* ---------- COMPLETED ---------- */
function CompletedView() {
  const { openOverlay, setTripState } = useStore()
  const s = TRIP_STORY
  return (
    <div className="space-y-7">
      <TripHeader subtitle="The days are done. Here's everything you gathered — ready to become a story." />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { v: s.photos, l: "Photos", icon: Camera },
          { v: s.videos, l: "Videos", icon: Camera },
          { v: s.places, l: "Places", icon: MapPin },
          { v: s.experiences, l: "Experiences", icon: Sparkles },
          { v: s.people, l: "People", icon: Users },
          { v: s.notes, l: "Notes", icon: BookOpen },
        ].map((x) => {
          const Icon = x.icon
          return (
            <div key={x.l} className="rounded-2xl border border-border bg-card p-3.5 text-center">
              <Icon className="mx-auto mb-1.5 h-4 w-4 text-copper" />
              <div className="font-serif text-xl leading-none">{x.v}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{x.l}</div>
            </div>
          )
        })}
      </div>

      <div className="rounded-3xl border border-copper/30 bg-copper/5 p-6 text-center">
        <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-copper text-copper-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <h2 className="font-serif text-xl text-balance">Ready to remember this?</h2>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          Travel Studio can compile a first draft of your trip story from everything you gathered. You own it — shape it
          however you like.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <PrimaryButton onClick={() => openOverlay({ type: "story" })}>Open Story Studio</PrimaryButton>
          <GhostButton onClick={() => setTripState("memory")}>Skip for now</GhostButton>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {s.gallery.map((g, i) => (
          <span key={i} className="aspect-square overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g || "/placeholder.svg"} alt="Trip moment" className="h-full w-full object-cover" crossOrigin="anonymous" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- MEMORY ---------- */
function MemoryView() {
  const { openOverlay, setTripState } = useStore()
  const s = TRIP_STORY
  return (
    <div className="space-y-7">
      <div className="relative overflow-hidden rounded-3xl border border-border">
        <div className="relative aspect-[16/10] sm:aspect-[21/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/trips/memory-rain.png" alt="Rain over Manali" className="h-full w-full object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-background sm:p-7">
            <Eyebrow className="text-background/80">A finished story · Yours</Eyebrow>
            <h1 className="mt-1 font-serif text-2xl leading-tight text-balance sm:text-3xl">{s.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-[12px] text-background/85">
              <Avatar src={person("chandan").avatar} name="Chandan" size={20} /> Published by Chandan · 42 saved it
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionHeader eyebrow="The trip, in moments" title="How it actually went" />
        <div className="relative space-y-4 pl-6">
          <span className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
          {s.timeline.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-6 top-2 h-3.5 w-3.5 rounded-full border-2 border-background bg-copper" />
              <div className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                <span className="h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image || "/placeholder.svg"} alt={t.label} className="h-full w-full object-cover" crossOrigin="anonymous" />
                </span>
                <div className="min-w-0 flex-1 py-0.5">
                  <div className="font-serif text-[15px]">{t.label}</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{t.note}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <PrimaryButton onClick={() => openOverlay({ type: "story" })}>Re-open in Story Studio</PrimaryButton>
        <GhostButton onClick={() => setTripState("planning")}>Plan the next one</GhostButton>
      </div>
    </div>
  )
}

export function TripsScreen() {
  const { tripState } = useStore()
  return (
    <div className="space-y-6">
      <StateSwitcher />
      {tripState === "planning" && <PlanningView />}
      {tripState === "active" && <ActiveView />}
      {tripState === "completed" && <CompletedView />}
      {tripState === "memory" && <MemoryView />}
    </div>
  )
}
