/** Self-dismissing confirmation (handover sent, jobs merged). */
export default function FeedbackToast({ message, elevated = false }) {
  if (!message) return null;
  return (
    <div
      key={message}
      role="status"
      aria-live="polite"
      className="fixed left-1/2 z-[70] max-w-[calc(100%-2rem)] bg-claude-600 text-white rounded-full px-4 py-2.5 shadow-lg text-sm font-semibold text-center animate-toast-enter motion-reduce:animate-none"
      style={{
        bottom: elevated
          ? "calc(env(safe-area-inset-bottom) + 5.5rem)"
          : "calc(env(safe-area-inset-bottom) + 1.25rem)",
      }}
    >
      {message}
    </div>
  );
}
