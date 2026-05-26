import type { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full min-w-0 rounded-xl border border-cosmic-bioBlue/45 bg-[#070d1f]/85 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 shadow-inner shadow-black/25 transition duration-150 focus-visible:border-cyan-300/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/65 focus-visible:ring-offset-1 focus-visible:ring-offset-cosmic-bg disabled:cursor-not-allowed disabled:border-slate-600/50 disabled:opacity-55 aria-[invalid=true]:border-red-400/80 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-300/65 ${className}`.trim()}
      {...props}
    />
  );
}
