import { accessSync } from "node:fs";
import { join } from "node:path";

/** Vite binary: local node_modules (standalone repo) or monorepo root (legacy). */
export function viteBin(appDir) {
  const candidates = [
    join(appDir, "node_modules/.bin/vite"),
    join(appDir, "../../node_modules/.bin/vite"),
  ];
  for (const p of candidates) {
    try {
      accessSync(p);
      return p;
    } catch {
      /* try next */
    }
  }
  return candidates[0];
}
