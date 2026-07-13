// In-page structural checks + console/network capture.
//
// The bounding-box logic runs inside the page via page.evaluate and returns
// plain data. It is deliberately conservative: this is a one-handed phone tool,
// so HORIZONTAL overflow and interactive-element OVERLAP are treated as real
// defects, while intentional single-line truncation (text-overflow: ellipsis)
// is NOT flagged, and vertical clipping is only flagged on non-scroll elements.

// Attach console/pageerror/network listeners to a page. Returns a drained()
// getter for whatever has accumulated.
export function captureDiagnostics(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err?.message || err)));
  page.on("requestfailed", (req) => {
    const f = req.failure();
    // Aborted requests are expected during the offline pass; the caller tags them.
    failedRequests.push({ url: req.url(), method: req.method(), error: f?.errorText || "" });
  });
  return {
    drain() {
      return {
        consoleErrors: consoleErrors.splice(0),
        pageErrors: pageErrors.splice(0),
        failedRequests: failedRequests.splice(0),
      };
    },
  };
}

// The function body below is serialised into the page. Keep it self-contained.
export async function structuralChecks(page, { tolerance = 1 } = {}) {
  return page.evaluate((tol) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const results = { viewport: { vw, vh }, overflow: [], overlaps: [], clipping: [], docScroll: null };

    // Horizontal document scroll is itself a smell on a phone-first layout.
    if (document.documentElement.scrollWidth > vw + tol) {
      results.docScroll = { scrollWidth: document.documentElement.scrollWidth, vw };
    }

    const isVisible = (el) => {
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) < 0.02) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0.5 && r.height > 0.5;
    };

    const label = (el) => {
      const tag = el.tagName.toLowerCase();
      const aria = el.getAttribute("aria-label");
      const coach = el.getAttribute("data-coach");
      let txt = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
      const id = aria ? `[${aria}]` : coach ? `{${coach}}` : txt ? `"${txt}"` : "";
      return `${tag}${id}`;
    };

    const rectOf = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
    };

    const all = Array.from(document.querySelectorAll("*")).filter(isVisible);

    // An element that lives inside a horizontally-scrollable container (e.g. the
    // ward-filter chip rail, overflow-x-auto) is MEANT to extend past the edge.
    const inHScroller = (el) => {
      let p = el.parentElement;
      while (p) {
        const s = getComputedStyle(p);
        if (/(auto|scroll)/.test(s.overflowX)) return true;
        p = p.parentElement;
      }
      return false;
    };

    // ---- Horizontal viewport overflow ----
    for (const el of all) {
      const r = el.getBoundingClientRect();
      // Ignore fixed off-canvas sheets that are deliberately translated out.
      const s = getComputedStyle(el);
      const translatedOut = s.transform && s.transform !== "none";
      if (inHScroller(el)) continue;
      if (r.right > vw + tol || r.left < -tol) {
        // Only report leaf-ish elements or elements that themselves are wider
        // than the viewport (a container merely containing an overflow child is
        // reported once via the child).
        if (r.width <= vw + tol && !translatedOut) {
          results.overflow.push({ el: label(el), rect: rectOf(el), side: r.right > vw + tol ? "right" : "left" });
        } else if (r.width > vw + tol && !translatedOut) {
          results.overflow.push({ el: label(el), rect: rectOf(el), side: "wider-than-viewport" });
        }
      }
    }

    // ---- Interactive overlap ----
    const interactiveSel = 'button, a[href], input, textarea, select, [role="button"], [contenteditable="true"]';
    // Exclude out-of-flow elements (fixed FAB, absolute inset-0 modal scrims,
    // off-canvas sheets): those legitimately sit over other controls and are
    // not "overlap" bugs. Overlap bugs we care about are between two controls
    // in normal flow that collide.
    const inFlow = (el) => {
      const pos = getComputedStyle(el).position;
      return pos !== "fixed" && pos !== "absolute" && pos !== "sticky";
    };
    // Hit-test: an element occluded by something else (e.g. everything behind
    // an open modal's backdrop scrim) is not the topmost element at its own
    // centre. Such elements are not visible to the user and must not count as
    // "overlapping" the modal's own controls. This is the key to not flagging
    // the whole background screen whenever an overlay is open.
    const notOccluded = (el) => {
      const r = el.getBoundingClientRect();
      const cx = Math.min(vw - 1, Math.max(1, r.left + r.width / 2));
      const cy = Math.min(vh - 1, Math.max(1, r.top + r.height / 2));
      const top = document.elementFromPoint(cx, cy);
      if (!top) return false;
      return top === el || el.contains(top) || top.contains(el);
    };
    const interactive = Array.from(document.querySelectorAll(interactiveSel))
      .filter(isVisible).filter(inFlow).filter(notOccluded);
    const inRel = (a, b) => a.contains(b) || b.contains(a);
    const intersect = (r1, r2) => {
      const x = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
      const y = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
      return x * y;
    };
    for (let i = 0; i < interactive.length; i++) {
      for (let j = i + 1; j < interactive.length; j++) {
        const a = interactive[i], b = interactive[j];
        if (inRel(a, b)) continue;
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const area = intersect(ra, rb);
        if (area <= 4) continue;
        const minArea = Math.min(ra.width * ra.height, rb.width * rb.height);
        // Require a meaningful overlap (>15% of the smaller control) to cut noise
        // from touching/adjacent controls that share a 1px border.
        if (area / minArea > 0.15) {
          results.overlaps.push({ a: label(a), b: label(b), overlapPct: Math.round((area / minArea) * 100) });
        }
      }
    }

    // ---- Clipping / truncation (unintended) ----
    // Leaf text nodes only: an element with element children can report an
    // inflated scrollHeight because of an absolutely-positioned descendant
    // (e.g. the swipe-to-delete backing layer), which is not a real clip.
    for (const el of all) {
      if (el.children.length > 0) continue;
      const txt = (el.textContent || "").trim();
      if (!txt) continue;
      const s = getComputedStyle(el);
      const scrollable = /(auto|scroll)/.test(s.overflowX + s.overflowY);
      if (scrollable) continue;
      const ellipsis = s.textOverflow === "ellipsis"; // intentional single-line truncation
      if (!ellipsis && el.scrollWidth > el.clientWidth + tol && s.overflowX === "hidden") {
        results.clipping.push({ el: label(el), axis: "x", scroll: el.scrollWidth, client: el.clientWidth });
      }
      if (s.overflowY === "hidden" && el.scrollHeight > el.clientHeight + tol && el.clientHeight > 0) {
        results.clipping.push({ el: label(el), axis: "y", scroll: el.scrollHeight, client: el.clientHeight });
      }
    }

    // De-dupe and cap to keep reports readable.
    const dedupe = (arr, keyFn) => {
      const seen = new Set(); const out = [];
      for (const it of arr) { const k = keyFn(it); if (seen.has(k)) continue; seen.add(k); out.push(it); }
      return out;
    };
    results.overflow = dedupe(results.overflow, (o) => o.el + o.side).slice(0, 25);
    results.overlaps = dedupe(results.overlaps, (o) => o.a + "|" + o.b).slice(0, 25);
    results.clipping = dedupe(results.clipping, (o) => o.el + o.axis).slice(0, 25);
    return results;
  }, tolerance);
}

// Does a structural result carry anything worth flagging?
export function structuralFlagged(s) {
  return Boolean(s.docScroll) || s.overflow.length > 0 || s.overlaps.length > 0 || s.clipping.length > 0;
}
