"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  MapPin,
  Sparkles,
  BookOpen,
  Clock,
  Users,
  Check,
  Star,
  ArrowRight,
  Camera,
  UserPlus,
  Heart,
  Quote,
  Wand2,
  Hotel,
  Compass,
  ShieldCheck,
} from "lucide-react"
import { useStore, type Overlay } from "@/lib/store"
import {
  PLACES,
  EXPERIENCES,
  LORE,
  ITINERARIES,
  HOTELS,
  OPERATORS,
  TRIP_STORY,
  person,
  place as findPlace,
  experience as findExperience,
} from "@/lib/data"
import {
  Avatar,
  BottomSheet,
  Eyebrow,
  PrimaryButton,
  GhostButton,
  SaveButton,
  SourceChip,
  Stat,
  Meta,
} from "@/components/shared"
import { cn } from "@/lib/utils"

/* ---------------- PLACE ---------------- */
function PlaceSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const p = findPlace(id)
  const { openOverlay, toast } = useStore()
  if (!p) return null
  const rec = p.recommendedBy ? person(p.recommendedBy.personId) : null
  return (
    <BottomSheet onClose={onClose}>
      <div className="relative aspect-[16/10]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
        <span className="absolute left-4 top-4 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
          {p.markerType === "hidden" ? "Hidden gem" : p.category}
        </span>
      </div>
      <div className="p-5">
        <h2 className="font-serif text-2xl leading-tight text-balance">{p.name}</h2>
        <div className="mt-2">
          <Meta items={[`${p.distanceKm} km away`, p.openNow ? "Open now" : "Closed", `${p.saves} saved`]} />
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{p.blurb}</p>

        {rec && p.recommendedBy && (
          <button
            onClick={() => openOverlay({ type: "person", id: rec.id })}
            className="mt-4 flex w-full items-start gap-3 rounded-2xl border border-copper/30 bg-copper/5 p-3.5 text-left"
          >
            <Avatar src={rec.avatar} name={rec.name} size={40} />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[13px] font-medium">
                {rec.name} recommends this
                {rec.verifiedLocal && <SourceChip>Verified local</SourceChip>}
              </div>
              <p className="mt-1 text-[13px] italic leading-relaxed text-foreground">
                <Quote className="mr-1 inline h-3 w-3 text-copper" />
                {p.recommendedBy.quote}
              </p>
              <div className="mt-1 text-[11px] text-muted-foreground">{p.recommendedBy.when}</div>
            </div>
          </button>
        )}

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-border bg-secondary/40 p-4">
          <Stat value={p.rating} label="Rating" />
          <Stat value={p.helpful} label="Found helpful" />
          <Stat value={p.visits} label="Visited after" />
        </div>

        <div className="mt-4 flex gap-2">
          <SaveButton kind="place" id={p.id} full />
          <GhostButton onClick={() => toast("Directions opened in Maps")}>
            <MapPin className="h-3.5 w-3.5" /> Directions
          </GhostButton>
        </div>
      </div>
    </BottomSheet>
  )
}

