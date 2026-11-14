export interface CoachingFeedback {
  hints: string[];
  warnings: string[];
  isReady: boolean;
}

export function evaluateReachReady(params: {
  goalContext: string;
  specificQuestion: string;
  priorEffort?: string | null;
}): CoachingFeedback {
  const hints: string[] = [];
  const warnings: string[] = [];

  const goal = (params.goalContext || "").trim();
  const question = (params.specificQuestion || "").trim();
  const effort = (params.priorEffort || "").trim();
  const combinedLower = `${goal} ${question} ${effort}`.toLowerCase();

  // C05: "pick your brain"
  if (combinedLower.includes("pick your brain")) {
    warnings.push("Avoid 'pick your brain' — ask a specific question so the helper knows exactly how they can help.");
  }

  // C06: "referral"
  if (combinedLower.includes("referral") || combinedLower.includes("refer me")) {
    warnings.push("Alumni share experience and advice, but cannot guarantee job referrals. Keep your question focused on their work or path.");
  }

  // Length and clarity hints
  if (goal.length > 0 && goal.length < 30) {
    hints.push("Add a little more context about your goal — what are you trying to build or achieve?");
  }
  if (question.length > 0 && question.length < 40) {
    hints.push("Make your question more specific: what exact blocker or decision are you facing?");
  }
  if (!effort) {
    hints.push("Mention what you've already tried or researched — helpers appreciate knowing where you started.");
  }
  if (question.length > 0 && !question.includes("?")) {
    hints.push("Phrase your question as a question ending with a question mark (?).");
  }

  const isReady =
    goal.length >= 10 &&
    question.length >= 20 &&
    hints.length === 0 &&
    warnings.length === 0;

  return { hints, warnings, isReady };
}
