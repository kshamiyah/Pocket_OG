// ESM resolve hook so Node can load the app's source, which uses extensionless
// relative imports ("./GL861_FLOWCHART") that Vite resolves but Node does not.
// If a relative specifier fails to resolve, retry it with a ".js" extension.
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (err) {
    if (specifier.startsWith(".") && !/\.[mc]?js$/.test(specifier)) {
      return next(specifier + ".js", context);
    }
    throw err;
  }
}
