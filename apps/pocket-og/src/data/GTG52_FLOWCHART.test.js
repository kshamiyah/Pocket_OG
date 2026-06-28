// GTG52 PPH flowchart — exhaustive path traversal, structural integrity, and
// clinical content tests.
//
// Clinical assertions are derived directly from GTG52 guideline text
// (packages/guidelines/src/GTG52.js), not from the flowchart itself.
// A change to the flowchart that deviates from the guideline will break these tests.

import { describe, it, expect } from "vitest";
import { GTG52_PPH_FLOWCHART } from "./GTG52_FLOWCHART.js";

// ─── Path Traversal Engine ────────────────────────────────────────────────────

// Returns every distinct root-to-leaf path through the flowchart.
// Each result: { path: Step[], status: "resolved"|"broken"|"cycle"|"dead_end", outcome?, error? }
// Step is either { id, title, type } for a node, or { choice, next } for a decision branch.
function findAllPaths(flowchart) {
  const { nodes, startId } = flowchart;
  const results = [];

  function dfs(nodeId, pathSoFar, visitedIds) {
    const node = nodes[nodeId];

    if (!node) {
      results.push({
        path: [...pathSoFar, { id: nodeId }],
        status: "broken",
        error: `Referenced node "${nodeId}" does not exist`,
      });
      return;
    }

    const entry = { id: nodeId, title: node.title, type: node.type };
    const newPath = [...pathSoFar, entry];

    if (visitedIds.has(nodeId)) {
      results.push({ path: newPath, status: "cycle", error: `Cycle detected at "${nodeId}"` });
      return;
    }

    const newVisited = new Set(visitedIds);
    newVisited.add(nodeId);

    if (node.type === "end") {
      results.push({ path: newPath, status: "resolved", outcome: node.title });
      return;
    }

    if (node.type === "decision") {
      for (const option of node.options) {
        dfs(option.next, [...newPath, { choice: option.label, next: option.next }], newVisited);
      }
      return;
    }

    // action or alert — single next
    if (!node.next) {
      results.push({
        path: newPath,
        status: "dead_end",
        error: `Non-end node "${nodeId}" (${node.type}) has no "next" property`,
      });
      return;
    }
    dfs(node.next, newPath, newVisited);
  }

  dfs(startId, [], new Set());
  return results;
}

