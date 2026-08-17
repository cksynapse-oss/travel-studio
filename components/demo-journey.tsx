"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react"
import { useStore, DEMO_STEPS } from "@/lib/store"
import { cn } from "@/lib/utils"

type Step = { title: string; caption: string }

const STEPS: Step[] = [
  { title: "Your world", caption: "Home answers one question: what changed in my travel world since I last opened the app?" },
  { title: "Discover an artifact", caption: "A human left this behind — a real place, with a reason to care." },
  { title: "Save it", caption: "Save is a first-class intent signal. Watch it become part of your Manali trip." },
  { title: "Open the map", caption: "The map's differentiation is the human layer — experiences, lore, hidden gems." },
  { title: "Save an experience", caption: "The food walk is hosted by a Verified local. Saving it shapes your trip." },
  { title: "Open My Trip", caption: "A trip is a state, composed from human discoveries — not a rigid planner." },
  { title: "Go active", caption: "Switch the trip to Active. The whole system becomes ambient and contextual." },
  { title: "Something nearby", caption: "Travel Studio knows where you are, what you saved, and the time of day." },
  { title: "Ask the Companion", caption: "The AI interprets human experience — it never replaces it. Note the source chips." },
  { title: "Book the experience", caption: "Experience transactions are the first serious monetization surface." },
  { title: "Complete it", caption: "You experienced this together. This is a core social primitive." },
  { title: "Connect", caption: "Connection unlocks only after a shared experience and mutual consent." },
  { title: "Create an artifact", caption: "Low-friction contribution. A photo and one sentence is a valid artifact." },
  { title: "Complete the trip", caption: "184 photos, 12 places, 4 connections — ready to remember." },
  { title: "Story Studio", caption: "AI compiles a first draft. You own and shape the final artifact." },
  { title: "Publish", caption: "The finished story visibly belongs to you." },
  { title: "Your profile", caption: "How you experience the world — trips, places, lore, and saves." },
  { title: "Impact & reputation", caption: "Real-world usefulness replaces XP, streaks and meaningless points." },
  { title: "Back to Home", caption: "Between trips, the app still has a reason to exist." },
  { title: "What changed", caption: "Your recommendation was saved 42 times. Seven travelers followed your path." },
]

export function DemoJourney() {
  const s = useStore()
  const { demoActive, demoStep, startDemo, stopDemo, demoNext, demoPrev } = s

  // Drive the app from the current demo step.
  useEffect(() => {
    if (!demoActive) return
    const go = (fn: () => void) => fn()
    switch (demoStep) {
      case 0:
        s.closeAll()
        s.setTripState("planning")
        s.setTab("home")
        break
      case 1:
        s.setTab("explore")
        s.closeAll()
        s.openOverlay({ type: "person", id: "aarav" })
        break
      case 2:
        s.closeAll()
        s.setTab("explore")
        if (!s.isSaved("place", "vashisht-courtyard")) go(() => s.toggleSave("place", "vashisht-courtyard"))
        break
      case 3:
        s.closeAll()
        s.setTab("explore")
        break
      case 4:
        s.closeAll()
        s.openOverlay({ type: "experience", id: "food-walk" })
        if (!s.isSaved("experience", "food-walk")) go(() => s.toggleSave("experience", "food-walk"))
        break
      case 5:
        s.closeAll()
        s.setTab("trips")
        s.setTripState("planning")
        break
      case 6:
        s.setTab("trips")
        s.setTripState("active")
        break
      case 7:
        s.setTab("trips")
        s.setTripState("active")
        break
      case 8:
        s.openCompanion("in-place")
        break
      case 9:
        s.closeCompanion()
        s.closeAll()
        s.openOverlay({ type: "experienceFlow", id: "food-walk", step: 0 })
        break
      case 10:
        s.closeAll()
        s.bookExperience("food-walk")
        s.openOverlay({ type: "experienceFlow", id: "food-walk", step: 2 })
        break
      case 11:
        s.closeAll()
        s.completeExperience("food-walk")
        s.openOverlay({ type: "experienceFlow", id: "food-walk", step: 3 })
        break
      case 12:
        s.closeAll()
        s.openOverlay({ type: "createArtifact" })
        break
      case 13:
        s.closeAll()
        s.setTab("trips")
        s.setTripState("completed")
        break
      case 14:
        s.closeAll()
        s.setTab("trips")
        s.openOverlay({ type: "story" })
        break
      case 15:
        // story publish happens inside story studio; keep it open
        s.setTab("trips")
        break
      case 16:
        s.closeAll()
        s.setTripState("memory")
        s.setTab("me")
        break
      case 17:
        s.setTab("me")
        break
      case 18:
        s.closeAll()
        s.setTab("home")
        s.setTripState("memory")
        break
      case 19:
        s.setTab("home")
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoStep, demoActive])

  return (
    <>
      {/* discreet launcher */}
      <AnimatePresence>
        {!demoActive && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={startDemo}
            className="fixed bottom-24 left-4 z-30 hidden items-center gap-2 rounded-full border border-border bg-card/90 py-2 pl-2.5 pr-3.5 text-[12px] font-medium shadow-md backdrop-blur lg:bottom-6 lg:left-24 lg:flex"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-copper text-copper-foreground">
              <Play className="h-3 w-3" />
            </span>
            Demo Journey
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {demoActive && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-[76px] z-30 mx-auto w-[calc(100%-1rem)] max-w-md lg:bottom-6 lg:left-24 lg:mx-0 lg:w-[380px]"
          >
            <div className="rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">
                  Demo · {demoStep + 1}/{DEMO_STEPS}
                </span>
                <button onClick={stopDemo} className="rounded-full p-1 text-muted-foreground hover:text-foreground" aria-label="Exit demo">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="font-serif text-lg leading-tight text-foreground">{STEPS[demoStep].title}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{STEPS[demoStep].caption}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-copper transition-all"
                      style={{ width: `${((demoStep + 1) / DEMO_STEPS) * 100}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={demoPrev}
                  disabled={demoStep === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border disabled:opacity-40"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={demoStep === DEMO_STEPS - 1 ? stopDemo : demoNext}
                  className={cn(
                    "flex h-8 items-center justify-center gap-1 rounded-full bg-primary px-3 text-[12px] font-semibold text-primary-foreground",
                  )}
                >
                  {demoStep === DEMO_STEPS - 1 ? "Finish" : "Next"}
                  {demoStep !== DEMO_STEPS - 1 && <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
