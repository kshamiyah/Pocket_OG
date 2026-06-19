// Complete Tailwind class strings — must not be dynamically constructed
const STYLES = {
  // Flowcharts by GL code
  CG565:  { iconBg: "bg-violet-50",  iconText: "text-violet-500",  rowHover: "hover:bg-violet-50",  rowActive: "active:bg-violet-100"  },
  CG621:  { iconBg: "bg-rose-50",    iconText: "text-rose-500",    rowHover: "hover:bg-rose-50",    rowActive: "active:bg-rose-100"    },
  CG623:  { iconBg: "bg-orange-50",  iconText: "text-orange-500",  rowHover: "hover:bg-orange-50",  rowActive: "active:bg-orange-100"  },
  GL891:  { iconBg: "bg-indigo-50",  iconText: "text-indigo-500",  rowHover: "hover:bg-indigo-50",  rowActive: "active:bg-indigo-100"  },
  GL861:  { iconBg: "bg-teal-50",    iconText: "text-teal-500",    rowHover: "hover:bg-teal-50",    rowActive: "active:bg-teal-100"    },
  GL952:  { iconBg: "bg-blue-50",    iconText: "text-blue-500",    rowHover: "hover:bg-blue-50",    rowActive: "active:bg-blue-100"    },
  // Calculators by ID
  PUL:                   { iconBg: "bg-amber-50",   iconText: "text-amber-500",   rowHover: "hover:bg-amber-50",   rowActive: "active:bg-amber-100"   },
  ECTOPIC_DECISION:      { iconBg: "bg-rose-50",    iconText: "text-rose-500",    rowHover: "hover:bg-rose-50",    rowActive: "active:bg-rose-100"    },
  EXPECTANT_SURVEILLANCE:{ iconBg: "bg-teal-50",    iconText: "text-teal-500",    rowHover: "hover:bg-teal-50",    rowActive: "active:bg-teal-100"    },
  MTX_SURVEILLANCE:      { iconBg: "bg-violet-50",  iconText: "text-violet-500",  rowHover: "hover:bg-violet-50",  rowActive: "active:bg-violet-100"  },
  VTE_RISK:              { iconBg: "bg-indigo-50",  iconText: "text-indigo-500",  rowHover: "hover:bg-indigo-50",  rowActive: "active:bg-indigo-100"  },
  // Consent by procedure ID
  SURG_MISC:             { iconBg: "bg-rose-50",    iconText: "text-rose-500",    rowHover: "hover:bg-rose-50",    rowActive: "active:bg-rose-100"    },
  MED_MISC:              { iconBg: "bg-pink-50",    iconText: "text-pink-500",    rowHover: "hover:bg-pink-50",    rowActive: "active:bg-pink-100"    },
  LAPAROSCOPY:           { iconBg: "bg-amber-50",   iconText: "text-amber-500",   rowHover: "hover:bg-amber-50",   rowActive: "active:bg-amber-100"   },
  // Default
  default:               { iconBg: "bg-gray-50",    iconText: "text-gray-500",    rowHover: "hover:bg-gray-50",    rowActive: "active:bg-gray-100"    },
};

function linkStyles(link) {
  if (link.type === "flowchart") return STYLES[link.gl] ?? STYLES.default;
  if (link.type === "calculator") return STYLES[link.id] ?? STYLES.default;
  if (link.type === "consent") return STYLES[link.id] ?? STYLES.default;
  if (link.type === "iol-prioritizer") return STYLES.GL861;
  return STYLES.default;
}

function FlowchartIcon({ className }) {
  return <span className={`text-base leading-none ${className}`}>⬡</span>;
}

function CalcIcon({ className }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function ConsentIcon({ className }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IOLIcon({ className }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h6" />
    </svg>
  );
}

export default function SeeAlso({ links, label = "See also", onNavigate }) {
  if (!links?.length || !onNavigate) return null;

  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-0.5">{label}</p>
      <div className="rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100">
        {links.map((link, i) => {
          const s = linkStyles(link);
          return (
            <button
              key={i}
              onClick={() => onNavigate(link)}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-white ${s.rowHover} ${s.rowActive} transition-colors text-left group`}
            >
              <div className={`w-8 h-8 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
                {link.type === "flowchart"       && <FlowchartIcon className={s.iconText} />}
                {link.type === "calculator"      && <CalcIcon      className={s.iconText} />}
                {link.type === "consent"         && <ConsentIcon   className={s.iconText} />}
                {link.type === "iol-prioritizer" && <IOLIcon       className={s.iconText} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">{link.label}</p>
                {link.sublabel && <p className="text-xs text-gray-400 mt-0.5">{link.sublabel}</p>}
              </div>
              <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm shrink-0">→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