/* ---------------- LORE ---------------- */
function LoreSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const l = LORE.find((x) => x.id === id)
  const { openOverlay } = useStore()
  if (!l) return null
  const source = person(l.sourceId)
  const p = findPlace(l.placeId)
  return (
    <BottomSheet onClose={onClose}>
      <div className="p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-copper/10 px-3 py-1 text-[11px] font-medium text-copper">
          <BookOpen className="h-3.5 w-3.5" /> Local lore
        </span>
        <h2 className="mt-3 font-serif text-2xl leading-tight text-balance">{l.title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground">{l.body}</p>

        <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4">
          <button onClick={() => openOverlay({ type: "person", id: source.id })} className="flex items-center gap-3 text-left">
            <Avatar src={source.avatar} name={source.name} size={38} />
            <div>
              <div className="flex items-center gap-1.5 text-[13px] font-medium">
                {source.name}
                {source.verifiedLocal && <SourceChip>Verified local</SourceChip>}
              </div>
              <div className="text-[12px] text-muted-foreground">{l.sourceNote}</div>
            </div>
          </button>
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-[12px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> {l.trust} · {l.date}
          </div>
        </div>

        {p && (
          <button
            onClick={() => openOverlay({ type: "place", id: p.id })}
            className="mt-4 flex w-full items-center justify-between rounded-2xl border border-border bg-card p-3.5 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="h-11 w-11 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
              </span>
              <span>
                <span className="block text-[13px] font-medium">{p.name}</span>
                <span className="block text-[12px] text-muted-foreground">Where this story lives</span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        <div className="mt-4">
          <SaveButton kind="lore" id={l.id} full label="Save this story" />
        </div>
      </div>
    </BottomSheet>
  )
}

/* ---------------- PERSON ---------------- */
function PersonSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const pr = person(id)
  const { following, toggleFollow, connections, connectionRequests, requestConnection, completedExp, openOverlay } =
    useStore()
  const isFollowing = following.includes(pr.id)
  const isConnected = connections.includes(pr.id)
  const requested = connectionRequests.includes(pr.id)
  const sharedExperience = completedExp.length > 0
  const authored = ITINERARIES.filter((it) => it.authorId === pr.id)

  return (
    <BottomSheet onClose={onClose}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar src={pr.avatar} name={pr.name} size={64} ring />
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl leading-tight">{pr.name}</h2>
              {pr.verifiedLocal && <SourceChip>Verified local</SourceChip>}
            </div>
            <div className="text-[12px] text-muted-foreground">{pr.handle}</div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
              <ShieldCheck className="h-3 w-3" /> {pr.trust.label}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-foreground">{pr.bio}</p>

        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
          {pr.styleTags.map((t) => (
            <span key={t} className="whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 rounded-2xl border border-border bg-secondary/40 p-4">
          <Stat value={pr.trips} label="Trips" />
          <Stat value={pr.places} label="Places" />
          <Stat value={pr.itineraries} label="Routes" />
          <Stat value={pr.followers.toLocaleString()} label="Followers" />
        </div>

        <div className="mt-3 rounded-2xl border border-copper/30 bg-copper/5 p-4">
          <Eyebrow>Real-world impact</Eyebrow>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Stat value={pr.impact.saves} label="Saves earned" />
            <Stat value={pr.impact.visits} label="Visits inspired" />
            <Stat value={pr.impact.answered} label="Questions answered" />
          </div>
        </div>

        {authored.length > 0 && (
          <div className="mt-4">
            <Eyebrow>Routes worth borrowing</Eyebrow>
            <div className="mt-2 grid gap-2">
              {authored.map((it) => (
                <div key={it.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5">
                  <span className="h-12 w-14 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.cover || "/placeholder.svg"} alt={it.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium">{it.title}</div>
                    <div className="text-[11px] text-muted-foreground">{it.days} days · {it.saves} saved</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => toggleFollow(pr.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors",
              isFollowing ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground",
            )}
          >
            {isFollowing ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
            {isFollowing ? "Following" : "Follow"}
          </button>
          {isConnected ? (
            <span className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-primary bg-primary/10 px-4 py-2.5 text-[13px] font-semibold text-primary">
              <Check className="h-4 w-4" /> Connected
            </span>
          ) : (
            <button
              onClick={() => requestConnection(pr.id)}
              disabled={!sharedExperience || requested}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-copper px-4 py-2.5 text-[13px] font-semibold text-copper-foreground disabled:opacity-45"
            >
              <UserPlus className="h-4 w-4" /> {requested ? "Requested" : "Connect"}
            </button>
          )}
        </div>
        {!sharedExperience && !isConnected && (
          <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
            Connection unlocks after you&apos;ve shared a real experience together — presence is earned, not requested.
          </p>
        )}
      </div>
    </BottomSheet>
  )
}

/* ---------------- EXPERIENCE (detail) ---------------- */
function ExperienceSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const e = findExperience(id)
  const { openOverlay, booked } = useStore()
  if (!e) return null
  const host = person(e.hostId)
  const isBooked = booked.includes(e.id)
  return (
    <BottomSheet onClose={onClose}>
      <div className="relative aspect-[16/10]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={e.image || "/placeholder.svg"} alt={e.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
          <Sparkles className="h-3 w-3" /> Human-led experience
        </span>
      </div>
      <div className="p-5">
        <h2 className="font-serif text-2xl leading-tight text-balance">{e.title}</h2>
        <div className="mt-2">
          <Meta items={[`${e.durationHrs} hrs`, e.groupSize, `Starts ${e.startsAt}`, `${e.spotsLeft} spots left`]} />
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{e.blurb}</p>

        <button
          onClick={() => openOverlay({ type: "person", id: host.id })}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-3.5 text-left"
        >
          <Avatar src={host.avatar} name={host.name} size={44} ring={host.verifiedLocal} />
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[13px] font-medium">
              Hosted by {host.name}
              {host.verifiedLocal && <SourceChip>Verified local</SourceChip>}
            </div>
            <div className="text-[12px] text-muted-foreground">{e.completed} people did this · {e.artifacts} artifacts created</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-border p-4">
          <div>
            <div className="font-serif text-2xl leading-none">₹{e.priceInr}</div>
            <div className="mt-1 text-[12px] text-muted-foreground">per person</div>
          </div>
          {isBooked ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2.5 text-[13px] font-semibold text-primary">
              <Check className="h-4 w-4" /> Booked
            </span>
          ) : (
            <PrimaryButton onClick={() => openOverlay({ type: "experienceFlow", id: e.id, step: 0 })}>
              Book this experience
            </PrimaryButton>
          )}
        </div>
        <div className="mt-3">
          <SaveButton kind="experience" id={e.id} full label="Save to my trip" />
        </div>
      </div>
    </BottomSheet>
  )
}

/* ---------------- EXPERIENCE FLOW (book -> complete -> connect) ---------------- */
function ExperienceFlow({ id, step, onClose }: { id: string; step: number; onClose: () => void }) {
  const e = findExperience(id)
  const {
    bookExperience,
    completeExperience,
    booked,
    requestConnection,
    connectionRequests,
    openOverlay,
    setTripState,
  } = useStore()
  const [seats, setSeats] = useState(1)
  if (!e) return null
  const host = person(e.hostId)

  return (
    <BottomSheet onClose={onClose}>
      <div className="p-5">
        <div className="mb-4 flex items-center gap-1.5">
          {[0, 1, 2, 3].map((s) => (
            <span key={s} className={cn("h-1.5 flex-1 rounded-full", s <= step ? "bg-primary" : "bg-border")} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0/1: booking */}
          {step <= 1 && (
            <motion.div key="book" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Eyebrow>Confirm your spot</Eyebrow>
              <h2 className="mt-1.5 font-serif text-2xl leading-tight text-balance">{e.title}</h2>
              <div className="mt-2">
                <Meta items={[`Tonight · ${e.startsAt}`, `${e.durationHrs} hrs`, `with ${host.name}`]} />
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-secondary/40 p-4">
                <span className="text-[13px] font-medium">Travelers</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSeats((s) => Math.max(1, s - 1))} className="h-8 w-8 rounded-full border border-border text-lg leading-none">-</button>
                  <span className="w-5 text-center font-serif text-lg">{seats}</span>
                  <button onClick={() => setSeats((s) => Math.min(e.spotsLeft, s + 1))} className="h-8 w-8 rounded-full border border-border text-lg leading-none">+</button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-2xl border border-border p-4">
                <span className="text-[13px] text-muted-foreground">{seats} × ₹{e.priceInr}</span>
                <span className="font-serif text-2xl leading-none">₹{e.priceInr * seats}</span>
              </div>

              <div className="mt-4">
                <PrimaryButton
                  full
                  onClick={() => {
                    bookExperience(e.id)
                    openOverlay({ type: "experienceFlow", id: e.id, step: 2 })
                  }}
                >
                  Confirm & pay ₹{e.priceInr * seats}
                </PrimaryButton>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">Demo checkout — no real payment is taken.</p>
            </motion.div>
          )}

          {/* Step 2: booked confirmation */}
          {step === 2 && (
            <motion.div key="confirmed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Check className="h-7 w-7" strokeWidth={2.5} />
              </motion.span>
              <h2 className="font-serif text-2xl leading-tight text-balance">You&apos;re booked</h2>
              <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                {host.name} will meet you at the market gate at {e.startsAt}. This is now part of your active trip.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <PrimaryButton
                  full
                  onClick={() => {
                    completeExperience(e.id)
                    openOverlay({ type: "experienceFlow", id: e.id, step: 3 })
                  }}
                >
                  <Sparkles className="h-4 w-4" /> Simulate: we did it together
                </PrimaryButton>
                <GhostButton onClick={onClose}>Back to trip</GhostButton>
              </div>
            </motion.div>
          )}

          {/* Step 3: shared moment + connection */}
          {step === 3 && (
            <motion.div key="shared" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center">
                <Eyebrow>A shared moment</Eyebrow>
                <h2 className="mt-1.5 font-serif text-2xl leading-tight text-balance">You experienced this together</h2>
                <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                  Six tastes, six stories, and Tenzin&apos;s grandmother&apos;s recipe. Presence, not points.
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-copper/30 bg-copper/5 p-4">
                <Avatar src={host.avatar} name={host.name} size={48} ring />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-[13px] font-medium">
                    {host.name}
                    {host.verifiedLocal && <SourceChip>Verified local</SourceChip>}
                  </div>
                  <div className="text-[12px] text-muted-foreground">You can connect now — you&apos;ve shared something real.</div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    requestConnection(host.id)
                  }}
                  disabled={connectionRequests.includes(host.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-full bg-copper px-4 py-3 text-[13px] font-semibold text-copper-foreground disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  {connectionRequests.includes(host.id) ? "Connection requested" : `Connect with ${host.name}`}
                </button>
                <PrimaryButton
                  full
                  onClick={() => {
                    onClose()
                    openOverlay({ type: "createArtifact" })
                  }}
                >
                  <Camera className="h-4 w-4" /> Leave an artifact behind
                </PrimaryButton>
                <GhostButton
                  onClick={() => {
                    setTripState("active")
                    onClose()
                  }}
                >
                  Back to trip
                </GhostButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BottomSheet>
  )
}

/* ---------------- CREATE ARTIFACT ---------------- */
const ARTIFACT_TYPES = ["Photo story", "Hidden gem", "Note", "Review", "Lore"] as const

function CreateArtifact({ onClose }: { onClose: () => void }) {
  const { addArtifact } = useStore()
  const [type, setType] = useState<(typeof ARTIFACT_TYPES)[number]>("Photo story")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState<string>("/trips/gallery-1.png")
  const [visibility, setVisibility] = useState<"Public" | "Followers" | "Connections" | "Only me">("Public")
  const gallery = TRIP_STORY.gallery

  return (
    <BottomSheet onClose={onClose}>
      <div className="p-5">
        <Eyebrow>Leave something behind</Eyebrow>
        <h2 className="mt-1.5 font-serif text-2xl leading-tight text-balance">Create an artifact</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          A photo and one honest sentence is enough. This is how the human layer of the map grows.
        </p>

        <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto">
          {ARTIFACT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-medium",
                type === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Eyebrow>Pick a photo</Eyebrow>
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
            {gallery.map((g) => (
              <button
                key={g}
                onClick={() => setImage(g)}
                className={cn(
                  "h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                  image === g ? "border-primary" : "border-transparent",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g || "/placeholder.svg"} alt="Option" className="h-full w-full object-cover" crossOrigin="anonymous" />
              </button>
            ))}
          </div>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give it a title…"
          className="mt-4 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-[14px] outline-none focus:border-primary"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="One honest sentence about why this mattered…"
          rows={3}
          className="mt-2 w-full resize-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-[14px] outline-none focus:border-primary"
        />

        <div className="mt-3">
          <Eyebrow>Who can see this</Eyebrow>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(["Public", "Followers", "Connections", "Only me"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[12px] font-medium",
                  visibility === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <PrimaryButton
            full
            onClick={() => {
              addArtifact({
                authorId: "chandan",
                type: type as never,
                title: title.trim() || "A moment in Manali",
                body: body.trim() || "Something worth remembering.",
                image,
                when: "Just now",
                visibility,
              })
              onClose()
            }}
          >
            Share artifact
          </PrimaryButton>
        </div>
      </div>
    </BottomSheet>
  )
}

/* ---------------- STORY STUDIO ---------------- */
function StoryStudio({ onClose }: { onClose: () => void }) {
  const { setTripState, toast } = useStore()
  const [compiled, setCompiled] = useState(false)
  const [compiling, setCompiling] = useState(false)
  const s = TRIP_STORY

  return (
    <BottomSheet onClose={onClose}>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-copper text-copper-foreground">
            <Wand2 className="h-4 w-4" />
          </span>
          <div>
            <Eyebrow>Trip Story Studio</Eyebrow>
            <div className="font-serif text-lg leading-tight">Compose your memory</div>
          </div>
        </div>

        {!compiled ? (
          <div className="mt-4">
            <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-[13px] leading-relaxed text-muted-foreground">
              Travel Studio will read your {s.photos} photos, {s.places} places and {s.people} connections and draft a
              first version. The AI proposes — <span className="font-medium text-foreground">you decide</span>.
            </div>
            <div className="mt-4">
              <PrimaryButton
                full
                onClick={() => {
                  setCompiling(true)
                  setTimeout(() => {
                    setCompiling(false)
                    setCompiled(true)
                  }, 1400)
                }}
              >
                {compiling ? (
                  <span className="inline-flex items-center gap-2">
                    <motion.span
                      className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7, ease: "linear" }}
                    />
                    Reading your trip…
                  </span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Compile first draft
                  </>
                )}
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              <Check className="h-3 w-3" /> Draft ready — edit anything
            </span>
            <input
              defaultValue={s.title}
              className="mt-3 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 font-serif text-lg outline-none focus:border-primary"
            />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {s.gallery.slice(0, 6).map((g, i) => (
                <span key={i} className="aspect-square overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g || "/placeholder.svg"} alt="Moment" className="h-full w-full object-cover" crossOrigin="anonymous" />
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {s.timeline.slice(0, 3).map((t) => (
                <div key={t.id} className="rounded-xl border border-border bg-card p-3">
                  <div className="text-[12px] font-medium text-copper">{t.label}</div>
                  <div className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{t.note}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <PrimaryButton
                full
                onClick={() => {
                  setTripState("memory")
                  toast("Story published — it's yours", "success")
                  onClose()
                }}
              >
                Publish story
              </PrimaryButton>
              <GhostButton onClick={onClose}>Save draft</GhostButton>
            </div>
          </motion.div>
        )}
      </div>
    </BottomSheet>
  )
}

/* ---------------- HOTEL GUEST JOURNEY ---------------- */
function HotelJourney({ onClose }: { onClose: () => void }) {
  const { openOverlay } = useStore()
  const hotel = HOTELS[0]
  const curated = PLACES.slice(0, 3)
  return (
    <BottomSheet onClose={onClose}>
      <div className="relative aspect-[16/10]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-background">
          <span className="inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
            <Hotel className="h-3 w-3" /> Partner · Guest Journey
          </span>
          <h2 className="mt-2 font-serif text-2xl leading-tight">{hotel.name}</h2>
          <div className="text-[12px] text-background/85">{hotel.area}</div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          Your host curated a mini-guide for your stay — the same human layer, delivered as a branded welcome. This is
          how partners plug into Travel Studio.
        </p>
        <div className="mt-4 grid gap-2">
          {curated.map((p) => (
            <button
              key={p.id}
              onClick={() => openOverlay({ type: "place", id: p.id })}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 text-left"
            >
              <span className="h-12 w-14 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">{p.category} · {p.distanceKm} km from the lodge</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-copper/30 bg-copper/5 p-4">
          <Eyebrow>Why this matters</Eyebrow>
          <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
            Hotels and operators don&apos;t just advertise — they extend the traveler&apos;s journey with real recommendations,
            and earn from experiences booked through their guide.
          </p>
        </div>
      </div>
    </BottomSheet>
  )
}

/* ---------------- GUIDE PREVIEW (from utility) ---------------- */
function GuideSheet({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet onClose={onClose}>
      <div className="p-5">
        <Eyebrow>For operators</Eyebrow>
        <h2 className="mt-1.5 font-serif text-2xl leading-tight text-balance">List an experience</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          Switch to the Guide persona from the top bar to see the full operator studio.
        </p>
        <div className="mt-4 grid gap-2">
          {OPERATORS.map((o) => {
            const p = person(o.personId)
            return (
              <div key={o.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <Avatar src={p.avatar} name={p.name} size={36} />
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{o.name}</div>
                  <div className="text-[11px] text-muted-foreground">{o.specialty}</div>
                </div>
                <Compass className="h-4 w-4 text-copper" />
              </div>
            )
          })}
        </div>
      </div>
    </BottomSheet>
  )
}

/* ---------------- CONVERSATION (search / inbox thread) ---------------- */
function ConversationSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const isSearch = id === "search"
  return (
    <BottomSheet onClose={onClose}>
      <div className="p-5">
        {isSearch ? (
          <>
            <Eyebrow>Ask Travel Studio</Eyebrow>
            <h2 className="mt-1.5 font-serif text-2xl leading-tight text-balance">
              &ldquo;A quiet café with the best afternoon light&rdquo;
            </h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-[13px] leading-relaxed text-foreground">
                The Old Courtyard Café fits — Aarav flagged the light between 4 and 6 PM, three weeks ago.
                <div className="mt-2">
                  <SourceChip>From Aarav · 3 weeks ago</SourceChip>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose()
                }}
                className="w-full"
              >
                <SaveButton kind="place" id="courtyard-cafe" full label="Save the café" />
              </button>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              The AI interprets the human layer — it always shows you whose experience it&apos;s drawing from.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Avatar src={person(id).avatar} name={person(id).name} size={44} />
              <div>
                <div className="text-[14px] font-medium">{person(id).name}</div>
                <div className="text-[12px] text-muted-foreground">You shared the food walk together</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-secondary p-3 text-[13px]">
                That courtyard you mentioned — is it open in the rain?
              </div>
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary p-3 text-[13px] text-primary-foreground">
                Yep, the covered side stays open. Go before 5.
              </div>
            </div>
            <input
              placeholder="Message…"
              className="mt-4 w-full rounded-full border border-border bg-card px-4 py-2.5 text-[14px] outline-none focus:border-primary"
            />
          </>
        )}
      </div>
    </BottomSheet>
  )
}

/* ---------------- ROUTER ---------------- */
function OverlayRouter({ overlay, onClose }: { overlay: Overlay; onClose: () => void }) {
  switch (overlay.type) {
    case "place":
      return <PlaceSheet id={overlay.id} onClose={onClose} />
    case "lore":
      return <LoreSheet id={overlay.id} onClose={onClose} />
    case "person":
      return <PersonSheet id={overlay.id} onClose={onClose} />
    case "experience":
      return <ExperienceSheet id={overlay.id} onClose={onClose} />
    case "experienceFlow":
      return <ExperienceFlow id={overlay.id} step={overlay.step} onClose={onClose} />
    case "createArtifact":
      return <CreateArtifact onClose={onClose} />
    case "story":
      return <StoryStudio onClose={onClose} />
    case "hotel":
      return <HotelJourney onClose={onClose} />
    case "guide":
      return <GuideSheet onClose={onClose} />
    case "conversation":
      return <ConversationSheet id={overlay.id} onClose={onClose} />
    default:
      return null
  }
}

export function Overlays() {
  const { overlays, closeOverlay } = useStore()
  const top = overlays[overlays.length - 1]
  return (
    <AnimatePresence>
      {top && <OverlayRouter key={overlays.length + top.type} overlay={top} onClose={closeOverlay} />}
    </AnimatePresence>
  )
}
