// GTG52 PPH flowchart — exhaustive path traversal and structural integrity tests
//
// Finds every possible path through the state machine via DFS, verifies all
// paths terminate at an `end` node, and documents each route taken.

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
