import { useState } from "react";
import { ROLES } from "../utils/constants";
import {
  listPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  roleLabel,
} from "../utils/portfolios";

const CHIP = "py-2 px-3 rounded-lg text-xs font-bold border transition-colors";
const CHIP_ON = "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white";
const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";

function PortfolioForm({ initialName = "", initialRole = null, submitLabel, onSubmit, onCancel }) {
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState(initialRole);
  const [showRole, setShowRole] = useState(Boolean(initialRole));

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit({ name: trimmed, role });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600 mb-1.5 block">
          Your name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoFocus
          placeholder="First name is enough"
          className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
        />
        <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1.5">
          Stored on this device only. Use a first name, not a patient identifier.
        </p>
      </div>

      {!showRole ? (
        <button
          type="button"
          onClick={() => setShowRole(true)}
          className="text-left text-sm font-medium text-amber-700 dark:text-amber-400"
        >
          + Add role (optional)
        </button>
      ) : (
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600 mb-2">
            Role <span className="font-normal normal-case">(optional)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(role === r.key ? null : r.key)}
                className={`${CHIP} ${role === r.key ? CHIP_ON : CHIP_OFF}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={!name.trim()}
          className="flex-1 py-3.5 rounded-xl bg-gray-900 dark:bg-white disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white dark:text-gray-950 disabled:text-gray-400 text-sm font-bold active:scale-[0.98] transition-all"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

export default function PortfolioScreen({ mode = "pick", activeId, onSelect, onBack }) {
  const [portfolios, setPortfolios] = useState(listPortfolios);
  const [formMode, setFormMode] = useState(mode === "create" ? "create" : null);
  const [editingId, setEditingId] = useState(null);

  const refresh = () => setPortfolios(listPortfolios());

  const handleCreate = ({ name, role }) => {
    const created = createPortfolio({ name, role });
    if (!created) return;
    onSelect(created);
  };

  const handleUpdate = (id, { name, role }) => {
    const updated = updatePortfolio(id, { name, role });
    if (!updated) return;
    refresh();
    setEditingId(null);
    if (id === activeId) onSelect(updated);
  };

  const handleDelete = (id) => {
    if (portfolios.length <= 1) return;
    if (!window.confirm("Delete this portfolio? Its job list will be removed from this device.")) return;
    deletePortfolio(id);
    refresh();
    if (id === activeId) {
      const next = listPortfolios()[0] ?? null;
      if (next) onSelect(next);
      else onBack?.();
    }
  };

  const editing = editingId ? portfolios.find((p) => p.id === editingId) : null;

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-950 flex flex-col px-5"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        {onBack && (
          <button onClick={onBack} className="text-gray-500 text-xl leading-none" aria-label="Back">
            ←
          </button>
        )}
        <div>
          <div className="font-extrabold text-lg text-gray-900 dark:text-white">
            {formMode === "create" ? "New portfolio" : editing ? "Edit portfolio" : "Portfolios"}
          </div>
          {!formMode && !editing && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Each person gets their own list on this phone.
            </p>
          )}
        </div>
      </div>

      {formMode === "create" && (
        <PortfolioForm
          submitLabel="Create"
          onSubmit={handleCreate}
          onCancel={portfolios.length > 0 ? () => setFormMode(null) : undefined}
        />
      )}

      {editing && (
        <PortfolioForm
          initialName={editing.name}
          initialRole={editing.role}
          submitLabel="Save"
          onSubmit={(data) => handleUpdate(editing.id, data)}
          onCancel={() => setEditingId(null)}
        />
      )}

      {!formMode && !editing && (
        <>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
            {portfolios.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-8">
                No portfolios yet. Add one to get started.
              </p>
            )}
            {portfolios.map((p) => {
              const label = roleLabel(p.role);
              const open = p.jobs.filter((j) => !j.done).length;
              const isActive = p.id === activeId;
              return (
                <div
                  key={p.id}
                  className={`rounded-xl border px-3 py-3 ${
                    isActive
                      ? "border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
                      : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => onSelect(p)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-gray-900 dark:text-white">{p.name}</span>
                        {label && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-gray-200/80 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                            {label}
                          </span>
                        )}
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {open > 0 ? `${open} open job${open === 1 ? "" : "s"}` : "No open jobs"}
                        {p.shift?.type ? ` · ${p.shift.type} shift` : ""}
                      </p>
                    </button>
                    <button
                      onClick={() => setEditingId(p.id)}
                      className="shrink-0 text-xs font-bold text-gray-500 dark:text-gray-400 px-2 py-1"
                    >
                      Edit
                    </button>
                    {portfolios.length > 1 && (
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="shrink-0 text-xs font-bold text-red-600 dark:text-red-400 px-2 py-1"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setFormMode("create")}
            className="w-full py-3.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300"
          >
            + New portfolio
          </button>
        </>
      )}
    </div>
  );
}
