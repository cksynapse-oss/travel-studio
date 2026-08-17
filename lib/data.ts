// Travel Studio — seeded mock data model.
// All data is fictional demo content set in Manali, Himachal Pradesh.

export type Category =
  | "Old Manali"
  | "Vashisht"
  | "Hidimba area"
  | "Solang"
  | "Riverside"
  | "Cafés"
  | "Local food"
  | "Artisan"
  | "Hidden trail"
  | "Viewpoint"

export type Person = {
  id: string
  name: string
  handle: string
  avatar: string
  bio: string
  styleTags: string[]
  trips: number
  places: number
  itineraries: number
  followers: number
  connections: number
  impact: { saves: number; visits: number; answered: number }
  trust: { label: string; verifiedVisits: number; usefulRecs: number }
  verifiedLocal?: boolean
}

export type Place = {
  id: string
  name: string
  category: Category
  blurb: string
  image: string
  rating: number
  saves: number
  helpful: number
  visits: number
  // relative map position within the stylized Manali canvas (0-100)
  x: number
  y: number
  markerType: "place" | "hidden" | "lore" | "experience" | "partner"
  distanceKm: number
  openNow?: boolean
  recommendedBy?: { personId: string; when: string; quote: string }
}

export type Experience = {
  id: string
  title: string
  placeId: string
  category: Category
  image: string
  durationHrs: number
  groupSize: string
  priceInr: number
  hostId: string
  blurb: string
  spotsLeft: number
  startsAt: string
  saves: number
  completed: number
  artifacts: number
  x: number
  y: number
}

export type Lore = {
  id: string
  title: string
  placeId: string
  body: string
  sourceId: string
  sourceNote: string
  date: string
  trust: string
  x: number
  y: number
}

export type Artifact = {
  id: string
  authorId: string
  type: "Place" | "Hidden gem" | "Lore" | "Photo story" | "Route" | "Note" | "Review"
  title: string
  body: string
  image?: string
  placeId?: string
  when: string
  saves: number
  helpful: number
  downstreamVisits: number
  visibility: "Public" | "Followers" | "Connections" | "Only me"
}

export type Itinerary = {
  id: string
  authorId: string
  title: string
  days: number
  cover: string
  quote: string
  artifacts: number
  saves: number
  stops: { placeId: string; label: string }[]
  style: string
}

export type Hotel = {
  id: string
  name: string
  area: string
  image: string
  partner: boolean
  x: number
  y: number
}

export type Operator = {
  id: string
  name: string
  personId: string
  specialty: string
}

