"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  MapPin,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Globe,
  Lock,
  Users,
  TrendingUp,
  Navigation,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { ARTIFACTS, ITINERARIES, PLACES, LORE, person } from "@/lib/data"
import {
  Avatar,
  Eyebrow,
  Meta,
  Stat,
  SectionHeader,
  SaveButton,
  SourceChip,
  GhostButton,
  PrimaryButton,
} from "@/components/shared"
import { cn } from "@/lib/utils"

type ProfileTab = "Artifacts" | "Trips" | "Places" | "Lore" | "Saved"

/* -------------------- Visited map -------------------- */
function VisitedMap() {
  const visitedPlaces = PLACES.slice(0, 5)
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
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
      </svg>
      {/* visited dots */}
      {visitedPlaces.map((p, i) => (
        <motion.span
          key={p.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05 * i, type: "spring", stiffness: 400, damping: 20 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-copper shadow-md ring-2 ring-background">
            <MapPin className="h-2.5 w-2.5 text-copper-foreground" />
          </span>
        </motion.span>
      ))}
      <div className="absolute bottom-3 left-3 rounded-xl border border-border bg-card/90 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur">
        Visited places · approximate only
      </div>
    </div>
  )
}

/* -------------------- Artifact card -------------------- */
function ArtifactCard({ id }: { id: string }) {
  const art = ARTIFACTS.find((a) => a.id === id)
  if (!art) return null
  const isPublic = art.visibility === "Public"
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      {art.image && (
        <div className="relative aspect-[16/10]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art.image || "/placeholder.svg"} alt={art.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2">
            <span className="rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
              {art.type}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-[11px] backdrop-blur">
              {isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {art.visibility}
            </span>
          </div>
        </div>
      )}
      <div className="p-3.5">
        <h3 className="font-serif text-[15px] leading-snug text-balance">{art.title}</h3>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">{art.body}</p>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{art.saves} saves · {art.downstreamVisits} visited after</span>
          <span>{art.when}</span>
        </div>
      </div>
    </article>
  )
}

