// Node module-resolution hook so the app's Vite-style imports load in plain Node.
// Handles two things Vite resolves but Node does not:
//   1. extensionless relative imports ("./GL861_FLOWCHART")
//   2. the workspace alias "@pocket-og/guidelines" (no npm install required)
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const GUIDELINES_INDEX = path.join(REPO_ROOT, "packages", "guidelines", "src", "index.js");

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "@pocket-og/guidelines") {
    return { url: pathToFileURL(GUIDELINES_INDEX).href, shortCircuit: true };
  }
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (
      (err.code === "ERR_MODULE_NOT_FOUND" || err.code === "ERR_UNSUPPORTED_DIR_IMPORT") &&
      specifier.startsWith(".") &&
      context.parentURL
    ) {
      const base = path.dirname(fileURLToPath(context.parentURL));
      for (const suffix of [".js", ".jsx", "/index.js"]) {
        const candidate = path.resolve(base, specifier + suffix);
        if (existsSync(candidate)) {
          return { url: pathToFileURL(candidate).href, shortCircuit: true };
        }
      }
    }
    throw err;
  }
}
