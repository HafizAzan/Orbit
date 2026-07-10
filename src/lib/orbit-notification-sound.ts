const SOUND_PREF_KEY = "orbit.notification-sound";
const SOUND_VOLUME = 0.22;

let audioContext: AudioContext | null = null;
let unlocked = false;
let lastPlayedAt = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const Ctx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!Ctx) return null;

  if (!audioContext) {
    audioContext = new Ctx();
  }

  return audioContext;
}

/** Call once after a user gesture so browsers allow later notification audio. */
export function unlockOrbitNotificationSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  void ctx.resume().then(() => {
    unlocked = true;
  });
}

export function isOrbitNotificationSoundEnabled() {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(SOUND_PREF_KEY);
  if (stored === "off") return false;
  return true;
}

export function setOrbitNotificationSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SOUND_PREF_KEY, enabled ? "on" : "off");
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/**
 * Short branded motif for Orbit:
 * F4 → A4 → C5 (flow) + soft high sparkle (sync).
 * Distinct from generic WhatsApp / Slack / OS pings.
 */
export function playOrbitNotificationSound(options?: { force?: boolean }) {
  if (!options?.force && !isOrbitNotificationSoundEnabled()) return;
  if (typeof document !== "undefined" && document.visibilityState === "hidden") {
    // Still play when tab is backgrounded if browser allows — skip only if muted preference.
  }

  const now = Date.now();
  if (now - lastPlayedAt < 700) return;
  lastPlayedAt = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  const run = () => {
    const t0 = ctx.currentTime + 0.01;
    // Orbit signature: F – A – C rising, then bright sync tip.
    tone(ctx, 349.23, t0, 0.14, SOUND_VOLUME * 0.85, "triangle"); // F4
    tone(ctx, 440.0, t0 + 0.11, 0.14, SOUND_VOLUME * 0.9, "triangle"); // A4
    tone(ctx, 523.25, t0 + 0.22, 0.18, SOUND_VOLUME, "sine"); // C5
    tone(ctx, 1046.5, t0 + 0.34, 0.12, SOUND_VOLUME * 0.45, "sine"); // C6 sparkle
  };

  if (ctx.state === "suspended") {
    void ctx.resume().then(() => {
      unlocked = true;
      run();
    });
    return;
  }

  unlocked = true;
  run();
}

export function getOrbitNotificationSoundUnlocked() {
  return unlocked;
}