/* -------------------- Saved tab -------------------- */
function SavedTab() {
  const { savedPlaces, savedExperiences, savedLore, openOverlay } = useStore()
  const places = PLACES.filter((p) => savedPlaces.includes(p.id))
  return (
    <div className="space-y-6">
      {places.length > 0 && (
        <div>
          <Eyebrow className="mb-3 block">Places</Eyebrow>
          <div className="grid gap-3 sm:grid-cols-2">
            {places.map((p) => (
              <button
                key={p.id}
                onClick={() => openOverlay({ type: "place", id: p.id })}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 text-left"
              >
                <span className="h-14 w-16 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-[14px]">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">{p.category}</div>
                  <SaveButton kind="place" id={p.id} size="sm" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {savedExperiences.length > 0 && (
        <div>
          <Eyebrow className="mb-3 block">Experiences</Eyebrow>
          <div className="space-y-2">
            {savedExperiences.map((id) => {
              const exp = { title: "Old Manali Food Walk", id }
              return (
                <div key={id} className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
                  <span className="text-[13px] font-medium">{exp.title}</span>
                  <SaveButton kind="experience" id={id} size="sm" />
                </div>
              )
            })}
          </div>
        </div>
      )}
      {savedLore.length === 0 && savedExperiences.length === 0 && places.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
          Nothing saved yet. Save places, experiences and lore from Explore.
        </div>
      )}
    </div>
  )
}

/* -------------------- Main profile -------------------- */
export function MeScreen() {
  const { following, connections } = useStore()
  const me = person("chandan")
  const [tab, setTab] = useState<ProfileTab>("Artifacts")

  const myArtifacts = ARTIFACTS.filter((a) => a.authorId === "chandan")
  const myItineraries = ITINERARIES.filter((it) => it.authorId === "chandan")

  const tabs: ProfileTab[] = ["Artifacts", "Trips", "Places", "Lore", "Saved"]

  return (
    <div className="space-y-7">
      {/* Header cover */}
      <div className="relative overflow-hidden rounded-3xl border border-border">
        <div className="relative aspect-[16/8] sm:aspect-[21/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/trips/manali-cover.png"
            alt="Manali"
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-5 sm:p-6">
            <Avatar src={me.avatar} name={me.name} size={68} ring className="shrink-0 ring-background/50" />
            <div className="flex-1 text-background">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl leading-tight">{me.name}</h1>
                <div className="flex items-center gap-1 rounded-full bg-background/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                  <ShieldCheck className="h-3 w-3" />
                  {me.trust.label}
                </div>
              </div>
              <p className="mt-0.5 text-[12px] text-background/80">{me.handle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio + style */}
      <div>
        <p className="max-w-xl text-[14px] leading-relaxed text-foreground">{me.bio}</p>
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
          {me.styleTags.map((t) => (
            <span
              key={t}
              className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-[12px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-1 rounded-2xl border border-border bg-card p-3 text-center">
          <Stat value={me.trips} label="Trips" />
        </div>
        <div className="col-span-1 rounded-2xl border border-border bg-card p-3 text-center">
          <Stat value={me.places} label="Places" />
        </div>
        <div className="col-span-1 rounded-2xl border border-border bg-card p-3 text-center">
          <Stat value={me.itineraries} label="Routes" />
        </div>
        <div className="col-span-1 rounded-2xl border border-border bg-card p-3 text-center">
          <Stat value={following.length + 1} label="Following" />
        </div>
        <div className="col-span-1 rounded-2xl border border-border bg-card p-3 text-center">
          <Stat value={connections.length + 38} label="Connected" />
        </div>
      </div>

      {/* Trust signals */}
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, label: me.trust.label, sub: `${me.trust.verifiedVisits} verified visits` },
          { icon: TrendingUp, label: `${me.trust.usefulRecs} useful recs`, sub: "Recommendations others acted on" },
          { icon: Navigation, label: `${me.impact.visits} downstream visits`, sub: "Places visited from your shares" },
        ].map((t, i) => {
          const Icon = t.icon
          return (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-copper/25 bg-copper/5 p-3.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
              <div>
                <div className="text-[13px] font-medium">{t.label}</div>
                <div className="text-[11px] text-muted-foreground">{t.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Impact */}
      <div className="rounded-2xl border border-border bg-accent/50 p-5">
        <SectionHeader eyebrow="Travel impact" title="Real-world usefulness" />
        <div className="grid grid-cols-3 gap-4">
          <Stat value={me.impact.saves} label="Saves earned" />
          <Stat value={me.impact.visits} label="Visits inspired" />
          <Stat value={me.impact.answered} label="Questions answered" />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
          This replaces XP, streaks and meaningless points. Your reputation is built from real-world usefulness.
        </p>
      </div>

      {/* Visited map */}
      <div>
        <SectionHeader eyebrow="Places you've been" title="Your travel footprint" />
        <VisitedMap />
      </div>

      {/* Tab bar */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto border-b border-border px-4 pb-0">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 pb-3 text-[13px] font-medium transition-colors",
              tab === t
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        {tab === "Artifacts" && (
          <div className="space-y-4">
            {myArtifacts.length > 0 ? (
              <>
                <p className="text-[13px] text-muted-foreground">Artifacts you left behind for others.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {myArtifacts.map((a) => (
                    <ArtifactCard key={a.id} id={a.id} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
                You haven&apos;t created any artifacts yet. A photo and one sentence is enough.
              </div>
            )}
          </div>
        )}

        {tab === "Trips" && (
          <div className="space-y-3">
            <p className="text-[13px] text-muted-foreground">Trips you&apos;ve taken and the routes you&apos;ve shared.</p>
            {myItineraries.length > 0 ? (
              myItineraries.map((it) => (
                <div key={it.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3.5">
                  <span className="h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.cover || "/placeholder.svg"} alt={it.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif text-[15px]">{it.title}</div>
                    <div className="mt-0.5 text-[12px] text-muted-foreground">{it.days} days · {it.saves} saves</div>
                    <p className="mt-1 text-[12px] italic text-muted-foreground line-clamp-1">&ldquo;{it.quote}&rdquo;</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-border bg-secondary/40 p-5 text-center">
                <p className="text-[14px] font-serif">Your Manali trip · In progress</p>
                <p className="mt-1.5 text-[13px] text-muted-foreground">Complete the trip to add it here.</p>
              </div>
            )}
            {/* Always show the Manali trip in planning state */}
            <div className="flex gap-3 rounded-2xl border border-border bg-card p-3.5">
              <span className="h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/trips/manali-cover.png" alt="Manali" className="h-full w-full object-cover" crossOrigin="anonymous" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-serif text-[15px]">My Trip · Manali</div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">12–18 Sep · Planning</div>
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-copper">
                  <Sparkles className="h-3 w-3" />
                  In progress
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "Places" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {PLACES.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5">
                <span className="h-14 w-16 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-[14px]">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">{p.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Lore" && (
          <div className="space-y-3">
            <p className="text-[13px] text-muted-foreground">
              Human knowledge attached to places — stories that explain why things are the way they are.
            </p>
            {LORE.slice(0, 2).map((l) => (
              <div key={l.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-1.5 text-[11px] text-copper">
                  <BookOpen className="h-3.5 w-3.5" />
                  Local lore
                </div>
                <h3 className="mt-1.5 font-serif text-[15px] leading-snug">{l.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground line-clamp-3">{l.body}</p>
                <div className="mt-2 text-[11px] text-muted-foreground">{l.date}</div>
              </div>
            ))}
            {LORE.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
                No lore yet. Save a lore entry from Explore to keep it here.
              </div>
            )}
          </div>
        )}

        {tab === "Saved" && <SavedTab />}
      </motion.div>
    </div>
  )
}
