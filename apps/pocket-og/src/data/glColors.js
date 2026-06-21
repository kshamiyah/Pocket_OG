// Single source of truth for all guideline colour tokens.
// badge        — light pill background + text (no border)
// border       — border class to pair with badge when needed
// conditionColor — coloured text for condition/setting labels
// icon         — text colour for the GL code in list views
// accent       — solid bg for accent bars in cards
// solid        — solid bg for primary buttons
// solidHover   — hover modifier for solid buttons
export const GL_COLORS = {
  GL861:    { badge: "bg-teal-50 text-teal-700",      border: "border-teal-100",     conditionColor: "text-teal-500",     icon: "text-teal-400",     accent: "bg-teal-400",     solid: "bg-teal-600",     solidHover: "hover:bg-teal-700"     },
  GL952:    { badge: "bg-blue-50 text-blue-700",      border: "border-blue-100",     conditionColor: "text-blue-500",     icon: "text-blue-400",     accent: "bg-blue-400",     solid: "bg-blue-600",     solidHover: "hover:bg-blue-700"     },
  GL891:    { badge: "bg-indigo-50 text-indigo-700",  border: "border-indigo-100",   conditionColor: "text-indigo-500",   icon: "text-indigo-400",   accent: "bg-indigo-400",   solid: "bg-indigo-500",   solidHover: "hover:bg-indigo-600"   },
  GL983:    { badge: "bg-pink-50 text-pink-700",      border: "border-pink-100",     conditionColor: "text-pink-500",     icon: "text-pink-400",     accent: "bg-pink-400",     solid: "bg-pink-500",     solidHover: "hover:bg-pink-600"     },
  GL880:    { badge: "bg-yellow-50 text-yellow-700",  border: "border-yellow-100",   conditionColor: "text-yellow-600",   icon: "text-yellow-500",   accent: "bg-yellow-400",   solid: "bg-yellow-500",   solidHover: "hover:bg-yellow-600"   },
  GL787:    { badge: "bg-emerald-50 text-emerald-700",border: "border-emerald-100",  conditionColor: "text-emerald-500",  icon: "text-emerald-500",  accent: "bg-emerald-400",  solid: "bg-emerald-600",  solidHover: "hover:bg-emerald-700"  },
  GL783:    { badge: "bg-amber-50 text-amber-700",    border: "border-amber-100",    conditionColor: "text-amber-500",    icon: "text-amber-500",    accent: "bg-amber-400",    solid: "bg-amber-500",    solidHover: "hover:bg-amber-600"    },
  GL895:    { badge: "bg-sky-50 text-sky-700",        border: "border-sky-100",      conditionColor: "text-sky-500",      icon: "text-sky-400",      accent: "bg-sky-400",      solid: "bg-sky-500",      solidHover: "hover:bg-sky-600"      },
  CG565:    { badge: "bg-violet-50 text-violet-700",  border: "border-violet-100",   conditionColor: "text-violet-500",   icon: "text-violet-400",   accent: "bg-violet-400",   solid: "bg-violet-600",   solidHover: "hover:bg-violet-700"   },
  CG621:    { badge: "bg-rose-50 text-rose-700",      border: "border-rose-100",     conditionColor: "text-rose-500",     icon: "text-rose-400",     accent: "bg-rose-400",     solid: "bg-rose-600",     solidHover: "hover:bg-rose-700"     },
  CG623:    { badge: "bg-orange-50 text-orange-700",  border: "border-orange-100",   conditionColor: "text-orange-500",   icon: "text-orange-400",   accent: "bg-orange-400",   solid: "bg-orange-500",   solidHover: "hover:bg-orange-600"   },
  QS46:     { badge: "bg-cyan-50 text-cyan-700",      border: "border-cyan-100",     conditionColor: "text-cyan-500",     icon: "text-cyan-400",     accent: "bg-cyan-400",     solid: "bg-cyan-500",     solidHover: "hover:bg-cyan-600"     },
  QS22:     { badge: "bg-lime-50 text-lime-700",      border: "border-lime-100",     conditionColor: "text-lime-600",     icon: "text-lime-500",     accent: "bg-lime-400",     solid: "bg-lime-500",     solidHover: "hover:bg-lime-600"     },
  GTG57:    { badge: "bg-red-50 text-red-700",        border: "border-red-100",      conditionColor: "text-red-500",      icon: "text-red-500",      accent: "bg-red-500",      solid: "bg-red-500",      solidHover: "hover:bg-red-600"      },
  GTG52:    { badge: "bg-red-50 text-red-700",        border: "border-red-100",      conditionColor: "text-red-500",      icon: "text-red-500",      accent: "bg-red-400",      solid: "bg-red-600",      solidHover: "hover:bg-red-700"      },
  GTG63:    { badge: "bg-purple-50 text-purple-700",  border: "border-purple-100",   conditionColor: "text-purple-500",   icon: "text-purple-500",   accent: "bg-purple-500",   solid: "bg-purple-600",   solidHover: "hover:bg-purple-700"   },
  GTG67:    { badge: "bg-green-50 text-green-700",    border: "border-green-100",    conditionColor: "text-green-500",    icon: "text-green-500",    accent: "bg-green-400",    solid: "bg-green-600",    solidHover: "hover:bg-green-700"    },
  GTG31:    { badge: "bg-green-50 text-green-700",    border: "border-green-100",    conditionColor: "text-green-500",    icon: "text-green-500",    accent: "bg-green-400",    solid: "bg-green-600",    solidHover: "hover:bg-green-700"    },
  GTG17:    { badge: "bg-violet-50 text-violet-700",  border: "border-violet-100",   conditionColor: "text-violet-500",   icon: "text-violet-400",   accent: "bg-violet-400",   solid: "bg-violet-600",   solidHover: "hover:bg-violet-700"   },
  GTG69:    { badge: "bg-orange-50 text-orange-700",  border: "border-orange-100",   conditionColor: "text-orange-500",   icon: "text-orange-400",   accent: "bg-orange-400",   solid: "bg-orange-500",   solidHover: "hover:bg-orange-600"   },
  NG88:     { badge: "bg-fuchsia-50 text-fuchsia-700",border: "border-fuchsia-100",  conditionColor: "text-fuchsia-500",  icon: "text-fuchsia-500",  accent: "bg-fuchsia-400",  solid: "bg-fuchsia-600",  solidHover: "hover:bg-fuchsia-700"  },
  NG25:     { badge: "bg-sky-50 text-sky-700",        border: "border-sky-100",      conditionColor: "text-sky-500",      icon: "text-sky-400",      accent: "bg-sky-400",      solid: "bg-sky-600",      solidHover: "hover:bg-sky-700"      },
  NG133:    { badge: "bg-cyan-50 text-cyan-700",      border: "border-cyan-100",     conditionColor: "text-cyan-600",     icon: "text-cyan-500",     accent: "bg-cyan-500",     solid: "bg-cyan-600",     solidHover: "hover:bg-cyan-700"     },
  NHSCSP20: { badge: "bg-slate-50 text-slate-700",    border: "border-slate-100",    conditionColor: "text-slate-500",    icon: "text-slate-500",    accent: "bg-slate-400",    solid: "bg-slate-600",    solidHover: "hover:bg-slate-700"    },
  CG192:    { badge: "bg-purple-50 text-purple-700",  border: "border-purple-100",   conditionColor: "text-purple-500",   icon: "text-purple-500",   accent: "bg-purple-500",   solid: "bg-purple-600",   solidHover: "hover:bg-purple-700"   },
};

export const DEFAULT_GL_COLORS = {
  badge: "bg-gray-100 text-gray-600",
  border: "border-gray-200",
  conditionColor: "text-gray-400",
  icon: "text-gray-400",
  accent: "bg-gray-300",
  solid: "bg-gray-500",
  solidHover: "hover:bg-gray-600",
};

export function glColors(gl) {
  return GL_COLORS[gl] ?? DEFAULT_GL_COLORS;
}
