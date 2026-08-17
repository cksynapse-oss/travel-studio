"use client"

import { useStore } from "@/lib/store"
import {
  Avatar,
  Eyebrow,
  Meta,
  SaveButton,
  SectionHeader,
  SourceChip,
  PrimaryButton,
  GhostButton,
  MarkerDot,
  DemoLabel,
} from "@/components/shared"
import { PEOPLE, PLACES, ARTIFACTS, EXPERIENCES, person, place } from "@/lib/data"
import { motion } from "motion/react"
import { ArrowRight, MapPin, Clock, Sun, Navigation, TrendingUp, Sparkle } from "lucide-react"

function Greeting() {
  const hour = 9
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          {greet}, Chandan
        </h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">Your travel world · Monday, 17 Aug</p>
      </div>
      <Avatar src={PEOPLE.chandan.avatar} name="Chandan" size={44} className="mt-1 lg:hidden" />
    </div>
  )
}

/* --------------------------------- Planning --------------------------------- */

function IntentCard() {
  const { savedPlaces, savedExperiences, savedLore, setTab } = useStore()
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="relative h-52 sm:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/trips/manali-cover.png" alt="Manali valley at golden hour" className="h-full w-full object-cover" crossOrigin="anonymous" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 text-background">
          <Eyebrow className="text-background/80">Your upcoming trip</Eyebrow>
          <h2 className="mt-1 font-serif text-3xl leading-none">Manali is 11 days away</h2>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {[
            `${savedPlaces.length} saved places`,
            `${savedExperiences.length} saved experiences`,
            `${savedLore.length} lore`,
            "1 itinerary",
          ].map((c) => (
            <span key={c} className="rounded-full bg-secondary px-3 py-1.5 text-[12px] font-medium text-secondary-foreground">
              {c}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Sun className="h-4 w-4 text-copper" /> 18°C · Clear
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> 12–18 Sep
          </span>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[12px] text-muted-foreground">
            <span>Trip shaping up</span>
            <span>62%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: "62%" }} />
          </div>
        </div>
        <div className="mt-5">
          <PrimaryButton onClick={() => setTab("trips")}>
            Continue planning <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  )
}

