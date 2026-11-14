import { z } from "zod";

export const INTENTS = ["project", "career", "relocation"] as const;
export const AFFILIATIONS = ["student", "alumni"] as const;
export const VERIFICATION_STATES = ["pending", "verified", "demo"] as const;
export const HELP_TOPICS = ["project_guidance", "resource_navigation", "career_advice", "company_insight", "relocation_advice"] as const;
export const FORMATS = ["chat_15min", "written_advice", "project_feedback"] as const;
export const REQUEST_STATUSES = ["pending", "accepted", "declined", "cancelled", "completed"] as const;
export const OUTCOME_TYPES = ["resource_accessed", "technical_advice", "company_insight", "relocation_advice", "next_step_planned", "other"] as const;
export const STEP_STATUSES = ["not_started", "done"] as const;
export const REVIEW_STATUSES = ["reviewed", "needs_review"] as const;
export const GOAL_TAGS = ["electronics", "sensor", "fabrication", "entrepreneurship", "software", "research", "career", "networking", "relocation"] as const;
export const SUGGESTED_METROS = [
  "Atlanta, GA", "Seattle, WA", "Austin, TX", "New York, NY", "San Francisco Bay Area, CA", "Boston, MA",
  "Chicago, IL", "Los Angeles, CA", "Denver, CO", "Washington, DC", "Dallas, TX", "Houston, TX",
  "Miami, FL", "Philadelphia, PA", "San Diego, CA", "Portland, OR", "Nashville, TN", "Charlotte, NC",
  "Raleigh-Durham, NC", "Minneapolis, MN", "Detroit, MI", "Phoenix, AZ", "Salt Lake City, UT",
  "Pittsburgh, PA", "Savannah, GA", "London, UK", "Toronto, Canada", "Vancouver, Canada",
  "Berlin, Germany", "Singapore", "Tokyo, Japan", "Sydney, Australia", "Dublin, Ireland",
  "Bengaluru, India", "Hyderabad, India", "Remote / distributed",
] as const;
/** @deprecated Use SUGGESTED_METROS; kept for fixtures that expect the original six labels. */
export const METROS = SUGGESTED_METROS;
export const intentSchema = z.enum(INTENTS);
export type GoalIntent = z.infer<typeof intentSchema>;
export type HelpTopic = typeof HELP_TOPICS[number];
export type RequestStatus = typeof REQUEST_STATUSES[number];
export type GoalTag = typeof GOAL_TAGS[number];

const STREETISH = /\b(street|st\.|avenue|ave\.|road|rd\.|blvd|boulevard|apt|apartment|suite|unit|address|home)\b/i;

