"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { ARTIFACTS, type Artifact } from "@/lib/data"

export type Tab = "home" | "explore" | "trips" | "inbox" | "me"
export type TripState = "planning" | "active" | "completed" | "memory"
export type Persona = "traveler" | "guide"
export type CompanionMode = "planning" | "in-place" | "reflecting"

export type Overlay =
  | { type: "place"; id: string }
  | { type: "experience"; id: string }
  | { type: "lore"; id: string }
  | { type: "person"; id: string }
  | { type: "experienceFlow"; id: string; step: number }
  | { type: "story" }
  | { type: "createArtifact" }
  | { type: "hotel" }
  | { type: "guide" }
  | { type: "conversation"; id: string }

export type Toast = { id: number; text: string; tone?: "default" | "success" }

type StoreValue = {
  // shell
  theme: "light" | "dark"
  toggleTheme: () => void
  tab: Tab
  setTab: (t: Tab) => void
  persona: Persona
  setPersona: (p: Persona) => void

  // overlays (stack so back works)
  overlays: Overlay[]
  openOverlay: (o: Overlay) => void
  closeOverlay: () => void
  closeAll: () => void

  // trip lifecycle
  tripState: TripState
  setTripState: (s: TripState) => void

  // intent signals
  savedPlaces: string[]
  savedExperiences: string[]
  savedLore: string[]
  savedArtifacts: string[]
  toggleSave: (kind: "place" | "experience" | "lore" | "artifact", id: string) => void
  isSaved: (kind: "place" | "experience" | "lore" | "artifact", id: string) => boolean

  // social
  following: string[]
  connections: string[]
  connectionRequests: string[]
  toggleFollow: (id: string) => void
  requestConnection: (id: string) => void
  acceptConnection: (id: string) => void

  // experiences
  booked: string[]
  completedExp: string[]
  bookExperience: (id: string) => void
  completeExperience: (id: string) => void

  // artifacts (user created + seeded)
  artifacts: Artifact[]
  addArtifact: (a: Omit<Artifact, "id" | "saves" | "helpful" | "downstreamVisits">) => void

  // companion
  companionOpen: boolean
  companionMode: CompanionMode
  setCompanionMode: (m: CompanionMode) => void
  openCompanion: (m?: CompanionMode) => void
  closeCompanion: () => void

  // toasts
  toasts: Toast[]
  toast: (text: string, tone?: "default" | "success") => void

  // demo journey
  demoActive: boolean
  demoStep: number
  startDemo: () => void
  stopDemo: () => void
  demoNext: () => void
  demoPrev: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [tab, setTabState] = useState<Tab>("home")
  const [persona, setPersona] = useState<Persona>("traveler")
  const [overlays, setOverlays] = useState<Overlay[]>([])
  const [tripState, setTripStateRaw] = useState<TripState>("planning")

  const [savedPlaces, setSavedPlaces] = useState<string[]>(["courtyard-cafe", "hidimba-temple", "beas-cafe"])
  const [savedExperiences, setSavedExperiences] = useState<string[]>(["food-walk"])
  const [savedLore, setSavedLore] = useState<string[]>([])
  const [savedArtifacts, setSavedArtifacts] = useState<string[]>([])

  const [following, setFollowing] = useState<string[]>(["priya"])
  const [connections, setConnections] = useState<string[]>([])
  const [connectionRequests, setConnectionRequests] = useState<string[]>([])

  const [booked, setBooked] = useState<string[]>([])
  const [completedExp, setCompletedExp] = useState<string[]>([])
  const [artifacts, setArtifacts] = useState<Artifact[]>(ARTIFACTS)

  const [companionOpen, setCompanionOpen] = useState(false)
  const [companionMode, setCompanionMode] = useState<CompanionMode>("planning")

  const [toasts, setToasts] = useState<Toast[]>([])
  const [demoActive, setDemoActive] = useState(false)
  const [demoStep, setDemoStep] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), [])

  const toast = useCallback((text: string, tone: "default" | "success" = "default") => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, text, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const setTab = useCallback((t: Tab) => {
    setOverlays([])
    setTabState(t)
  }, [])

  const openOverlay = useCallback((o: Overlay) => setOverlays((s) => [...s, o]), [])
  const closeOverlay = useCallback(() => setOverlays((s) => s.slice(0, -1)), [])
  const closeAll = useCallback(() => setOverlays([]), [])

  const setTripState = useCallback(
    (s: TripState) => {
      setTripStateRaw(s)
    },
    [],
  )

  const savedSetters = {
    place: [savedPlaces, setSavedPlaces] as const,
    experience: [savedExperiences, setSavedExperiences] as const,
    lore: [savedLore, setSavedLore] as const,
    artifact: [savedArtifacts, setSavedArtifacts] as const,
  }

  const isSaved = useCallback(
    (kind: "place" | "experience" | "lore" | "artifact", id: string) => {
      const map = { place: savedPlaces, experience: savedExperiences, lore: savedLore, artifact: savedArtifacts }
      return map[kind].includes(id)
    },
    [savedPlaces, savedExperiences, savedLore, savedArtifacts],
  )

  const toggleSave = useCallback(
    (kind: "place" | "experience" | "lore" | "artifact", id: string) => {
      const [, setter] = savedSetters[kind]
      setter((list) => {
        if (list.includes(id)) {
          toast("Removed from Manali")
          return list.filter((x) => x !== id)
        }
        toast("Saved to Manali", "success")
        return [...list, id]
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toast],
  )

  const toggleFollow = useCallback(
    (id: string) => {
      setFollowing((list) => {
        if (list.includes(id)) return list.filter((x) => x !== id)
        toast("Following", "success")
        return [...list, id]
      })
    },
    [toast],
  )

  const requestConnection = useCallback(
    (id: string) => {
      setConnectionRequests((list) => (list.includes(id) ? list : [...list, id]))
      toast("Connection requested", "success")
    },
    [toast],
  )

  const acceptConnection = useCallback(
    (id: string) => {
      setConnectionRequests((list) => list.filter((x) => x !== id))
      setConnections((list) => (list.includes(id) ? list : [...list, id]))
      toast("You're connected", "success")
    },
    [toast],
  )

  const bookExperience = useCallback(
    (id: string) => {
      setBooked((list) => (list.includes(id) ? list : [...list, id]))
      toast("Experience booked", "success")
    },
    [toast],
  )

  const completeExperience = useCallback((id: string) => {
    setCompletedExp((list) => (list.includes(id) ? list : [...list, id]))
  }, [])

  const addArtifact = useCallback(
    (a: Omit<Artifact, "id" | "saves" | "helpful" | "downstreamVisits">) => {
      const full: Artifact = { ...a, id: `art-${Date.now()}`, saves: 0, helpful: 0, downstreamVisits: 0 }
      setArtifacts((list) => [full, ...list])
      toast("Artifact shared", "success")
    },
    [toast],
  )

  const openCompanion = useCallback((m?: CompanionMode) => {
    if (m) setCompanionMode(m)
    setCompanionOpen(true)
  }, [])
  const closeCompanion = useCallback(() => setCompanionOpen(false), [])

  const startDemo = useCallback(() => {
    setDemoActive(true)
    setDemoStep(0)
  }, [])
  const stopDemo = useCallback(() => setDemoActive(false), [])
  const demoNext = useCallback(() => setDemoStep((s) => Math.min(s + 1, DEMO_STEPS - 1)), [])
  const demoPrev = useCallback(() => setDemoStep((s) => Math.max(s - 1, 0)), [])

  const value: StoreValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      tab,
      setTab,
      persona,
      setPersona,
      overlays,
      openOverlay,
      closeOverlay,
      closeAll,
      tripState,
      setTripState,
      savedPlaces,
      savedExperiences,
      savedLore,
      savedArtifacts,
      toggleSave,
      isSaved,
      following,
      connections,
      connectionRequests,
      toggleFollow,
      requestConnection,
      acceptConnection,
      booked,
      completedExp,
      bookExperience,
      completeExperience,
      artifacts,
      addArtifact,
      companionOpen,
      companionMode,
      setCompanionMode,
      openCompanion,
      closeCompanion,
      toasts,
      toast,
      demoActive,
      demoStep,
      startDemo,
      stopDemo,
      demoNext,
      demoPrev,
    }),
    [
      theme, toggleTheme, tab, setTab, persona, overlays, openOverlay, closeOverlay, closeAll,
      tripState, setTripState, savedPlaces, savedExperiences, savedLore, savedArtifacts, toggleSave,
      isSaved, following, connections, connectionRequests, toggleFollow, requestConnection,
      acceptConnection, booked, completedExp, bookExperience, completeExperience, artifacts,
      addArtifact, companionOpen, companionMode, openCompanion, closeCompanion, toasts, toast,
      demoActive, demoStep, startDemo, stopDemo, demoNext, demoPrev,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const DEMO_STEPS = 20

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
