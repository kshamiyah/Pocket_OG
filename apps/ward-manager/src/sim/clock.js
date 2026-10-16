// Test-only simulated clock. Loaded only when the app is built with
// VITE_SIM=1 (the private test board); the live app never contains it.
//
// Every timer in the app reads Date, so shifting Date by an offset moves the
// whole board forward in time. The offset is kept in localStorage so a reload
// keeps the simulated time.

const KEY = "pocketsuite_sim_offset_v1";
const RealDate = Date;
let offset = 0;
try { offset = Number(localStorage.getItem(KEY)) || 0; } catch { offset = 0; }

class SimDate extends RealDate {
  constructor(...args) {
    if (args.length === 0) super(RealDate.now() + offset);
    else super(...args);
  }
  static now() { return RealDate.now() + offset; }
}
globalThis.Date = SimDate;

function save() {
  try { localStorage.setItem(KEY, String(offset)); } catch { /* storage blocked */ }
  window.dispatchEvent(new Event("sim-clock"));
}

export const simOffset = () => offset;
export function advance(ms) { offset += Math.max(0, ms); save(); }
export function jumpTo(t) { advance(t - SimDate.now()); }
export function resetClock() { offset = 0; save(); }
