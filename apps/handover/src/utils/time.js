/** Format a job's createdAt for the card: clock (and date if needed) + relative age. */
export function formatJobTime(iso, now = Date.now()) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  const elapsedMs = Math.max(0, now - d.getTime());
  const mins = Math.floor(elapsedMs / 60_000);
  let relative;
  if (mins < 1) relative = "just now";
  else if (mins < 60) relative = `${mins}m ago`;
  else if (mins < 60 * 24) relative = `${Math.floor(mins / 60)}h ago`;
  else relative = `${Math.floor(mins / (60 * 24))}d ago`;

  const clock = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const startThat = new Date(d);
  startThat.setHours(0, 0, 0, 0);
  const dayDiff = Math.round((startToday - startThat) / 86_400_000);

  let when = clock;
  if (dayDiff === 1) when = `Yesterday ${clock}`;
  else if (dayDiff > 1) {
    when = `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ${clock}`;
  }

  return `${when} · ${relative}`;
}
