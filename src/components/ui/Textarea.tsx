import type { TextareaHTMLAttributes } from 'react';

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full min-h-0 rounded-xl border border-cosmic-bioBlue/40 bg-[#070d1f]/85 px-3 py-2.5 font-mono text-sm text-slate-100 placeholder:text-slate-400 shadow-inner shadow-black/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-bioBlue/70 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