export const PEOPLE: Record<string, Person> = {
  chandan: {
    id: "chandan",
    name: "Chandan Rao",
    handle: "@chandan",
    avatar: "/people/chandan.png",
    bio: "Slow traveler. Quiet cafés, long walks, and the stories locals tell.",
    styleTags: ["Mountains", "Slow travel", "Quiet cafés", "Local food", "Photography"],
    trips: 17,
    places: 42,
    itineraries: 11,
    followers: 1284,
    connections: 38,
    impact: { saves: 347, visits: 61, answered: 24 },
    trust: { label: "Trusted traveler", verifiedVisits: 18, usefulRecs: 42 },
  },
  aarav: {
    id: "aarav",
    name: "Aarav Menon",
    handle: "@aarav",
    avatar: "/people/aarav.png",
    bio: "Roads over destinations. Currently chasing high passes.",
    styleTags: ["Road trips", "High altitude", "Photography"],
    trips: 29,
    places: 88,
    itineraries: 19,
    followers: 4210,
    connections: 64,
    impact: { saves: 1820, visits: 210, answered: 63 },
    trust: { label: "Trusted traveler", verifiedVisits: 46, usefulRecs: 121 },
  },
  priya: {
    id: "priya",
    name: "Priya Nair",
    handle: "@priya",
    avatar: "/people/priya.png",
    bio: "Finds the calm in every valley. Writes trip stories worth keeping.",
    styleTags: ["Slow travel", "Writing", "Riverside"],
    trips: 22,
    places: 57,
    itineraries: 14,
    followers: 2980,
    connections: 51,
    impact: { saves: 940, visits: 128, answered: 40 },
    trust: { label: "Trusted traveler", verifiedVisits: 33, usefulRecs: 77 },
  },
  meera: {
    id: "meera",
    name: "Meera Kapoor",
    handle: "@meera",
    avatar: "/people/meera.png",
    bio: "Collector of local lore. I talk to shopkeepers so you don't have to.",
    styleTags: ["Culture", "Lore", "Old towns"],
    trips: 15,
    places: 44,
    itineraries: 8,
    followers: 1670,
    connections: 29,
    impact: { saves: 610, visits: 74, answered: 52 },
    trust: { label: "Local knowledge", verifiedVisits: 21, usefulRecs: 66 },
  },
  rohan: {
    id: "rohan",
    name: "Rohan Bhatt",
    handle: "@rohan",
    avatar: "/people/rohan.png",
    bio: "Trails, ridgelines, and the best chai at the top.",
    styleTags: ["Hiking", "Trails", "Sunrise"],
    trips: 26,
    places: 71,
    itineraries: 12,
    followers: 2110,
    connections: 44,
    impact: { saves: 720, visits: 96, answered: 31 },
    trust: { label: "Trusted traveler", verifiedVisits: 38, usefulRecs: 59 },
  },
  tenzin: {
    id: "tenzin",
    name: "Tenzin Dorje",
    handle: "@tenzin.local",
    avatar: "/people/tenzin.png",
    bio: "Born in Old Manali. I host the food walk my grandmother taught me.",
    styleTags: ["Local host", "Food", "Storytelling"],
    trips: 3,
    places: 60,
    itineraries: 2,
    followers: 3400,
    connections: 88,
    impact: { saves: 2100, visits: 340, answered: 190 },
    trust: { label: "Verified local", verifiedVisits: 120, usefulRecs: 210 },
    verifiedLocal: true,
  },
}