function formatPath(path) {
  return path
    .map(step =>
      "choice" in step
        ? `  └─ [${step.choice}] → ${step.next}`
        : `${step.id} (${step.type})`
    )
    .join("\n");
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("GTG52_PPH_FLOWCHART — structural integrity", () => {
  const { nodes, startId } = GTG52_PPH_FLOWCHART;

  it("startId exists in nodes", () => {
    expect(nodes[startId], `startId "${startId}" is not defined in nodes`).toBeDefined();
  });

  it("all next and options.next references point to existing nodes", () => {
    const broken = [];
    for (const [id, node] of Object.entries(nodes)) {
      if (node.next && !nodes[node.next]) {
        broken.push(`"${id}".next → "${node.next}" (missing)`);
      }
      if (node.options) {
        for (const opt of node.options) {
          if (!nodes[opt.next]) {
            broken.push(`"${id}".options["${opt.label}"] → "${opt.next}" (missing)`);
          }
        }
      }
    }
    expect(broken, `Broken node references:\n${broken.join("\n")}`).toHaveLength(0);
  });

  it("every node is reachable from startId (no orphaned nodes)", () => {
    const reachable = new Set();
    const queue = [startId];
    while (queue.length) {
      const id = queue.shift();
      if (reachable.has(id)) continue;
      reachable.add(id);
      const node = nodes[id];
      if (!node) continue;
      if (node.next) queue.push(node.next);
      if (node.options) node.options.forEach(o => queue.push(o.next));
    }
    const orphans = Object.keys(nodes).filter(id => !reachable.has(id));
    expect(orphans, `Orphaned (unreachable) nodes: [${orphans.join(", ")}]`).toHaveLength(0);
  });

  it("decision nodes each have at least 2 options", () => {
    const bad = Object.entries(nodes)
      .filter(([, n]) => n.type === "decision" && (!n.options || n.options.length < 2))
      .map(([id]) => id);
    expect(bad, `Decision nodes with < 2 options: [${bad.join(", ")}]`).toHaveLength(0);
  });

  it("non-end non-decision nodes each have a next property", () => {
    const bad = Object.entries(nodes)
      .filter(([, n]) => !["end", "decision"].includes(n.type) && !n.next)
      .map(([id]) => id);
    expect(bad, `Action/alert nodes missing next: [${bad.join(", ")}]`).toHaveLength(0);
  });
});

// ─── Path Traversal ───────────────────────────────────────────────────────────

describe("GTG52_PPH_FLOWCHART — all possible paths", () => {
  const allPaths = findAllPaths(GTG52_PPH_FLOWCHART);

  it("finds exactly 6 distinct paths through the flowchart", () => {
    expect(allPaths).toHaveLength(6);
  });

  it("every path terminates cleanly at an end node (no broken links, cycles, or dead ends)", () => {
    const failures = allPaths.filter(p => p.status !== "resolved");
    if (failures.length === 0) return;

    const report = failures
      .map((f, i) => `\nFailed path ${i + 1} [${f.status.toUpperCase()}]: ${f.error}\n${formatPath(f.path)}`)
      .join("\n");
    expect.fail(`${failures.length} path(s) did not resolve:${report}`);
  });

  // Each expected terminal outcome must be reachable
  const expectedOutcomes = [
    "Normal Blood Loss — Active Management Complete",
    "Minor PPH — Resolved",
    "Major PPH — Controlled",
    "Post-Massive PPH — Critical Care",
  ];

  it.each(expectedOutcomes)("outcome reachable: %s", outcomeTitle => {
    const match = allPaths.find(p => p.outcome === outcomeTitle);
    expect(match, `No path reaches outcome: "${outcomeTitle}"`).toBeDefined();
  });
});

// ─── Per-Path Documentation ───────────────────────────────────────────────────
// Each test below documents one specific clinical path and asserts it resolves correctly.

describe("GTG52_PPH_FLOWCHART — individual path verification", () => {
  const allPaths = findAllPaths(GTG52_PPH_FLOWCHART);

  const scenarios = [
    {
      label: "blood loss < 500 ml → normal",
      decisions: { blood_loss: "< 500 ml — normal" },
      outcome: "Normal Blood Loss — Active Management Complete",
    },
    {
      label: "minor PPH → controlled → resolved",
      decisions: { blood_loss: "500–1000 ml — Minor PPH", minor_response: "Controlled — bleeding settled" },
      outcome: "Minor PPH — Resolved",
    },
    {
      label: "minor PPH → not controlled → escalated to major → controlled",
      decisions: {
        blood_loss: "500–1000 ml — Minor PPH",
        minor_response: "Not controlled / approaching 1000 ml",
        major_response: "Yes — haemostasis achieved",
      },
      outcome: "Major PPH — Controlled",
    },
    {
      label: "minor PPH → not controlled → major → not controlled → massive PPH",
      decisions: {
        blood_loss: "500–1000 ml — Minor PPH",
        minor_response: "Not controlled / approaching 1000 ml",
        major_response: "No — ongoing / > 2000 ml",
      },
      outcome: "Post-Massive PPH — Critical Care",
    },
    {
      label: "major PPH from outset → controlled",
      decisions: {
        blood_loss: "> 1000 ml — Major PPH",
        major_response: "Yes — haemostasis achieved",
      },
      outcome: "Major PPH — Controlled",
    },
    {
      label: "major PPH from outset → not controlled → massive PPH + MHP + surgical",
      decisions: {
        blood_loss: "> 1000 ml — Major PPH",
        major_response: "No — ongoing / > 2000 ml",
      },
      outcome: "Post-Massive PPH — Critical Care",
    },
  ];

  // Match a scenario to the path that follows the same decisions at each fork
  function matchPath(scenario) {
    return allPaths.find(result => {
      for (const [nodeId, choiceLabel] of Object.entries(scenario.decisions)) {
        // Find the choice step that immediately follows this node's entry
        const nodeIdx = result.path.findIndex(s => "id" in s && s.id === nodeId);
        if (nodeIdx === -1) return false;
        const choiceStep = result.path[nodeIdx + 1];
        if (!choiceStep || !("choice" in choiceStep)) return false;
        if (choiceStep.choice !== choiceLabel) return false;
      }
      return true;
    });
  }

  it.each(scenarios)("$label", scenario => {
    const result = matchPath(scenario);
    expect(result, `No path found matching scenario: "${scenario.label}"`).toBeDefined();
    expect(result.status).toBe("resolved");
    expect(result.outcome).toBe(scenario.outcome);

    // Verify path starts at assess and ends at an end node
    const firstNode = result.path.find(s => "id" in s);
    const lastNode = [...result.path].reverse().find(s => "id" in s);
    expect(firstNode?.id).toBe("assess");
    expect(lastNode?.type).toBe("end");
  });
});

// ─── Clinical Content vs GTG52 Guideline ─────────────────────────────────────
// Each assertion is sourced from a specific section of GTG52.js.
// If the flowchart deviates from the guideline, these tests fail.

describe("GTG52_PPH_FLOWCHART — clinical content vs GTG52 guideline", () => {
  const { nodes } = GTG52_PPH_FLOWCHART;

  // Concatenates all text content in a node (title, text, items) for case-insensitive search
  function nodeText(nodeId) {
    const node = nodes[nodeId];
    return [node.title, node.text, ...(node.items ?? [])].join(" ").toLowerCase();
  }

  const has  = (nodeId, str) => nodeText(nodeId).includes(str.toLowerCase());
  const hasNot = (nodeId, str) => !nodeText(nodeId).includes(str.toLowerCase());

  // ─── Blood loss classification thresholds ─────────────────────────────────
  // Source: GTG52.js gtg52-overview
  // "Minor PPH: 500–1000 ml", "Major PPH: >1000 ml",
  // "Severe major PPH: >2000 ml — activate massive haemorrhage protocol"

  describe("blood loss thresholds (gtg52-overview classification)", () => {
    it("normal/minor boundary is 500 ml", () => {
      const opt = nodes.blood_loss.options.find(o => o.next === "normal");
      expect(opt.label).toMatch(/500/);
    });

    it("minor PPH range is 500–1000 ml", () => {
      const opt = nodes.blood_loss.options.find(o => o.next === "minor");
      expect(opt.label).toMatch(/500/);
      expect(opt.label).toMatch(/1000/);
    });

    it("major PPH threshold is > 1000 ml", () => {
      const opt = nodes.blood_loss.options.find(o => o.next === "major");
      expect(opt.label).toMatch(/1000/);
    });

    it("MHP activation threshold is > 2000 ml (gtg52-overview: severe major PPH)", () => {
      const opt = nodes.major_response.options.find(o => o.next === "massive");
      expect(opt.label).toMatch(/2000/);
    });
  });

  // ─── Minor PPH node ───────────────────────────────────────────────────────
  // Source: GTG52.js gtg52-minor

  describe("minor PPH node content (gtg52-minor)", () => {
    it("specifies 16G cannula for IV access", () => {
      // GTG52: "Establish IV access: 16G cannula × 1 (minimum)"
      expect(has("minor", "16g")).toBe(true);
    });

    it("catheterisation with urine output target > 30 ml/hr", () => {
      // GTG52: "Catheterise — monitor urine output hourly (target >30 ml/hr)"
      expect(has("minor", "30 ml/hr")).toBe(true);
    });

    it("oxytocin 5 IU IV bolus then 40 IU infusion at 125 ml/hr", () => {
      // GTG52: "Oxytocin 5 IU IV slowly" and "40 IU in 500 ml Hartmann's at 125 ml/hr"
      expect(has("minor", "5 iu")).toBe(true);
      expect(has("minor", "40 iu")).toBe(true);
      expect(has("minor", "125 ml/hr")).toBe(true);
    });

    it("ergometrine 500 mcg included as second uterotonic", () => {
      // GTG52: "Ergometrine 500 mcg IM or IV slowly"
      expect(has("minor", "ergometrine")).toBe(true);
      expect(has("minor", "500 mcg")).toBe(true);
    });

    it("ergometrine contraindication includes hypertension", () => {
      // GTG52: "avoid if hypertension or cardiac disease"
      expect(has("minor", "hypertens")).toBe(true);
    });

    it("ergometrine contraindication includes cardiac disease (GTG52 gtg52-minor — currently missing from flowchart)", () => {
      // GTG52 gtg52-minor explicitly states "avoid if hypertension or cardiac disease"
      // The flowchart currently only says "avoid if hypertensive" — cardiac disease omitted
      expect(has("minor", "cardiac")).toBe(true);
    });

    it("bimanual uterine compression for atony", () => {
      // GTG52: "Rub up a uterine contraction — bimanual uterine massage"
      expect(has("minor", "bimanual")).toBe(true);
    });

    it("inspection of placenta and cervix to address the 4 Ts", () => {
      // GTG52: "Tissue: check placenta is complete", "Trauma: inspect cervix and vagina"
      expect(has("minor", "placenta")).toBe(true);
      expect(has("minor", "cervix")).toBe(true);
    });
  });

  // ─── Major PPH resuscitation node ────────────────────────────────────────
  // Source: GTG52.js gtg52-major

  describe("major PPH resuscitation node content (gtg52-major)", () => {
    it("2 large-bore IV cannulae specified as 14G or 16G", () => {
      // GTG52: "2 × large bore IV cannulae (14G or 16G)"
      expect(has("major_resus", "14g")).toBe(true);
      expect(has("major_resus", "16g")).toBe(true);
    });

    it("crossmatch 4 units of red cells", () => {
      // GTG52: "Crossmatch 4 units red cells urgently"
      expect(has("major_resus", "crossmatch")).toBe(true);
      expect(has("major_resus", "4 unit")).toBe(true);
    });

    it("O-negative blood for life-threatening haemorrhage before crossmatch", () => {
      // GTG52: "O-negative blood if immediate life-threatening haemorrhage before crossmatch available"
      expect(has("major_resus", "o-negative")).toBe(true);
    });

    it("tranexamic acid 1 g IV with mandatory 3-hour window from birth", () => {
      // GTG52: "Tranexamic acid 1 g IV over 10 minutes — give as soon as possible (within 3 hours of birth)"
      expect(has("major_resus", "tranexamic")).toBe(true);
      expect(has("major_resus", "1 g")).toBe(true);
      expect(has("major_resus", "3 hour")).toBe(true);
    });

    it("carboprost 0.25 mg IM every 15 minutes, maximum 8 doses", () => {
      // GTG52: "Carboprost (Hemabate) 0.25 mg IM every 15 minutes — max 8 doses"
      expect(has("major_resus", "carboprost")).toBe(true);
      expect(has("major_resus", "0.25 mg")).toBe(true);
      expect(has("major_resus", "15 min")).toBe(true);
      expect(has("major_resus", "8 dose")).toBe(true);
    });

    it("carboprost contraindicated in asthma (GTG52 mandatory warning)", () => {
      // GTG52: "contraindicated in asthma"
      expect(has("major_resus", "asthma")).toBe(true);
    });

    it("haematological targets: Hb > 80 g/L, Plt > 75, fibrinogen > 2 g/L", () => {
      // GTG52: "Target Hb >80 g/L, Plt >75 × 10⁹/L, fibrinogen >2 g/L"
      expect(has("major_resus", "80")).toBe(true);
      expect(has("major_resus", "75")).toBe(true);
      expect(has("major_resus", "fibrinogen")).toBe(true);
      expect(has("major_resus", "2 g/l")).toBe(true);
    });

    it("calcium gluconate for hypocalcaemia correction", () => {
      // GTG52: "Correct acidosis and ionised hypocalcaemia (10 ml 10% calcium gluconate per 4 units red cells)"
      expect(has("major_resus", "calcium")).toBe(true);
    });

    it("tranexamic acid does NOT appear in minor PPH or normal — reserved for major+", () => {
      // GTG52 prescribes TXA only from major PPH onwards
      expect(hasNot("minor", "tranexamic")).toBe(true);
      expect(hasNot("normal", "tranexamic")).toBe(true);
    });
  });

  // ─── Blood products node ──────────────────────────────────────────────────
  // Source: GTG52.js gtg52-major — "Blood Products" section

  describe("blood products node content (gtg52-major blood products section)", () => {
    it("cryoprecipitate as first choice for fibrinogen < 2 g/L", () => {
      // GTG52: "Cryoprecipitate 2 pools: if fibrinogen <2 g/L — first choice for fibrinogen replacement"
      expect(has("blood_products", "cryoprecipitate")).toBe(true);
      expect(has("blood_products", "2 g/l")).toBe(true);
    });

    it("FFP 4 units for fibrinogen < 1.5 g/L with 1:1 ratio if massive", () => {
      // GTG52: "FFP 4 units: if fibrinogen <1.5 g/L or coagulopathy developing; ratio 1:1 with red cells if massive"
      expect(has("blood_products", "ffp")).toBe(true);
      expect(has("blood_products", "1.5 g/l")).toBe(true);
      expect(has("blood_products", "1:1")).toBe(true);
    });

    it("platelet threshold < 75 × 10⁹/L, raised to < 100 if ongoing bleeding", () => {
      // GTG52: "Platelets: transfuse if Plt <75 × 10⁹/L (or <100 if ongoing bleeding)"
      expect(has("blood_products", "75")).toBe(true);
      expect(has("blood_products", "100")).toBe(true);
    });

    it("recombinant Factor VIIa as escalation option for refractory haemorrhage", () => {
      // GTG52: "Consider recombinant Factor VIIa in life-threatening haemorrhage not responding to standard measures"
      expect(has("blood_products", "viia")).toBe(true);
    });
  });

  // ─── Massive PPH / MHP activation node ───────────────────────────────────
  // Source: GTG52.js gtg52-massive

  describe("massive PPH alert node content (gtg52-massive)", () => {
    it("requires CONSULTANT obstetrician — escalation beyond 'senior' required at this tier", () => {
      // GTG52: "Call consultant obstetrician, anaesthetist, and haematologist"
      // Minor PPH only requires a senior obstetrician — consultant is a stricter obligation
      expect(has("massive", "consultant obstetrician")).toBe(true);
    });

    it("haematologist must be contacted immediately", () => {
      // GTG52: "Contact haematologist and blood bank immediately"
      expect(has("massive", "haematologist")).toBe(true);
    });

    it("MHP pack contains 6 units RBCs and 4 units FFP", () => {
      // GTG52: "MHP pack: 6 units red cells + 4 units FFP ± platelets ± cryoprecipitate"
      expect(has("massive", "6 unit")).toBe(true);
      expect(has("massive", "4 unit")).toBe(true);
      expect(has("massive", "ffp")).toBe(true);
    });

    it("cell salvage included with haematologist authorisation for Rh-negative patients", () => {
      // GTG52: "Cell salvage: use if available (requires haematologist authorisation if Rhesus negative)"
      expect(has("massive", "cell salvage")).toBe(true);
    });

    it("ROTEM or TEG for point-of-care coagulation guidance", () => {
      // GTG52: "Point-of-care coagulation testing (ROTEM/TEG) to guide product replacement"
      expect(has("massive", "rotem") || has("massive", "teg")).toBe(true);
    });

    it("consultant obstetrician is NOT required at minor PPH tier", () => {
      // Confirms escalation of personnel requirement is correctly tiered
      expect(hasNot("minor", "consultant obstetrician")).toBe(true);
    });
  });

  // ─── Intrauterine balloon and surgical options node ───────────────────────
  // Source: GTG52.js gtg52-massive — "Intrauterine Balloon Tamponade" and "Surgical Options"

  describe("surgical escalation node content (gtg52-massive surgical section)", () => {
    it("Bakri balloon inflated with 300–500 ml saline", () => {
      // GTG52: "Bakri balloon or SOS Bakri: insert into uterine cavity and inflate with 300–500 ml saline"
      expect(has("surgical", "bakri")).toBe(true);
      expect(has("surgical", "300")).toBe(true);
      expect(has("surgical", "500")).toBe(true);
      expect(has("surgical", "saline")).toBe(true);
    });

    it("tamponade test described — if bleeding stops conservative management may suffice", () => {
      // GTG52: "'Tamponade test': if bleeding stops with balloon inflated, conservative management may suffice"
      expect(has("surgical", "tamponade test")).toBe(true);
    });

    it("B-Lynch brace suture for uterine atony at caesarean", () => {
      // GTG52: "B-Lynch suture (brace suture): compresses uterine body — effective for atony at caesarean"
      expect(has("surgical", "b-lynch")).toBe(true);
    });

    it("Hayman suture as simpler brace technique", () => {
      // GTG52: "Hayman suture: simpler brace suture technique"
      expect(has("surgical", "hayman")).toBe(true);
    });

    it("uterine artery embolisation (UAE) as uterine-conserving option when haemodynamically stable", () => {
      // GTG52: "Uterine artery embolisation (UAE): interventional radiology — uterine conservation; suitable if haemodynamically stable"
      expect(has("surgical", "embolisation") || has("surgical", "uae")).toBe(true);
    });

    it("peripartum hysterectomy listed as last resort with gynaecological oncologist involvement", () => {
      // GTG52: "Peripartum hysterectomy: life-saving last resort — obstetric consultant + gynaecological oncologist if available"
      expect(has("surgical", "hysterectomy")).toBe(true);
      expect(has("surgical", "oncologist")).toBe(true);
    });

    it("Bakri balloon does NOT appear in minor PPH or major resus — only at surgical escalation", () => {
      // GTG52 places balloon tamponade in the massive/surgical section only
      expect(hasNot("minor", "bakri")).toBe(true);
      expect(hasNot("major_resus", "bakri")).toBe(true);
    });
  });

  // ─── Post-event critical care ─────────────────────────────────────────────
  // Source: GTG52.js gtg52-massive — "Post-Event Care"

  describe("post-PPH care in resolved end states", () => {
    it("HDU or ITU is mandated after major PPH controlled", () => {
      // GTG52 implies high-dependency care after major haemorrhage
      expect(has("major_resolved", "hdu") || has("major_resolved", "itu")).toBe(true);
    });

    it("HDU or ITU is mandated after massive PPH", () => {
      // GTG52: "HDU or ITU admission after massive PPH"
      expect(has("end_massive", "hdu") || has("end_massive", "itu")).toBe(true);
    });

    it("VTE risk and LMWH addressed after major PPH resolved", () => {
      // GTG52: "VTE assessment and LMWH once haemostasis achieved (high VTE risk post-major PPH)"
      expect(has("major_resolved", "vte")).toBe(true);
      expect(has("major_resolved", "lmwh")).toBe(true);
    });

    it("VTE prophylaxis addressed after massive PPH", () => {
      // GTG52: "VTE assessment and LMWH once haemostasis achieved"
      expect(has("end_massive", "vte")).toBe(true);
    });

    it("MBRRACE notification required after massive PPH near-miss (GTG52 mandatory)", () => {
      // GTG52: "MBRRACE notification if maternal death or near-miss"
      expect(has("end_massive", "mbrrace")).toBe(true);
    });

    it("patient and partner debrief mentioned in both resolved end states", () => {
      // GTG52: "Debrief: patient and partner, with written summary"
      expect(has("major_resolved", "debrief")).toBe(true);
      expect(has("end_massive", "debrief")).toBe(true);
    });
  });

  // ─── Escalation direction ─────────────────────────────────────────────────
  // Clinical logic: "not controlled" must always escalate, never reach a terminal node

  describe("escalation always increases in severity — never reverses or terminates early", () => {
    it("minor_response: controlled → end node; not controlled → major", () => {
      const controlled  = nodes.minor_response.options.find(o => o.next === "minor_resolved");
      const escalated   = nodes.minor_response.options.find(o => o.next === "major");
      expect(controlled, "no option leads to minor_resolved").toBeDefined();
      expect(escalated,  "no option escalates to major").toBeDefined();
      expect(nodes[controlled.next].type).toBe("end");
    });

    it("major_response: haemostasis achieved → end node; ongoing → massive", () => {
      const controlled  = nodes.major_response.options.find(o => o.next === "major_resolved");
      const escalated   = nodes.major_response.options.find(o => o.next === "massive");
      expect(controlled, "no option leads to major_resolved").toBeDefined();
      expect(escalated,  "no option escalates to massive").toBeDefined();
      expect(nodes[controlled.next].type).toBe("end");
    });

    it("no path from the massive tier can reach normal or minor_resolved (no downgrade)", () => {
      const reachable = new Set();
      const queue = ["massive"];
      while (queue.length) {
        const id = queue.shift();
        if (reachable.has(id)) continue;
        reachable.add(id);
        const node = nodes[id];
        if (!node) continue;
        if (node.next) queue.push(node.next);
        if (node.options) node.options.forEach(o => queue.push(o.next));
      }
      expect(reachable.has("normal")).toBe(false);
      expect(reachable.has("minor_resolved")).toBe(false);
    });
  });
});
