import { ToolEntryCard } from '../components/cards/ToolEntryCard';
import { SectionHeader } from '../components/layout/SectionHeader';
import { toolEntries } from '../data/toolEntries';

export function BioAstroPage() {
  const tools = toolEntries.filter((item) => item.category === 'bioastro');
  return (
    <section className="space-y-3">
      <SectionHeader title="交叉馆" subtitle="生命与宇宙交叉工具入口" />
      <div className="grid gap-3">{tools.map((tool) => <ToolEntryCard key={tool.id} tool={tool} />)}</div>
    </section>
  );
}
