// Wraps matched query terms in <mark> for search-result highlighting.
// Kept in its own module so component files only export components
// (keeps react-refresh / fast refresh happy).
export function highlightText(text, terms) {
  if (!terms || !terms.length || !text) return text;
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1
      ? <mark key={i} className="bg-yellow-200 text-inherit rounded-sm px-0.5">{part}</mark>
      : part
  );
}
