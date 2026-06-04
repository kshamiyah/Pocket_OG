export default function ContentBlock({ block }) {
  if (block.type === "text") return <p className="text-sm text-slate-300 leading-relaxed mb-3">{block.value}</p>;
  if (block.type === "alert") return (
    <div className="flex gap-2 bg-amber-950/60 border border-amber-600/40 rounded-lg p-3 mb-4">
      <span className="text-amber-400 shrink-0">⚠</span>
      <p className="text-sm text-amber-200 leading-snug">{block.value}</p>
    </div>
  );
  if (block.type === "subheading") return <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400 mt-5 mb-2">{block.value}</h4>;
  if (block.type === "list") return (
    <ul className="mb-4 space-y-1.5">
      {block.items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-300 leading-snug">
          <span className="text-teal-500 shrink-0 mt-0.5">›</span><span>{item}</span>
        </li>
      ))}
    </ul>
  );
  if (block.type === "table") return (
    <div className="overflow-x-auto mb-4 rounded-lg border border-slate-700/50">
      <table className="w-full text-sm border-collapse">
        <thead><tr className="bg-slate-800/80">
          {block.headers.map((h, i) => <th key={i} className="text-left text-xs font-semibold text-teal-400 uppercase tracking-wide px-3 py-2 border-b border-slate-700">{h}</th>)}
        </tr></thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"}>
              {row.map((cell, ci) => <td key={ci} className={`px-3 py-2 text-slate-300 leading-snug align-top border-b border-slate-800 ${ci === 0 ? "font-medium text-slate-200" : ""}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return null;
}
