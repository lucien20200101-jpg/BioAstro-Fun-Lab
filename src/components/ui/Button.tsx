import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`min-h-11 rounded-xl border border-cosmic-nebulaPurple/40 bg-cosmic-nebulaPurple/20 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cosmic-nebulaPurple/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
