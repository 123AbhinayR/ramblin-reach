import { goalInputSchema, inferMetroFromText, type GoalTag } from "@/lib/domain/schemas";
import { z } from "zod";

export function parseGoal(input: z.infer<typeof goalInputSchema>) {
  const goal = goalInputSchema.parse(input);
  const text = goal.goalText.toLowerCase();
  const inferred = /\b(move|moving|relocat\w*)\b/.test(text) ? "relocation" : /\b(career|network|engineers at|internship|company)\b/.test(text) ? "career" : "project";
  const intent = goal.intent ?? inferred;
  const rules: [GoalTag, RegExp][] = [
    ["sensor", /\b(sensor|sensors)\b/], ["electronics", /\b(electronic\w*|circuit\w*|sensor\w*|arduino)\b/],
    ["fabrication", /\b(enclosure|fabricat\w*|3d print\w*|prototype)\b/],
    ["entrepreneurship", /\b(startup|funding|entrepreneur\w*|business)\b/],
    ["software", /\b(code|coding|software|app|website|ai|ml|machine learning)\b/], ["research", /\bresearch\b/],
  ];
  const tags: GoalTag[] = rules.filter(([, pattern]) => pattern.test(text)).map(([tag]) => tag);
  if (intent === "career") tags.push("career", "networking");
  if (intent === "relocation") tags.push("relocation", "networking");
  const metro = inferMetroFromText(text);
  const company = text.match(/\bat\s+(microsoft|stripe|delta)\b/)?.[1] ?? null;
  return { intent, tags, targetCompany: goal.targetCompany ?? company, targetMetro: goal.targetMetro ?? metro ?? null, confidence: goal.intent ? "manual" as const : "deterministic" as const };
}
