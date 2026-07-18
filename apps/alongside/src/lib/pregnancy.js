import { useCallback, useState } from "react";

// Pregnancy is stored as an estimated due date (EDD). Gestational week is
// derived from it against today, so it advances on its own. Changing the week
// simply back-computes a new EDD, keeping one source of truth.

const KEY = "alongside_edd_v1";
const MS_DAY = 86400000;

function today0() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function weekFromEdd(eddISO) {
  const edd = new Date(eddISO + "T00:00:00");
  const daysToEdd = Math.round((edd - today0()) / MS_DAY);
  return Math.max(1, Math.min(42, Math.round(40 - daysToEdd / 7)));
}

export function eddFromWeek(week) {
  const edd = new Date(today0().getTime() + (40 - week) * 7 * MS_DAY);
  return edd.toISOString().slice(0, 10);
}

export function formatEdd(eddISO) {
  const d = new Date(eddISO + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function trimester(week) {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

export function trimesterLabel(week) {
  return ["First", "Second", "Third"][trimester(week) - 1] + " trimester";
}

export function usePregnancy() {
  const [edd, setEddState] = useState(() => {
    try { return localStorage.getItem(KEY) || null; } catch { return null; }
  });
  const setEdd = useCallback(iso => {
    setEddState(iso);
    try { localStorage.setItem(KEY, iso); } catch { /* ignore */ }
  }, []);
  const setWeek = useCallback(w => setEdd(eddFromWeek(w)), [setEdd]);

  return {
    ready: !!edd,
    edd,
    week: edd ? weekFromEdd(edd) : null,
    setEdd,
    setWeek,
  };
}
