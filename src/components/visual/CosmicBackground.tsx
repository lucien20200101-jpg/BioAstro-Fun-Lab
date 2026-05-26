export function CosmicBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
      <div className="absolute -left-8 top-6 h-32 w-32 rounded-full bg-cosmic-nebula/30 blur-2xl" />
      <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-cosmic-bioBlue/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_50%)]" />
    </div>
  );
}
