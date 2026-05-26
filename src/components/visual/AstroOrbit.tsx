export function AstroOrbit() {
  return (
    <svg viewBox="0 0 140 140" className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 opacity-50" aria-hidden>
      <circle cx="70" cy="70" r="14" className="fill-violet-200/70" />
      <ellipse cx="70" cy="70" rx="45" ry="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-200" />
      <ellipse cx="70" cy="70" rx="24" ry="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-200/80" />
      <circle cx="108" cy="83" r="4" className="fill-cyan-200" />
    </svg>
  );
}
