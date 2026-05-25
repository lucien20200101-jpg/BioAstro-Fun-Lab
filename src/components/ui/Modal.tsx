import type { PropsWithChildren } from 'react';
import { Button } from './Button';

type ModalProps = PropsWithChildren<{ title: string; open: boolean; onClose: () => void }>;

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl bg-cosmic-panel p-4 shadow-glow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button onClick={onClose}>关闭</Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
