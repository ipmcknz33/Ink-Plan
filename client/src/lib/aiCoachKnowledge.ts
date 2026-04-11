export type CoachTier = "trial" | "pro" | "premium";

export type CoachMessageRole = "coach" | "user";

export interface CoachEntry {
  id: string;
  minTier: CoachTier;
  keywords: string[];
  response: string;
}

export interface CoachFocus {
  title: string;
  body: string;
  checklist: string[];
}

const tierRank: Record<CoachTier, number> = {
  trial: 0,
  pro: 1,
  premium: 2,
};

const MIN_RESPONSE_LENGTH = 18;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

function mapTier(value?: string | null): CoachTier {
  const normalized = normalizeText(value ?? "");

  if (
    normalized.includes("premium") ||
    normalized.includes("elite") ||
    normalized.includes("advanced")
  ) {
    return "premium";
  }

  if (
    normalized.includes("pro") ||
    normalized.includes("subscriber") ||
    normalized.includes("subscription") ||
    normalized.includes("subscribed") ||
    normalized.includes("paid")
  ) {
    return "pro";
  }

  return "trial";
}

function canAccessTier(
  currentTier: CoachTier,
  requiredTier: CoachTier,
): boolean {
  return tierRank[currentTier] >= tierRank[requiredTier];
}

function keywordScore(message: string, keywords: string[]): number {
  let score = 0;

  for (const keyword of keywords) {
    if (message.includes(normalizeText(keyword))) {
      score += keyword.length > 8 ? 3 : 2;
    }
  }

  return score;
}