export function normalizeText(value: string): string {
  return value.normalize("NFKC").replace(/[\u0000-\u0008\u000b-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").trim();
}

const LOCATION_ALIASES: Record<string, string> = {
  atlanta: "Atlanta, GA",
  seattle: "Seattle, WA",
  austin: "Austin, TX",
  nyc: "New York, NY",
  "new york": "New York, NY",
  "new york city": "New York, NY",
  "san francisco": "San Francisco Bay Area, CA",
  sf: "San Francisco Bay Area, CA",
  "bay area": "San Francisco Bay Area, CA",
  boston: "Boston, MA",
  chicago: "Chicago, IL",
  "los angeles": "Los Angeles, CA",
  la: "Los Angeles, CA",
  denver: "Denver, CO",
  "washington dc": "Washington, DC",
  "washington, dc": "Washington, DC",
  dc: "Washington, DC",
  dallas: "Dallas, TX",
  houston: "Houston, TX",
  miami: "Miami, FL",
  philadelphia: "Philadelphia, PA",
  "san diego": "San Diego, CA",
  portland: "Portland, OR",
  nashville: "Nashville, TN",
  charlotte: "Charlotte, NC",
  raleigh: "Raleigh-Durham, NC",
  durham: "Raleigh-Durham, NC",
  "raleigh-durham": "Raleigh-Durham, NC",
  minneapolis: "Minneapolis, MN",
  detroit: "Detroit, MI",
  phoenix: "Phoenix, AZ",
  "salt lake city": "Salt Lake City, UT",
  pittsburgh: "Pittsburgh, PA",
  savannah: "Savannah, GA",
  london: "London, UK",
  toronto: "Toronto, Canada",
  vancouver: "Vancouver, Canada",
  berlin: "Berlin, Germany",
  singapore: "Singapore",
  tokyo: "Tokyo, Japan",
  sydney: "Sydney, Australia",
  dublin: "Dublin, Ireland",
  bengaluru: "Bengaluru, India",
  bangalore: "Bengaluru, India",
  hyderabad: "Hyderabad, India",
  remote: "Remote / distributed",
};

export function canonicalLocation(value: string): string {
  return normalizeText(value).replace(/\s+/g, " ").toLowerCase();
}

export function normalizeLocation(value: string): string {
  const cleaned = normalizeText(value).replace(/\s+/g, " ");
  if (!cleaned) return "";
  const key = cleaned.toLowerCase();
  const suggested = SUGGESTED_METROS.find(metro => metro.toLowerCase() === key);
  if (suggested) return suggested;
  if (LOCATION_ALIASES[key]) return LOCATION_ALIASES[key];

  return cleaned;
}

export function inferMetroFromText(text: string): string | null {
  const lower = text.toLowerCase();
  if (/\b(san francisco|bay area)\b/.test(lower)) return "San Francisco Bay Area, CA";
  if (/\bnew york\b/.test(lower)) return "New York, NY";
  const match = SUGGESTED_METROS.find(metro => {
    const city = metro.split(",")[0].toLowerCase();
    if (city.includes("/") || city.length < 5) return false;
    return lower.includes(city);
  });
  return match ?? null;
}

export function locationLooksSafe(value: string): boolean {
  if (!value) return true;
  const chars = [...value];
  if (chars.length < 2 || chars.length > 80) return false;
  if (/https?:\/\//i.test(value) || value.includes("@") || /\d{3,}/.test(value) || STREETISH.test(value)) return false;
  return true;
}

export const locationSchema = z.string().transform(normalizeLocation).pipe(
  z.string().refine(locationLooksSafe, "Enter a city or metro area, not a street address or link."),
);

export function optionalLocation(value: string | null | undefined): string | null {
  if (value == null) return null;
  const parsed = locationSchema.safeParse(value);
  if (!parsed.success) return null;
  return parsed.data || null;
}

export function textField(min: number, max: number) {
  return z.string().transform(normalizeText).pipe(z.string().refine(v => [...v].length >= min && [...v].length <= max, `Use ${min}–${max} characters.`));
}
export const goalInputSchema = z.strictObject({
  goalText: textField(10, 500), intent: intentSchema.optional(),
  targetCompany: textField(0, 100).nullable().optional(),
  targetMetro: locationSchema.nullable().optional(),
});
export const labels = {
  project_guidance: "Project mentorship", resource_navigation: "Campus resources", career_advice: "Career conversations",
  company_insight: "Company insights", relocation_advice: "Relocation advice",
  chat_15min: "15-minute chat", written_advice: "Written advice", project_feedback: "Project feedback",
  resource_accessed: "Learned how to use a resource", technical_advice: "Received technical advice",
  next_step_planned: "Next step planned", other: "Something else",
} as const;
export const helpTopicHints = {
  project_guidance: "Prototype reviews, technical unblocking, and project scoping.",
  resource_navigation: "Which campus offices, labs, or programs to check — not access guarantees.",
  career_advice: "Career chats, resume feedback, and interview preparation. Not a job pipeline.",
  company_insight: "What the work is like. Employer info is self-reported; this is not a referral.",
  relocation_advice: "Settling in a city from someone who has lived there.",
} as const;
