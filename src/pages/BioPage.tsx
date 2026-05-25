import { ToolEntryCard } from '../components/cards/ToolEntryCard';
import { SectionHeader } from '../components/layout/SectionHeader';
import { toolEntries } from '../data/toolEntries';

export function BioPage() {
  const tools = toolEntries.filter((item) => item.category === 'bio');
  return (
    <section className="space-y-3">
      <SectionHeader title="生物馆" subtitle="BioFun 工具入口" />
      <div className="grid gap-3">{tools.map((tool) => <ToolEntryCard key={tool.id} tool={tool} />)}</div>
    </section>
  );
}
