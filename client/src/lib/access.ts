export type AccessPhase = "trial" | "subscribed" | "expired";

export type StyleAccess = {
  trial: string[];
  subscribed: string[];
  lockedPreview: string[];
};

export const STYLE_ACCESS: StyleAccess = {
  trial: ["fine-line", "blackwork"],
  subscribed: ["fine-line", "blackwork", "traditional", "lettering"],
  lockedPreview: [
    "black-grey",
    "japanese",
    "chicano",
    "japanese-realism",
    "geometric",
    "biomechanical",
    "polynesian",
    "color-realism",
    "surrealism",
    "watercolor",
  ],
};

export const TRIAL_STORAGE_KEY = "inkplan_trial_started_at";
export const SUBSCRIPTION_STORAGE_KEY = "inkplan_is_subscribed";
export const TRIAL_LENGTH_MS = 3 * 24 * 60 * 60 * 1000;

function safeReadLocalStorage(key: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteLocalStorage(key: string, value: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore storage failures
  }
}

function safeRemoveLocalStorage(key: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore storage failures
  }
}

export function getTrialStartedAt(): number | null {
  const raw = safeReadLocalStorage(TRIAL_STORAGE_KEY);
  if (!raw) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ensureTrialStarted(): number | null {
  const existing = getTrialStartedAt();
  if (existing) return existing;

  const now = Date.now();
  safeWriteLocalStorage(TRIAL_STORAGE_KEY, String(now));
  return now;
}

export function setSubscribed(value: boolean) {
  safeWriteLocalStorage(SUBSCRIPTION_STORAGE_KEY, value ? "true" : "false");
}

export function clearSubscription() {
  safeRemoveLocalStorage(SUBSCRIPTION_STORAGE_KEY);
}

export function resetTrial() {
  safeRemoveLocalStorage(TRIAL_STORAGE_KEY);
}

export function resetAccessState() {
  clearSubscription();
  resetTrial();
}

export function getIsSubscribed(): boolean {
  const raw = safeReadLocalStorage(SUBSCRIPTION_STORAGE_KEY);
  if (!raw) return false;

  return raw.trim().toLowerCase() === "true";
}

export function getTrialExpiresAt(): number | null {
  const startedAt = getTrialStartedAt();
  if (!startedAt) return null;

  return startedAt + TRIAL_LENGTH_MS;
}

export function hasTrialExpired(): boolean {
  const expiresAt = getTrialExpiresAt();
  if (!expiresAt) return false;

  return Date.now() >= expiresAt;
}

export function getAccessPhase(): AccessPhase {
  if (getIsSubscribed()) return "subscribed";

  const startedAt = getTrialStartedAt();
  if (!startedAt) return "trial";

  return hasTrialExpired() ? "expired" : "trial";
}

export function getTrialTimeLeftMs(): number {
  const startedAt = getTrialStartedAt();
  if (!startedAt) return TRIAL_LENGTH_MS;

  const expiresAt = startedAt + TRIAL_LENGTH_MS;
  return Math.max(0, expiresAt - Date.now());
}

export function getTrialDaysLeftLabel(): string {
  const ms = getTrialTimeLeftMs();

  if (ms <= 0) return "Trial ended";

  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));

  if (days <= 1) return "Less than 1 day left";
  return `${days} days left`;
}

export function getAccessibleStyleIds(phase: AccessPhase): string[] {
  if (phase === "subscribed") return STYLE_ACCESS.subscribed;
  if (phase === "trial") return STYLE_ACCESS.trial;
  return [];
}

export function canAccessStyle(styleId: string, phase: AccessPhase): boolean {
  return getAccessibleStyleIds(phase).includes(styleId);
}

export function isLockedPreviewStyle(styleId: string): boolean {
  return STYLE_ACCESS.lockedPreview.includes(styleId);
}

export function getVisibleDashboardStyleIds(phase: AccessPhase): string[] {
  if (phase === "subscribed") {
    return ["fine-line", "blackwork", "traditional", "lettering"];
  }

  if (phase === "trial") {
    return ["fine-line", "blackwork"];
  }

  return [];
}

export function getLockedPreviewStyleIds(): string[] {
  return STYLE_ACCESS.lockedPreview;
}

export function shouldShowUpgrade(phase: AccessPhase): boolean {
  return phase === "trial" || phase === "expired";
}

export function isTrialPhase(phase: AccessPhase): boolean {
  return phase === "trial";
}

export function isSubscribedPhase(phase: AccessPhase): boolean {
  return phase === "subscribed";
}

export function isExpiredPhase(phase: AccessPhase): boolean {
  return phase === "expired";
}