function buildGeneratedEntries(): CoachEntry[] {
  const entries: CoachEntry[] = [];

  const trialTopics = [
    {
      slug: "line-control",
      keywords: [
        "line control",
        "steady lines",
        "wobbly lines",
        "clean lines",
        "line confidence",
      ],
      response:
        "Work slower than your ego wants. Use long confident pulls, lighter hand tension, and repeat simple lines until they stop wobbling. Clean line control starts with patience, not speed.",
    },
    {
      slug: "shape-design",
      keywords: [
        "shape design",
        "readable design",
        "shape language",
        "silhouette",
        "composition",
      ],
      response:
        "Think in big readable shapes first. A tattoo should still read when you squint at it. Strong silhouette before detail will save you a lot of weak drawings.",
    },
    {
      slug: "drawing-habits",
      keywords: [
        "drawing habits",
        "practice habit",
        "study routine",
        "daily drawing",
        "consistency",
      ],
      response:
        "A simple daily routine beats random long sessions. Pick one style, one design goal, and one weakness to improve. Repetition builds control faster than scattered effort.",
    },
    {
      slug: "reference-study",
      keywords: [
        "references",
        "pinterest",
        "google",
        "study references",
        "collect references",
      ],
      response:
        "Use Pinterest and Google to build reference boards by subject, flow, and style. Do not copy blindly. Study why a design reads well, then redraw it in your own way.",
    },
    {
      slug: "portfolio-prep",
      keywords: [
        "portfolio",
        "portfolio prep",
        "apprenticeship portfolio",
        "best drawings",
        "presentation",
      ],
      response:
        "Your portfolio should show clean fundamentals, not random quantity. Include readable designs, clean linework, balanced compositions, and visible growth over time.",
    },
    {
      slug: "fake-skin-basics",
      keywords: [
        "fake skin",
        "practice skin",
        "fake practice",
        "practice surface",
        "artificial skin",
      ],
      response:
        "Fake skin is for building control and consistency, not pretending you are ready for real skin. Treat it as a practice surface to test steadiness, pressure control, and design flow.",
    },
    {
      slug: "style-study",
      keywords: [
        "style study",
        "study styles",
        "learn styles",
        "fine line",
        "blackwork",
        "traditional",
        "lettering",
      ],
      response:
        "Study multiple styles early so your eye gets stronger, but practice one skill at a time. It is easier to improve when the target is clear.",
    },
    {
      slug: "creative-block",
      keywords: [
        "creative block",
        "stuck",
        "no ideas",
        "uninspired",
        "art block",
      ],
      response:
        "When you feel stuck, reduce the goal. Pick one subject, one style, and do three variations. Momentum usually returns after the first few clean reps.",
    },
    {
      slug: "design-simplifying",
      keywords: [
        "too detailed",
        "simplify design",
        "busy design",
        "cluttered",
        "overworked drawing",
      ],
      response:
        "If the drawing feels busy, simplify the biggest shape first. Remove anything that does not help the piece read clearly from a few feet away.",
    },
    {
      slug: "critique-mindset",
      keywords: [
        "critique",
        "feedback",
        "improve faster",
        "how to review",
        "self critique",
      ],
      response:
        "Ask simple questions: does it read, does it flow, are the lines clean, and does the focal point feel obvious? Honest basics matter more than fancy language.",
    },
  ];

  const proTopics = [
    {
      slug: "flow-placement",
      keywords: ["flow", "movement", "body flow", "placement", "design flow"],
      response:
        "Good flow helps a design feel intentional instead of pasted on. Study how forms wrap, where the eye enters, and how the major shapes guide attention.",
    },
    {
      slug: "contrast-balance",
      keywords: [
        "contrast",
        "balance",
        "black balance",
        "visual balance",
        "focal contrast",
      ],
      response:
        "Contrast is not just dark versus light. It is also big against small, busy against calm, and bold against delicate. Controlled contrast makes tattoos readable.",
    },
    {
      slug: "lettering-structure",
      keywords: [
        "lettering structure",
        "letter spacing",
        "script",
        "lettering",
        "kerning",
      ],
      response:
        "Lettering needs clean rhythm. Watch spacing, slant consistency, and stroke weight. If the letters do not feel related, the whole piece loses confidence.",
    },
    {
      slug: "traditional-rules",
      keywords: [
        "traditional rules",
        "american traditional",
        "bold design",
        "traditional tattoo",
      ],
      response:
        "Traditional work rewards clarity. Strong outline, readable shape, simple value structure, and designs that still hold up when viewed quickly.",
    },
    {
      slug: "blackwork-control",
      keywords: ["blackwork", "heavy black", "solid black", "black shapes"],
      response:
        "Blackwork depends on clean edges and confident shape decisions. If the silhouette is weak, more black will not fix it. Build the design before you fill it.",
    },
    {
      slug: "apprenticeship-readiness",
      keywords: [
        "apprenticeship readiness",
        "shop ready",
        "mentor ready",
        "be ready for apprenticeship",
      ],
      response:
        "Being apprenticeship-ready means showing humility, consistency, clean design habits, and respect for the craft. A strong learner is more valuable than a loud beginner.",
    },
    {
      slug: "reference-breakdown",
      keywords: [
        "break down reference",
        "analyze reference",
        "study tattoo reference",
      ],
      response:
        "Break references into silhouette, internal detail, contrast, and flow. That gives you useful information instead of shallow copying.",
    },
    {
      slug: "body-part-design",
      keywords: [
        "arm design",
        "leg design",
        "forearm",
        "thigh",
        "placement idea",
      ],
      response:
        "Design should support placement instead of fighting it. Practice adapting the same concept into long, round, and compact formats so you learn to think with the body in mind.",
    },
  ];

  const premiumTopics = [
    {
      slug: "machine-categories",
      keywords: [
        "rotary",
        "coil",
        "machine categories",
        "machine types",
        "tattoo machine",
      ],
      response:
        "At a high level, rotary and classic coil machines feel different in response and handling. That kind of knowledge should still be learned responsibly under a real mentor before real client work.",
    },
    {
      slug: "equipment-awareness",
      keywords: [
        "equipment",
        "brands",
        "tools",
        "setup awareness",
        "machine brands",
      ],
      response:
        "General equipment awareness is useful, but tools do not replace fundamentals. A cleaner eye, steadier hand, and better design judgment matter more than brand obsession.",
    },
    {
      slug: "needle-awareness",
      keywords: [
        "needle groupings",
        "needle types",
        "liners",
        "shaders",
        "needle awareness",
      ],
      response:
        "Needle groupings affect mark character and visual outcome, but this should stay conceptual until a real mentor guides hands-on practice. Respect the risk and the permanence.",
    },
    {
      slug: "shop-behavior",
      keywords: [
        "shop behavior",
        "professionalism",
        "client respect",
        "tattoo professionalism",
      ],
      response:
        "Professionalism is part of the craft. Clean communication, humility, reliability, and respect for client trust matter just as much as artistic ambition.",
    },
    {
      slug: "advanced-study",
      keywords: [
        "advanced study",
        "high level study",
        "next level",
        "deeper tattoo study",
      ],
      response:
        "Higher-level study should sharpen judgment, not inflate confidence. The goal is to become safer, calmer, and more dependable when you eventually learn under proper mentorship.",
    },
  ];

  const addEntries = (
    topics: typeof trialTopics,
    minTier: CoachTier,
    variants: string[],
  ) => {
    for (const topic of topics) {
      for (const variant of variants) {
        entries.push({
          id: `${minTier}-${topic.slug}-${normalizeText(variant).replace(/\s+/g, "-")}`,
          minTier,
          keywords: uniqueStrings([variant, ...topic.keywords]),
          response: topic.response,
        });
      }
    }
  };

  addEntries(trialTopics, "trial", [
    "beginner help",
    "where do i start",
    "how should i practice",
    "study help",
    "learn fundamentals",
    "improve drawing",
    "clean practice",
    "daily work",
    "practice plan",
    "build better habits",
  ]);

  addEntries(proTopics, "pro", [
    "deeper study",
    "better composition",
    "design improvement",
    "style growth",
    "intermediate practice",
    "visual flow",
    "placement study",
    "apprenticeship prep",
  ]);

  addEntries(premiumTopics, "premium", [
    "higher level tattoo knowledge",
    "advanced tattoo questions",
    "equipment basics",
    "machine awareness",
    "deeper professional understanding",
  ]);

  return entries;
}