export const PLACES: Place[] = [
  {
    id: "courtyard-cafe",
    name: "Old Courtyard Café",
    category: "Cafés",
    blurb: "Quiet courtyard café above Old Manali, best in the late afternoon light.",
    image: "/places/courtyard-cafe.png",
    rating: 4.7,
    saves: 24,
    helpful: 18,
    visits: 31,
    x: 38,
    y: 44,
    markerType: "place",
    distanceKm: 1.8,
    openNow: true,
    recommendedBy: {
      personId: "aarav",
      when: "3 weeks ago",
      quote: "The best time is between 4–6 PM when the courtyard catches the last light.",
    },
  },
  {
    id: "vashisht-courtyard",
    name: "Hidden courtyard above Vashisht",
    category: "Vashisht",
    blurb: "A stone courtyard tucked behind the temple lanes, almost always empty.",
    image: "/places/vashisht-courtyard.png",
    rating: 4.8,
    saves: 42,
    helpful: 18,
    visits: 7,
    x: 62,
    y: 30,
    markerType: "hidden",
    distanceKm: 3.2,
    recommendedBy: {
      personId: "aarav",
      when: "3 weeks ago",
      quote: "Go up past the hot springs and keep left. You'll hear the water before you see it.",
    },
  },
  {
    id: "hidden-trail",
    name: "Hidden trail near Vashisht",
    category: "Hidden trail",
    blurb: "A soft forest trail through deodar pines, misty until mid-morning.",
    image: "/places/hidden-trail.png",
    rating: 4.6,
    saves: 42,
    helpful: 18,
    visits: 12,
    x: 70,
    y: 22,
    markerType: "hidden",
    distanceKm: 4.1,
    recommendedBy: {
      personId: "rohan",
      when: "1 month ago",
      quote: "Start before the light gets hard. The moss is unreal after rain.",
    },
  },
  {
    id: "solang-meadow",
    name: "Solang meadow viewpoint",
    category: "Solang",
    blurb: "Wide alpine meadow with the first real view of snow.",
    image: "/places/solang-valley.png",
    rating: 4.5,
    saves: 61,
    helpful: 22,
    visits: 40,
    x: 20,
    y: 14,
    markerType: "place",
    distanceKm: 13.0,
    openNow: true,
  },
  {
    id: "hidimba-temple",
    name: "Hidimba Devi Temple",
    category: "Hidimba area",
    blurb: "Ancient wooden pagoda temple in a cedar grove. Go early to have it quiet.",
    image: "/places/hidimba-temple.png",
    rating: 4.6,
    saves: 88,
    helpful: 30,
    visits: 120,
    x: 30,
    y: 58,
    markerType: "place",
    distanceKm: 2.4,
    openNow: true,
  },
  {
    id: "beas-cafe",
    name: "Riverside deck on the Beas",
    category: "Riverside",
    blurb: "A wooden deck right over the water. Loud river, quiet mind.",
    image: "/places/beas-river.png",
    rating: 4.4,
    saves: 37,
    helpful: 14,
    visits: 52,
    x: 48,
    y: 66,
    markerType: "place",
    distanceKm: 2.0,
    openNow: true,
  },
  {
    id: "old-market",
    name: "The old market lane",
    category: "Old Manali",
    blurb: "Weathered shopfronts, textiles, and the lane everyone gets lost in.",
    image: "/places/old-manali-street.png",
    rating: 4.3,
    saves: 29,
    helpful: 11,
    visits: 90,
    x: 42,
    y: 50,
    markerType: "lore",
    distanceKm: 1.2,
    openNow: true,
  },
  {
    id: "viewpoint",
    name: "Dawn ridge viewpoint",
    category: "Viewpoint",
    blurb: "A short scramble to layered ridgelines. Best at first light.",
    image: "/places/mountain-viewpoint.png",
    rating: 4.9,
    saves: 54,
    helpful: 26,
    visits: 33,
    x: 78,
    y: 40,
    markerType: "hidden",
    distanceKm: 5.5,
  },
]

export const EXPERIENCES: Experience[] = [
  {
    id: "food-walk",
    title: "Old Manali Food Walk",
    placeId: "old-market",
    category: "Local food",
    image: "/places/food-walk.png",
    durationHrs: 2.5,
    groupSize: "Small group",
    priceInr: 1200,
    hostId: "tenzin",
    blurb: "Hosted by a Travel Studio Verified local. Six tastes, six stories, one lane.",
    spotsLeft: 6,
    startsAt: "7:00 PM",
    saves: 42,
    completed: 17,
    artifacts: 6,
    x: 43,
    y: 49,
  },
  {
    id: "sunrise-trek",
    title: "Sunrise trek to the dawn ridge",
    placeId: "viewpoint",
    category: "Hidden trail",
    image: "/places/sunrise-trek.png",
    durationHrs: 3.5,
    groupSize: "Small group",
    priceInr: 900,
    hostId: "rohan",
    blurb: "Leave in the dark, watch the valley fill with light. Chai at the top.",
    spotsLeft: 4,
    startsAt: "4:45 AM",
    saves: 61,
    completed: 22,
    artifacts: 9,
    x: 77,
    y: 39,
  },
  {
    id: "weave-workshop",
    title: "Shawl weaving with a Kullu artisan",
    placeId: "old-market",
    category: "Artisan",
    image: "/places/artisan-weaver.png",
    durationHrs: 2,
    groupSize: "Up to 4",
    priceInr: 1500,
    hostId: "meera",
    blurb: "Sit at the handloom with a third-generation weaver. Take home what you make.",
    spotsLeft: 3,
    startsAt: "11:00 AM",
    saves: 33,
    completed: 12,
    artifacts: 4,
    x: 41,
    y: 51,
  },
]

