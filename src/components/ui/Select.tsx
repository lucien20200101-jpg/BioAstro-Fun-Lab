import type { SelectHTMLAttributes } from 'react';

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="w-full rounded-lg border border-cosmic-bioBlue/40 bg-black/20 px-3 py-2 text-sm" {...props} />;
}