const foundationalEntries: CoachEntry[] = [
  {
    id: "trial-real-skin-boundary",
    minTier: "trial",
    keywords: [
      "real skin",
      "tattoo myself",
      "tattoo on myself",
      "tattoo a friend",
      "practice on skin",
      "human skin",
      "first real tattoo",
      "tattoo someone",
      "tattooing people",
    ],
    response:
      "Do not tattoo real skin while you are still self-teaching. Infection, scarring, and permanent damage are serious. InkPlan is here to build your drawing, design judgment, and practice discipline so you are more apprenticeship-ready when a real mentor says you are ready.",
  },
  {
    id: "trial-infection-warning",
    minTier: "trial",
    keywords: [
      "infection",
      "blood",
      "cross contamination",
      "sterile",
      "unsafe",
      "damage",
      "scarring",
    ],
    response:
      "This is serious territory. Infections, scarring, and permanent mistakes are not beginner problems to gamble with. Respect the trade, protect future clients, and wait for real mentorship before touching skin.",
  },
  {
    id: "trial-intro",
    minTier: "trial",
    keywords: ["start", "new here", "beginner", "first day", "getting started"],
    response:
      "Start with fundamentals: clean line control, readable shapes, simple compositions, and consistent study habits. Build the eye before chasing advanced tattoo knowledge.",
  },
  {
    id: "trial-learn-page",
    minTier: "trial",
    keywords: [
      "learn page",
      "what should i do here",
      "guide me",
      "what now",
      "where should i focus",
    ],
    response:
      "Use Learn as your fundamentals hub. Pick one lesson, spend focused time drawing from reference, then review your work honestly. Small clean reps will help more than trying to master everything at once.",
  },
  {
    id: "trial-fine-line",
    minTier: "trial",
    keywords: ["fine line", "minimal", "delicate", "thin lines"],
    response:
      "Fine line rewards control more than speed. Keep shapes simple, lines intentional, and spacing clean. A shaky elegant design turns weak very quickly.",
  },
  {
    id: "trial-blackwork",
    minTier: "trial",
    keywords: ["blackwork", "bold black", "heavy black", "solid shapes"],
    response:
      "Blackwork starts with strong shapes. Do not hide weak drawing under heavy fill. Study silhouette, balance, and edge control first.",
  },
  {
    id: "trial-traditional-gated",
    minTier: "pro",
    keywords: ["traditional", "american traditional", "old school"],
    response:
      "Traditional study opens up more deeply in the next tier. For now, focus on readability, bold silhouette, and simple value decisions. Those fundamentals transfer well into traditional work.",
  },
  {
    id: "trial-lettering-gated",
    minTier: "pro",
    keywords: ["lettering", "script", "words", "text tattoo"],
    response:
      "Lettering guidance expands more in the next tier. Right now, focus on clean spacing, consistent slant, and drawing letters slowly enough that rhythm stays controlled.",
  },
  {
    id: "trial-pinterest",
    minTier: "trial",
    keywords: [
      "pinterest",
      "google references",
      "google",
      "where find references",
    ],
    response:
      "Pinterest and Google are useful for collecting beginner references. Build boards by style, subject, flow, and composition. Study them carefully, then redraw from understanding instead of tracing ideas blindly.",
  },
  {
    id: "trial-portfolio",
    minTier: "trial",
    keywords: [
      "portfolio",
      "portfolio prep",
      "apprenticeship portfolio",
      "show my work",
    ],
    response:
      "A beginner portfolio should look disciplined, not random. Show clean drawings, clear design choices, and visible improvement. Shops want signs that you can learn well.",
  },
  {
    id: "trial-study-routine",
    minTier: "trial",
    keywords: [
      "routine",
      "study plan",
      "what should i practice",
      "practice today",
      "daily routine",
    ],
    response:
      "Try a simple block: reference study, redraw, one focused drill, then a quick self-review. Keep the goal narrow so the session teaches you something clear.",
  },
  {
    id: "trial-tracing",
    minTier: "trial",
    keywords: ["trace", "tracing", "copy art", "copy design"],
    response:
      "Tracing can help you study structure, but it should not become your whole process. Trace to understand flow, spacing, or shape, then redraw from memory in your own way.",
  },
  {
    id: "trial-self-critique",
    minTier: "trial",
    keywords: [
      "is my design good",
      "self review",
      "critique myself",
      "judge my work",
    ],
    response:
      "Check four things first: line confidence, silhouette, spacing, and focal clarity. Clean fundamentals tell you more than chasing advanced opinions too early.",
  },
  {
    id: "pro-lettering-depth",
    minTier: "pro",
    keywords: [
      "letter spacing",
      "letter rhythm",
      "script structure",
      "better lettering",
    ],
    response:
      "Lettering needs internal rhythm. Compare height, spacing, slant, and stroke weight. If one word looks louder than the rest without intention, the composition usually feels off.",
  },
  {
    id: "pro-traditional-depth",
    minTier: "pro",
    keywords: [
      "traditional design",
      "traditional composition",
      "traditional study",
    ],
    response:
      "Traditional design benefits from bold hierarchy. Big shape first, supportive secondary detail second, and clean readability throughout. It should hit fast and stay memorable.",
  },
  {
    id: "premium-machine-awareness",
    minTier: "premium",
    keywords: [
      "rotary vs coil",
      "rotary machine",
      "coil machine",
      "machine brands",
      "tattoo equipment",
    ],
    response:
      "You can study machine categories and common equipment awareness at a high level, but do not let tool talk outrun your fundamentals. Real mentorship still matters before any skin work.",
  },
];

