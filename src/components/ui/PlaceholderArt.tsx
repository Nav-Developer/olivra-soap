export default function PlaceholderArt({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-yellow/50 via-cream to-brand-red/25">
      <svg
        aria-hidden
        viewBox="0 0 120 120"
        className="w-1/3 max-w-[8rem] text-brand-red"
        fill="none"
      >
        <path
          d="M18 102 C18 52 58 20 104 18 C104 72 70 104 18 102 Z"
          fill="currentColor"
        />
        <path
          d="M22 98 L84 40"
          stroke="#F4F8EA"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-brand-red">
          {label}
        </span>
      )}
    </div>
  );
}
