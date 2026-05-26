import type { TextareaHTMLAttributes } from 'react';

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="w-full min-w-0 rounded-xl border border-cosmic-bioBlue/40 bg-black/20 px-3 py-2.5 font-mono text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70" {...props} />;
}
