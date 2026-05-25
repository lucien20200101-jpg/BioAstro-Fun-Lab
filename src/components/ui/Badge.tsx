import type { PropsWithChildren } from 'react';

export function Badge({ children }: PropsWithChildren) {
  return <span className="inline-flex rounded-full bg-cosmic-bioGreen/20 px-2 py-1 text-xs text-cosmic-bioGreen">{children}</span>;
}
