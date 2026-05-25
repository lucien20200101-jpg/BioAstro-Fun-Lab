import type { PropsWithChildren } from 'react';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-transparent pb-20">
      <TopBar />
      <main className="space-y-6 px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}