const generatedEntries = buildGeneratedEntries();

const allEntries = [...foundationalEntries, ...generatedEntries];

export function getTierKnowledgeCount(tierValue?: string | null): number {
  const tier = mapTier(tierValue);

  const trialCount = 100;
  const proCount = 250;
  const premiumCount = 500;

  if (tier === "premium") return premiumCount;
  if (tier === "pro") return proCount;
  return trialCount;
}

export function getCoachTier(tierValue?: string | null): CoachTier {
  return mapTier(tierValue);
}

export function getCoachSuggestions(
  tierValue?: string | null,
  pageContext?: string,
): string[] {
  const tier = mapTier(tierValue);
  const context = normalizeText(pageContext ?? "");

  const base = [
    "What should I focus on today?",
    "How do I study references better?",
    "How do I improve line confidence?",
  ];

  const learnContext = [
    "Give me a simple fundamentals routine.",
    "How do I know if a design reads well?",
    "What should go into a beginner portfolio?",
  ];

  const proExtra = [
    "How can I improve flow and composition?",
    "How should I study lettering structure?",
  ];

  const premiumExtra = [
    "What higher-level topics should I study responsibly?",
    "How should I think about machine categories conceptually?",
  ];

  let suggestions = context.includes("learn")
    ? [...learnContext, ...base]
    : [...base];

  if (tier === "pro" || tier === "premium") {
    suggestions = [...suggestions, ...proExtra];
  }

  if (tier === "premium") {
    suggestions = [...suggestions, ...premiumExtra];
  }

  return uniqueStrings(suggestions).slice(0, 5);
}

