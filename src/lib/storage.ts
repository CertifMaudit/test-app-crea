import type { GeneratedCreative, HistoryEntry } from "@/types";

const HISTORY_KEY = "ad-creative-history";
const FAVORITES_KEY = "ad-creative-favorites";
const MAX_HISTORY = 20;

// ── History ──────────────────────────────────────────────────────────

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_HISTORY) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = history.slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full – silently ignore
  }
}

// ── Favorites ────────────────────────────────────────────────────────

export function loadFavorites(): GeneratedCreative[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as GeneratedCreative[];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: GeneratedCreative[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage full – silently ignore
  }
}
