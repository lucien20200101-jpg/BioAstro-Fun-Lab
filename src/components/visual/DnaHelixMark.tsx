export function DnaHelixMark() {
  return (
    <svg viewBox="0 0 120 120" className="pointer-events-none absolute -right-5 -bottom-8 h-28 w-28 opacity-45" aria-hidden>
      <path d="M20 10 C70 30, 50 90, 100 110" stroke="currentColor" strokeWidth="3" fill="none" className="text-emerald-200" />
      <path d="M100 10 C50 30, 70 90, 20 110" stroke="currentColor" strokeWidth="3" fill="none" className="text-sky-200" />
      <path d="M35 28 L85 28 M30 48 L90 48 M30 68 L90 68 M35 88 L85 88" stroke="currentColor" strokeWidth="2" className="text-emerald-100/80" />
    </svg>
  );
}