export function getAutonomousCoachFocus(
  tierValue?: string | null,
  pageContext?: string,
): CoachFocus {
  const tier = mapTier(tierValue);
  const context = normalizeText(pageContext ?? "");

  if (context.includes("learn")) {
    if (tier === "premium") {
      return {
        title: "Today’s learning focus",
        body: "Stay fundamentals-first. Use this page to sharpen your eye, make cleaner design choices, and study responsibly. Advanced knowledge should still support safety and mentorship, not ego.",
        checklist: [
          "Study one lesson with full attention",
          "Redraw one concept from reference",
          "Clean up spacing, silhouette, or rhythm",
          "Review your work honestly before moving on",
        ],
      };
    }

    if (tier === "pro") {
      return {
        title: "Today’s guided path",
        body: "Keep this session calm and intentional. Study structure first, then repeat a small drill until the result looks cleaner than your first attempt.",
        checklist: [
          "Pick one lesson, not three",
          "Do one redraw from reference",
          "Practice one focused drill",
          "Write down one weakness to improve next",
        ],
      };
    }

    return {
      title: "Start here",
      body: "Your goal is not to rush into tattooing. Build cleaner drawing habits, stronger design judgment, and the kind of discipline that makes you more apprenticeship-ready.",
      checklist: [
        "Choose one fundamentals lesson",
        "Do a simple redraw from Pinterest or Google reference",
        "Repeat one line or shape drill",
        "Keep only the cleanest work for your portfolio",
      ],
    };
  }

  return {
    title: "Current focus",
    body: "Slow down, keep the work readable, and improve one skill at a time. Clean basics will carry farther than forced complexity.",
    checklist: [
      "Pick a single design goal",
      "Study before drawing",
      "Keep the session narrow",
      "Review with honesty",
    ],
  };
}

export function getInitialCoachMessage(
  tierValue?: string | null,
  pageContext?: string,
  userName?: string | null,
): string {
  const tier = mapTier(tierValue);
  const context = normalizeText(pageContext ?? "");
  const safeName = (userName ?? "").trim();
  const useName = safeName.length > 0 ? ` ${safeName}` : "";

  if (context.includes("learn")) {
    if (tier === "premium") {
      return `Use Learn as your fundamentals base${useName}. I’ll keep the guidance practical, calm, and safety-aware. Build the eye first, then let the deeper topics support your judgment.`;
    }

    if (tier === "pro") {
      return `Use Learn as your fundamentals hub${useName}. I’ll help you stay focused, improve structure, and keep your progress grounded in solid drawing habits.`;
    }

    return `Use Learn as your fundamentals hub${useName}. Focus on line control, readable shapes, and consistent study habits. InkPlan is here to help you become more apprenticeship-ready, not replace a real apprenticeship.`;
  }

  return `Stay with clean fundamentals${useName}. I’ll keep the guidance short, useful, and within safe boundaries.`;
}

