"use client"

import { useStore, type Tab } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import { Home, Compass, Map, Inbox, User, Sun, Moon, Bell, Hotel, Check } from "lucide-react"
import { Avatar } from "@/components/shared"
import { person } from "@/lib/data"

import { HomeScreen } from "@/components/screens/home"
import { ExploreScreen } from "@/components/screens/explore"
import { TripsScreen } from "@/components/screens/trips"
import { InboxScreen } from "@/components/screens/inbox"
import { MeScreen } from "@/components/screens/me"
import { GuideStudio } from "@/components/screens/guide"
import { Overlays } from "@/components/overlays"
import { Companion } from "@/components/companion"
import { DemoJourney } from "@/components/demo-journey"

const NAV: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "trips", label: "My Trips", icon: Map },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "me", label: "Me", icon: User },
]

function Logo({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-serif text-lg text-primary-foreground">
        T
      </span>
      {!compact && (
        <div className="leading-none">
          <div className="font-serif text-[15px] tracking-tight">Travel Studio</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Manali</div>
        </div>
      )}
    </div>
  )
}

function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: -20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0 }}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium shadow-lg",
              t.tone === "success"
                ? "border-primary/30 bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground",
            )}
          >
            {t.tone === "success" && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function UtilityCluster() {
  const { theme, toggleTheme, persona, setPersona, openOverlay, toast } = useStore()
  return (
    <div className="flex items-center gap-1.5">
      {/* persona switch */}
      <div className="flex items-center rounded-full border border-border bg-card p-0.5 text-[11px] font-medium">
        <button
          onClick={() => setPersona("traveler")}
          className={cn("rounded-full px-2.5 py-1", persona === "traveler" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
        >
          Traveler
        </button>
        <button
          onClick={() => setPersona("guide")}
          className={cn("rounded-full px-2.5 py-1", persona === "guide" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
        >
          Guide
        </button>
      </div>
      <button
        onClick={() => openOverlay({ type: "hotel" })}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        aria-label="Guest Journey demo"
        title="Hotel Guest Journey"
      >
        <Hotel className="h-4 w-4" />
      </button>
      <button
        onClick={() => toast("Nothing urgent. 3 travelers saved your café.")}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
      </button>
      <button
        onClick={toggleTheme}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>
    </div>
  )
}

function Screen({ tab }: { tab: Tab }) {
  switch (tab) {
    case "home":
      return <HomeScreen />
    case "explore":
      return <ExploreScreen />
    case "trips":
      return <TripsScreen />
    case "inbox":
      return <InboxScreen />
    case "me":
      return <MeScreen />
  }
}

export function AppShell() {
  const { tab, setTab, persona, setPersona, openOverlay } = useStore()
  const me = person("chandan")

  if (persona === "guide") {
    return (
      <div className="min-h-screen bg-background paper-grain">
        <GuideStudio onExit={() => setPersona("traveler")} />
        <Toasts />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background paper-grain">
      {/* Desktop left nav */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col items-center justify-between border-r border-border bg-card/60 py-6 backdrop-blur lg:flex">
        <div className="flex flex-col items-center gap-8">
          <Logo compact />
          <nav className="flex flex-col items-center gap-1">
            {NAV.map((n) => {
              const Icon = n.icon
              const active = tab === n.id
              return (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  className={cn(
                    "group flex w-16 flex-col items-center gap-1 rounded-xl py-2.5 transition-colors",
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                  <span className="text-[10px] font-medium">{n.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        <button onClick={() => setTab("me")} aria-label="Your profile">
          <Avatar src={me.avatar} name={me.name} size={40} ring={tab === "me"} />
        </button>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur lg:pl-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="font-serif text-lg capitalize">{tab === "me" ? "You" : tab === "trips" ? "My Trips" : tab}</span>
          </div>
          <UtilityCluster />
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-4 lg:pl-8 lg:pr-8 lg:pt-6" style={{ paddingLeft: undefined }}>
        <div className="lg:pl-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <Screen tab={tab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {NAV.map((n) => {
            const Icon = n.icon
            const active = tab === n.id
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.3 : 1.8} />
                <span className="text-[10px] font-medium">{n.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <Overlays />
      <Companion />
      <DemoJourney />
      <Toasts />
    </div>
  )
}