export const LORE: Lore[] = [
  {
    id: "old-market-lore",
    title: "Why this lane is called the old market",
    placeId: "old-market",
    body: "Before the road to Solang existed, this was where mule caravans from Lahaul unloaded wool and dried apricots. The lane never widened, so the shops stayed small — and that's why nothing here fits more than three people at once.",
    sourceId: "meera",
    sourceNote: "Shared by Meera after speaking with a local shopkeeper.",
    date: "2 months ago",
    trust: "Corroborated by 3 travelers",
    x: 42,
    y: 52,
  },
  {
    id: "vashisht-springs-lore",
    title: "The hot springs that never freeze",
    placeId: "vashisht-courtyard",
    body: "Locals say the sage Vashishtha meditated here and the springs have run warm ever since. Whatever the reason, they don't freeze even in January — which is why the old bath houses were built right on top of them.",
    sourceId: "tenzin",
    sourceNote: "Told by Tenzin, who grew up two lanes away.",
    date: "5 weeks ago",
    trust: "From a Verified local",
    x: 61,
    y: 31,
  },
  {
    id: "cafe-light-lore",
    title: "Why the courtyard café closes at dusk",
    placeId: "courtyard-cafe",
    body: "The owner refuses to add electric light to the courtyard. She says the whole point is the last hour of daylight, and a bulb would ruin it. So it closes when the sun leaves the wall.",
    sourceId: "aarav",
    sourceNote: "Aarav asked her directly, three weeks ago.",
    date: "3 weeks ago",
    trust: "Corroborated by 2 travelers",
    x: 39,
    y: 45,
  },
]

export const ARTIFACTS: Artifact[] = [
  {
    id: "art-courtyard",
    authorId: "aarav",
    type: "Hidden gem",
    title: "Hidden courtyard above Vashisht",
    body: "Went looking for a quiet spot and found this stone courtyard behind the temple. No sign, no menu — just tea if you ask. Best light between 4 and 6.",
    image: "/places/vashisht-courtyard.png",
    placeId: "vashisht-courtyard",
    when: "3 weeks ago",
    saves: 42,
    helpful: 18,
    downstreamVisits: 7,
    visibility: "Public",
  },
  {
    id: "art-spiti",
    authorId: "aarav",
    type: "Route",
    title: "5 days in Spiti",
    body: "The road changes the trip more than the destination. Slept in three villages, drank too much butter tea, would do it again tomorrow.",
    image: "/trips/spiti-road.png",
    when: "2 days ago",
    saves: 68,
    helpful: 24,
    downstreamVisits: 19,
    visibility: "Public",
  },
  {
    id: "art-trail",
    authorId: "rohan",
    type: "Place",
    title: "Hidden trail near Vashisht",
    body: "Soft forest floor, almost no one on it before 9 AM. Follow the water sound where the path forks.",
    image: "/places/hidden-trail.png",
    placeId: "hidden-trail",
    when: "1 month ago",
    saves: 42,
    helpful: 18,
    downstreamVisits: 7,
    visibility: "Public",
  },
  {
    id: "art-market-lore",
    authorId: "meera",
    type: "Lore",
    title: "Local lore from the old market",
    body: "A shopkeeper told me why the lane never widened. Mule caravans, wool, and dried apricots — the whole history is in how narrow the doors are.",
    image: "/places/old-manali-street.png",
    placeId: "old-market",
    when: "2 months ago",
    saves: 51,
    helpful: 33,
    downstreamVisits: 12,
    visibility: "Public",
  },
  {
    id: "art-river",
    authorId: "priya",
    type: "Photo story",
    title: "A morning by the Beas",
    body: "Sat on the deck until my chai went cold. Sometimes the whole trip is one hour you didn't plan.",
    image: "/places/beas-river.png",
    placeId: "beas-cafe",
    when: "5 days ago",
    saves: 29,
    helpful: 9,
    downstreamVisits: 4,
    visibility: "Public",
  },
]

