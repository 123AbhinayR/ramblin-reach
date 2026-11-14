import type { GoalIntent } from "@/lib/domain/schemas";

export type GoalExample = {
  id: string;
  title: string;
  summary: string;
  intent: GoalIntent;
  goalText: string;
  targetCompany: string | null;
  targetMetro: string | null;
};

export const GOAL_EXAMPLES: GoalExample[] = [
  {
    id: "sensor",
    title: "Build an environmental sensor",
    summary: "Electronics prototype using official makerspace pages.",
    intent: "project",
    goalText: "I want to build a low-cost environmental sensor, but I need electronics tools and project advice.",
    targetCompany: null,
    targetMetro: null,
  },
  {
    id: "software",
    title: "Start a software or AI project",
    summary: "Ship a campus tool and ask Jackets who have built similar work.",
    intent: "project",
    goalText: "I want to develop a software and AI project for campus use and find Georgia Tech resources and students who have shipped similar apps.",
    targetCompany: null,
    targetMetro: null,
  },
  {
    id: "internship",
    title: "Prepare for a software internship",
    summary: "Career Center guidance, then alumni who offer career conversations.",
    intent: "career",
    goalText: "I am preparing for a software engineering internship and want to connect with Georgia Tech alumni who can share how they approached interviews and first-year work.",
    targetCompany: null,
    targetMetro: null,
  },
  {
    id: "startup",
    title: "Launch a startup",
    summary: "Scope a first prototype and review CREATE-X application guidance.",
    intent: "project",
    goalText: "I want to launch a startup and build a first prototype. I need to understand CREATE-X application requirements and get project feedback.",
    targetCompany: null,
    targetMetro: null,
  },
  {
    id: "city",
    title: "Move to a new city",
    summary: "Seattle internship move with Regional Networks as a starting point.",
    intent: "relocation",
    goalText: "I am moving to Seattle for an internship and want practical advice on neighborhoods, transit, and getting settled from Jackets who live there.",
    targetCompany: null,
    targetMetro: "Seattle, WA",
  },
  {
    id: "research",
    title: "Find research mentorship",
    summary: "Define a research question and prepare a focused request for technical guidance.",
    intent: "project",
    goalText: "I want to explore research opportunities and find technical mentorship for an interdisciplinary research question.",
    targetCompany: null,
    targetMetro: null,
  },
];

export function exampleById(id: string | null | undefined): GoalExample | undefined {
  if (!id) return undefined;
  return GOAL_EXAMPLES.find(example => example.id === id);
}
