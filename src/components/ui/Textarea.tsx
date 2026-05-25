import type { TextareaHTMLAttributes } from 'react';

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="w-full rounded-lg border border-cosmic-bioBlue/40 bg-black/20 px-3 py-2 text-sm" {...props} />;
}
