import { ToolEntryCard } from '../components/cards/ToolEntryCard';
import { SectionHeader } from '../components/layout/SectionHeader';
import { toolEntries } from '../data/toolEntries';

export function AstroPage() {
  const tools = toolEntries.filter((item) => item.category === 'astro');
  return (
    <section className="space-y-3">
      <SectionHeader title="宇宙馆" subtitle="AstroFun 工具入口" />
      <div className="grid gap-3">{tools.map((tool) => <ToolEntryCard key={tool.id} tool={tool} />)}</div>
    </section>
  );
}
