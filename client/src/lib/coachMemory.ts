type CoachMemory = {
  preferredStyle?: string;
  lastTopic?: string;
};

const KEY = "inkplan_coach_memory";

export function getMemory(): CoachMemory {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveMemory(memory: CoachMemory) {
  localStorage.setItem(KEY, JSON.stringify(memory));
}
