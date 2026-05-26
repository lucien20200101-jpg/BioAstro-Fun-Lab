import type { PropsWithChildren } from 'react';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl overflow-x-clip bg-transparent pb-28 sm:pb-32">
      <TopBar />
      <main className="mx-auto w-full max-w-5xl space-y-7 px-4 py-4 sm:px-6 lg:px-8">{children}</main>
      <BottomNav />
    </div>
  );
}
