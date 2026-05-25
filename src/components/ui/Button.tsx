import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg border border-cosmic-nebulaPurple/40 bg-cosmic-nebulaPurple/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-cosmic-nebulaPurple/30 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
