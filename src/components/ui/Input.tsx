import type { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="w-full rounded-lg border border-cosmic-bioBlue/40 bg-black/20 px-3 py-2 text-sm" {...props} />;
}