function PeopleRow() {
  const { openOverlay } = useStore()
  const items = [
    { id: "aarav", ctx: "is exploring Spiti" },
    { id: "priya", ctx: "just published a 5-day trip" },
    { id: "meera", ctx: "saved a hidden café in Jaipur" },
    { id: "rohan", ctx: "completed a sunrise trek" },
  ]
  return (
    <section className="mb-10">
      <SectionHeader eyebrow="People" title="Where your travelers are" />
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {items.map((it) => {
          const p = person(it.id)
          return (
            <button
              key={it.id}
              onClick={() => openOverlay({ type: "person", id: it.id })}
              className="flex w-40 shrink-0 flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-foreground/20"
            >
              <Avatar src={p.avatar} name={p.name} size={44} />
              <div>
                <div className="text-[14px] font-semibold leading-tight">{p.name.split(" ")[0]}</div>
                <div className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{it.ctx}</div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function DiscoverRow() {
  const { openOverlay } = useStore()
  const artifacts = ARTIFACTS.slice(0, 2)
  return (
    <section className="mb-10">
      <SectionHeader eyebrow="Discover" title="Left behind by other travelers" />
      <div className="grid gap-4 sm:grid-cols-2">
        {artifacts.map((a) => {
          const author = person(a.authorId)
          return (
            <article
              key={a.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/20"
            >
              <button className="block w-full text-left" onClick={() => a.placeId && openOverlay({ type: "place", id: a.placeId })}>
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.image || "/placeholder.svg"}
                    alt={a.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    crossOrigin="anonymous"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium">
                    {a.type}
                  </span>
                </div>
              </button>
              <div className="p-4">
                <h3 className="font-serif text-lg leading-tight text-balance">{a.title}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <Avatar src={author.avatar} name={author.name} size={22} />
                  <span className="text-[12px] text-muted-foreground">
                    Visited by {author.name.split(" ")[0]} · {a.when}
                  </span>
                </div>
                <div className="mt-3">
                  <Meta items={[`${a.saves} saves`, `${a.helpful} helpful`, `${a.downstreamVisits} visited`]} />
                </div>
                <div className="mt-4 flex gap-2">
                  <SaveButton kind="artifact" id={a.id} size="sm" />
                  {a.placeId && (
                    <GhostButton onClick={() => openOverlay({ type: "place", id: a.placeId! })} className="px-3 py-1.5 text-[12px]">
                      <MapPin className="h-3.5 w-3.5" /> View on map
                    </GhostButton>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function AroundYou() {
  const { openOverlay } = useStore()
  const cafe = place("courtyard-cafe")!
  const walk = EXPERIENCES[0]
  return (
    <section className="mb-10">
      <SectionHeader eyebrow="Around you" title="Close to something you saved" />
      <div className="space-y-3">
        <button
          onClick={() => openOverlay({ type: "place", id: cafe.id })}
          className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:border-foreground/20"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cafe.image || "/placeholder.svg"} alt={cafe.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" crossOrigin="anonymous" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <MarkerDot type="place" />
              <span className="text-[13px] font-semibold">{cafe.name}</span>
            </div>
            <div className="mt-1">
              <Meta items={["1.8 km", "Saved by 24 travelers", "Open now"]} />
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
        <button
          onClick={() => openOverlay({ type: "experience", id: walk.id })}
          className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:border-foreground/20"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={walk.image || "/placeholder.svg"} alt={walk.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" crossOrigin="anonymous" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <MarkerDot type="experience" />
              <span className="text-[13px] font-semibold">Food walk starts in 45 min</span>
            </div>
            <div className="mt-1">
              <Meta items={[`₹${walk.priceInr}`, "2.1 km", `${walk.spotsLeft} spots left`]} />
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </section>
  )
}

function ImpactStrip() {
  return (
    <section className="mb-10 rounded-2xl border border-border bg-accent/50 p-5">
      <Eyebrow>Your impact</Eyebrow>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="mt-0.5 h-5 w-5 text-primary" />
          <p className="text-[14px] leading-snug">
            Your Manali recommendation was <span className="font-semibold">saved 42 times.</span>
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Navigation className="mt-0.5 h-5 w-5 text-primary" />
          <p className="text-[14px] leading-snug">
            <span className="font-semibold">7 travelers</span> visited a place you shared.
          </p>
        </div>
      </div>
    </section>
  )
}

function MemoryCard() {
  const { setTab, setTripState, openOverlay } = useStore()
  return (
    <section className="mb-10">
      <SectionHeader eyebrow="Memory" title="From your travel life" />
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative h-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/trips/memory-rain.png" alt="Rain over Old Manali rooftops" className="h-full w-full object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-4 left-5 text-background">
            <Eyebrow className="text-background/80">3 months ago</Eyebrow>
            <p className="mt-1 font-serif text-2xl leading-tight">You were in Manali</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-5">
          <div>
            <Meta items={["9 places", "4 people met", "23 photos"]} />
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              &ldquo;Four days, seen slowly. The rain on the last morning is the part I keep coming back to.&rdquo;
            </p>
          </div>
          <GhostButton
            onClick={() => {
              setTripState("memory")
              setTab("trips")
              openOverlay({ type: "story" })
            }}
          >
            Revisit <ArrowRight className="h-4 w-4" />
          </GhostButton>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- Active --------------------------------- */

function ActiveHome() {
  const { openOverlay, openCompanion } = useStore()
  const cafe = place("courtyard-cafe")!
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <Eyebrow>You are here</Eyebrow>
          <h1 className="mt-1 font-serif text-4xl leading-none">Manali</h1>
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Clock className="h-4 w-4" /> Today · 6:10 PM
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <AmbientCard
          tone="primary"
          eyebrow="Right now"
          title="You're near something you saved"
          body="Old Courtyard Café is 400 m away and open until the light goes."
          action="Open"
          onClick={() => openOverlay({ type: "place", id: cafe.id })}
        />
        <AmbientCard
          eyebrow="Coming up"
          title="Food walk starts at 7:00 PM"
          body="Meet at the old market lane. Three of your saved places are on the route."
          action="View experience"
          onClick={() => openOverlay({ type: "experience", id: "food-walk" })}
        />
        <AmbientCard
          eyebrow="A quiet nudge"
          title="You haven't explored this part of Old Manali"
          body="Two lanes north there's a courtyard Meera wrote about. Almost no one goes."
          action="Ask Companion"
          onClick={() => openCompanion("in-place")}
        />
        <AmbientCard
          eyebrow="Handled"
          title="Your hotel check-in is complete"
          body="Pine View Manali · Room ready. Your Studio is synced with your stay."
        />
      </div>
    </div>
  )
}

function AmbientCard({
  eyebrow,
  title,
  body,
  action,
  onClick,
  tone,
}: {
  eyebrow: string
  title: string
  body: string
  action?: string
  onClick?: () => void
  tone?: "primary"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={
        "flex items-center justify-between gap-4 rounded-2xl border p-4 " +
        (tone === "primary" ? "border-primary/30 bg-accent/60" : "border-border bg-card")
      }
    >
      <div className="min-w-0">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-1 font-serif text-lg leading-tight">{title}</h3>
        <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{body}</p>
      </div>
      {action && (
        <GhostButton onClick={onClick} className="shrink-0">
          {action}
        </GhostButton>
      )}
    </motion.div>
  )
}

/* --------------------------------- Memory state --------------------------------- */

function MemoryHome() {
  return (
    <div>
      <div className="mb-6">
        <Eyebrow>Your world, quietly</Eyebrow>
        <h1 className="mt-1 font-serif text-3xl leading-tight sm:text-4xl">What happened while you were away</h1>
      </div>
      <ImpactStrip />
      <section className="mb-10">
        <SectionHeader eyebrow="Reactions" title="Your Manali story is finding people" />
        <div className="space-y-3">
          {[
            { p: "priya", t: "saved your trip story", when: "2h ago" },
            { p: "rohan", t: "followed the hidden trail you shared", when: "yesterday" },
            { p: "meera", t: "asked a question about the courtyard café", when: "2 days ago" },
          ].map((r) => {
            const pr = person(r.p)
            return (
              <div key={r.p} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <Avatar src={pr.avatar} name={pr.name} size={38} />
                <p className="text-[14px]">
                  <span className="font-semibold">{pr.name.split(" ")[0]}</span> {r.t}
                </p>
                <span className="ml-auto text-[12px] text-muted-foreground">{r.when}</span>
              </div>
            )
          })}
        </div>
      </section>
      <MemoryCard />
    </div>
  )
}

export function HomeScreen() {
  const { tripState } = useStore()

  if (tripState === "active") {
    return (
      <div>
        <Greeting />
        <ActiveHome />
      </div>
    )
  }

  if (tripState === "memory" || tripState === "completed") {
    return (
      <div>
        <Greeting />
        <MemoryHome />
      </div>
    )
  }

  // planning (default)
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Greeting />
      </div>
      <div className="mb-6 flex items-center gap-2">
        <DemoLabel />
        <span className="text-[11px] text-muted-foreground">Prototype · fictional Manali content</span>
      </div>
      <IntentCard />
      <PeopleRow />
      <DiscoverRow />
      <AroundYou />
      <ImpactStrip />
      <MemoryCard />
    </div>
  )
}
