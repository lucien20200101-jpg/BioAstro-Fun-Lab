export function TechGrid() {
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full opacity-25" preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id="tech-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#tech-grid)" className="text-cyan-200" />
    </svg>
  );
}
