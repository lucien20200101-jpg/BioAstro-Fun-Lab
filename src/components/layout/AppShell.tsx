import type { PropsWithChildren } from 'react';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl overflow-x-clip bg-transparent pb-24">
      <TopBar />
      <main className="space-y-7 px-4 py-4 sm:px-5">{children}</main>
      <BottomNav />
    </div>
  );
}
