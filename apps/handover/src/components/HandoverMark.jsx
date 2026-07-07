export function ExchangeArrowIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 7h10l-3-3" />
      <path d="M17 17H7l3 3" />
    </svg>
  );
}

export default function HandoverMark({ className = "" }) {
  return (
    <span className={className}>
      Handover
      <ExchangeArrowIcon className="inline-block w-[0.78em] h-[0.78em] ml-0.5 -mb-px text-claude-600" />
    </span>
  );
}
