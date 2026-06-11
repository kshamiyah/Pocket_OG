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

export default function ContentBlock({ block, highlightTerms = [] }) {
  const hi = t => highlightText(t, highlightTerms);

  if (block.type === "text") return <p className="text-sm text-gray-700 leading-relaxed mb-3">{hi(block.value)}</p>;
  if (block.type === "alert") return (
    <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
      <span className="text-amber-500 shrink-0 text-sm">⚠</span>
      <p className="text-sm text-amber-800 leading-snug">{hi(block.value)}</p>
    </div>
  );
  if (block.type === "subheading") return <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-500 mt-5 mb-2">{hi(block.value)}</h4>;
  if (block.type === "list") return (
    <ul className="mb-4 space-y-1.5">
      {block.items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-700 leading-snug">
          <span className="text-blue-400 shrink-0 mt-0.5">›</span><span>{hi(item)}</span>
        </li>
      ))}
    </ul>
  );
  if (block.type === "table") return (
    <div className="overflow-x-auto mb-4 rounded-xl border border-gray-100">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {block.headers.map((h, i) => (
              <th key={i} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 border-b border-gray-100">{hi(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
              {row.map((cell, ci) => (
                <td key={ci} className={`px-3 py-2.5 text-gray-700 leading-snug align-top border-b border-gray-100 ${ci === 0 ? "font-medium text-gray-800" : ""}`}>{hi(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return null;
}