function getSafetyOverride(message: string, tier: CoachTier): string | null {
  const realSkinTriggers = [
    "real skin",
    "tattoo myself",
    "tattoo on myself",
    "tattoo my friend",
    "tattoo my buddy",
    "tattoo somebody",
    "practice on skin",
    "human skin",
    "first tattoo on someone",
    "how deep",
    "needle depth",
    "needle hang",
    "needle out",
    "voltage for skin",
    "voltage setting",
    "how to set up for tattooing",
    "sterile setup",
    "touch real skin",
  ];

  const unsafeMedicalTriggers = [
    "infection",
    "bloodborne",
    "blood",
    "contamination",
    "cross contamination",
    "scarring",
    "scar tissue",
  ];

  if (realSkinTriggers.some((trigger) => message.includes(trigger))) {
    return "I can’t help you move toward tattooing real skin on your own. Infection, scarring, and permanent damage are serious. Keep your work on drawing fundamentals, design study, and safe practice surfaces until a real mentor says you are ready.";
  }

  if (unsafeMedicalTriggers.some((trigger) => message.includes(trigger))) {
    return "That crosses into serious safety territory. Respect the risk, protect future clients, and do not experiment on skin while self-teaching. Use this stage to strengthen design judgment and disciplined study habits instead.";
  }

  if (
    tier !== "premium" &&
    [
      "rotary",
      "coil",
      "machine",
      "needle grouping",
      "cartridge",
      "brands",
    ].some((trigger) => message.includes(trigger))
  ) {
    return "That topic opens up more in higher tiers, but the safer takeaway right now is this: tools matter less than clean fundamentals. Focus on drawing, structure, and repeatable design quality first.";
  }

  return null;
}

function getTierGateFallback(message: string, tier: CoachTier): string | null {
  if (tier === "trial") {
    if (
      [
        "traditional",
        "lettering",
        "flow",
        "placement",
        "composition",
        "apprenticeship ready",
      ].some((trigger) => message.includes(trigger))
    ) {
      return "I can give you a simple version for now: keep your work readable, clean, and consistent. Study references closely, redraw with intention, and build a portfolio that shows discipline instead of rushing ahead.";
    }
  }

  if (tier !== "premium") {
    if (
      ["rotary", "coil", "machine", "equipment", "brands", "needle"].some(
        (trigger) => message.includes(trigger),
      )
    ) {
      return "I’d keep that higher-level topic conceptual for now. Your best move is still to strengthen line control, shape design, visual flow, and portfolio quality while staying within safe study boundaries.";
    }
  }

  return null;
}

function defaultResponseForTier(tier: CoachTier, pageContext?: string): string {
  const context = normalizeText(pageContext ?? "");

  if (context.includes("learn")) {
    if (tier === "premium") {
      return "For this page, stay grounded in fundamentals first. Study one lesson, redraw with intention, and ask me about the specific weakness you notice in your work.";
    }

    if (tier === "pro") {
      return "Keep this simple: choose one lesson, practice one clear skill, and review your result honestly. A focused session teaches more than bouncing between topics.";
    }

    return "Start with one fundamentals lesson, one reference redraw, and one clean drill. The goal is steady improvement, not trying to jump ahead.";
  }

  return "Keep the goal narrow and practical. Tell me what part feels weak, and I’ll help you tighten that up without pushing past safe boundaries.";
}

export function getCoachReply(params: {
  message: string;
  tier?: string | null;
  pageContext?: string;
}): string {
  const tier = mapTier(params.tier);
  const message = normalizeText(params.message);

  if (message.length < 2) {
    return defaultResponseForTier(tier, params.pageContext);
  }

  const safetyOverride = getSafetyOverride(message, tier);

  if (safetyOverride) {
    return safetyOverride;
  }

  const tierGateFallback = getTierGateFallback(message, tier);

  const availableEntries = allEntries.filter((entry) =>
    canAccessTier(tier, entry.minTier),
  );

  let bestEntry: CoachEntry | null = null;
  let bestScore = 0;

  for (const entry of availableEntries) {
    const score = keywordScore(message, entry.keywords);
    if (score > bestScore) {
      bestEntry = entry;
      bestScore = score;
    }
  }

  if (bestEntry && bestEntry.response.length >= MIN_RESPONSE_LENGTH) {
    return bestEntry.response;
  }

  if (tierGateFallback) {
    return tierGateFallback;
  }

  if (
    message.includes("what should i do today") ||
    message.includes("focus today")
  ) {
    return getAutonomousCoachFocus(tier, params.pageContext).body;
  }

  if (message.includes("reference") || message.includes("inspiration")) {
    return "Use Pinterest and Google to collect references by style, subject, and flow. Study what makes them readable, then redraw from understanding instead of copying blindly.";
  }

  if (message.includes("portfolio")) {
    return "Keep your portfolio tight. Show clean fundamentals, not every drawing you make. A few disciplined pieces say more than a pile of rushed work.";
  }

  return defaultResponseForTier(tier, params.pageContext);
}
