// Lightweight FOMO engine with fake data provider (session-scoped)
// - Timezone-aware countdowns (IST)
// - Deterministic per-item values via string seed
// - Guardrails: hide when not meaningful

export type CatalogFomo = {
  finalRunDate?: Date; // When the catalog retires
  lowStockSets?: number; // 0-5 sets in fast dispatch bucket
  recentInterest?: number; // last 24-72h interest (adds/inquiries)
  queueSize?: number; // for back-order/in production
  citySlots?: { city: string; taken: number; total: number };
  concurrentViewers?: number; // live viewers on page
};

export type DispatchCutoff = {
  label: string; // e.g. "this week’s dispatch"
  nextCutoffIST: Date; // IST time for next cutoff
};

// Helpers
const IST_OFFSET_MINUTES = 5.5 * 60; // UTC+5:30

export function nowIST(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const istMs = utcMs + IST_OFFSET_MINUTES * 60_000;
  return new Date(istMs);
}

export function toISTDate(y: number, mZeroBased: number, d: number, hh = 0, mm = 0, ss = 0): Date {
  // Build an IST-based epoch by starting at UTC epoch and adding IST offset
  const utcFromIST = Date.UTC(y, mZeroBased, d, hh - 5, mm - 30, ss);
  return new Date(utcFromIST);
}

export function formatIST(date: Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(date);
}

export function getNextWeeklyCutoff(hour = 18, minute = 0, weekdayFri = 5): DispatchCutoff {
  // Weekday: 0=Sun ... 6=Sat; we want Friday by default
  const now = nowIST();
  const target = new Date(now.getTime());
  // Move to this week's target weekday
  const deltaDays = (weekdayFri + 7 - now.getDay()) % 7;
  target.setDate(now.getDate() + deltaDays);
  target.setHours(hour, minute, 0, 0);
  if (target <= now) {
    // already passed for this week → move to next week
    target.setDate(target.getDate() + 7);
  }
  // Convert back to a real Date (ms represents IST moment already)
  const nextCutoffIST = target;
  return { label: "this week’s dispatch", nextCutoffIST };
}

export type Countdown = { days: number; hours: number; minutes: number; seconds: number; totalMs: number };

export function getCountdown(toIST: Date): Countdown {
  const now = nowIST().getTime();
  const end = toIST.getTime();
  const diff = Math.max(0, end - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, totalMs: diff };
}

// Deterministic pseudo-random from string (xmur3 + sfc32)
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function rngFor(key: string) {
  const seed = xmur3(key);
  return sfc32(seed(), seed(), seed(), seed());
}

export function fakeCatalogFomo(key: string): CatalogFomo {
  const rand = rngFor(key + "::fomo");
  // Low stock between 0..6; hide if >5
  const lowStockRaw = Math.floor(rand() * 7);
  const lowStockSets = lowStockRaw <= 5 ? lowStockRaw : undefined;

  // Final run date within next 7–21 days
  const daysOut = 7 + Math.floor(rand() * 14);
  const d = nowIST();
  d.setDate(d.getDate() + daysOut);
  d.setHours(18, 0, 0, 0);

  // Recent interest 10–60
  const recentInterest = 10 + Math.floor(rand() * 50);

  // Queue size 0–30 (show sometimes)
  const queueSize = Math.floor(rand() * 31);

  // City slots (limited)
  const cities = ["Surat", "Jaipur", "Ahmedabad", "Mumbai", "Bengaluru"];
  const city = cities[Math.floor(rand() * cities.length)];
  const total = 5 + Math.floor(rand() * 4); // 5–8
  const taken = 1 + Math.floor(rand() * Math.max(1, total - 1));

  // Concurrent viewers 3–24
  const concurrentViewers = 3 + Math.floor(rand() * 22);

  return {
    finalRunDate: d,
    lowStockSets,
    recentInterest,
    queueSize,
    citySlots: { city, taken, total },
    concurrentViewers,
  };
}

export function compactCountdown(countdown: Countdown) {
  if (countdown.days > 0) return `${countdown.days}d ${countdown.hours}h`;
  if (countdown.hours > 0) return `${countdown.hours}h ${countdown.minutes}m`;
  return `${countdown.minutes}m ${countdown.seconds}s`;
}