export const ITINERARIES: Itinerary[] = [
  {
    id: "aarav-manali",
    authorId: "aarav",
    title: "Aarav's 5-day Manali trip",
    days: 5,
    cover: "/trips/manali-cover.png",
    quote: "Slow mornings, high afternoons. Built around light, not landmarks.",
    artifacts: 12,
    saves: 68,
    style: "Slow + high altitude",
    stops: [
      { placeId: "courtyard-cafe", label: "Day 1 · Old Manali cafés" },
      { placeId: "vashisht-courtyard", label: "Day 2 · Vashisht & springs" },
      { placeId: "hidden-trail", label: "Day 3 · Forest trail" },
      { placeId: "solang-meadow", label: "Day 4 · Solang meadow" },
      { placeId: "viewpoint", label: "Day 5 · Dawn ridge" },
    ],
  },
  {
    id: "priya-slow",
    authorId: "priya",
    title: "Priya's slow riverside days",
    days: 3,
    cover: "/places/beas-river.png",
    quote: "For when you want the valley to slow you down.",
    artifacts: 7,
    saves: 41,
    style: "Slow travel",
    stops: [
      { placeId: "beas-cafe", label: "Day 1 · Riverside" },
      { placeId: "hidimba-temple", label: "Day 2 · Hidimba grove" },
      { placeId: "courtyard-cafe", label: "Day 3 · Café light" },
    ],
  },
]

export const HOTELS: Hotel[] = [
  {
    id: "pine-view",
    name: "Pine View Manali",
    area: "Old Manali",
    image: "/places/pine-view-hotel.png",
    partner: true,
    x: 36,
    y: 40,
  },
]

export const OPERATORS: Operator[] = [
  { id: "op-tenzin", name: "Tenzin's Kitchen Walks", personId: "tenzin", specialty: "Food & stories" },
  { id: "op-rohan", name: "Ridge & River Treks", personId: "rohan", specialty: "Sunrise treks" },
  { id: "op-meera", name: "Kullu Craft Circle", personId: "meera", specialty: "Artisan workshops" },
  { id: "op-guides", name: "Old Manali Guides Collective", personId: "tenzin", specialty: "Walking tours" },
]

export function person(id: string): Person {
  return PEOPLE[id] ?? PEOPLE.chandan
}
export function place(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id)
}
export function experience(id: string): Experience | undefined {
  return EXPERIENCES.find((e) => e.id === id)
}

export const TRIP_STORY = {
  title: "Four days in Manali, seen slowly.",
  photos: 184,
  videos: 17,
  places: 12,
  experiences: 3,
  people: 4,
  notes: 9,
  timeline: [
    { id: "arrival", label: "Arrival", image: "/trips/manali-cover.png", note: "Came in as the light was leaving the valley." },
    { id: "old-manali", label: "Old Manali", image: "/places/old-manali-street.png", note: "Got lost in the market lane on purpose." },
    { id: "vashisht", label: "Vashisht", image: "/places/vashisht-courtyard.png", note: "The courtyard was empty. Stayed an hour." },
    { id: "food-walk", label: "Food walk", image: "/places/food-walk.png", note: "Six tastes, and Tenzin's grandmother's story." },
    { id: "trail", label: "Hidden trail", image: "/places/hidden-trail.png", note: "Rain the night before made the moss glow." },
    { id: "final", label: "Final morning", image: "/trips/memory-rain.png", note: "Watched it rain over the rooftops with cold chai." },
  ],
  gallery: [
    "/trips/gallery-1.png",
    "/trips/gallery-2.png",
    "/places/beas-river.png",
    "/places/mountain-viewpoint.png",
    "/places/hidden-trail.png",
    "/places/courtyard-cafe.png",
  ],
}
