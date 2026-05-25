import { ToolEntryCard } from '../components/cards/ToolEntryCard';
import { SectionHeader } from '../components/layout/SectionHeader';
import { toolEntries } from '../data/toolEntries';

export function HomePage() {
  const bioTools = toolEntries.filter((item) => item.category === 'bio');
  const astroTools = toolEntries.filter((item) => item.category === 'astro');
  const bioAstroTools = toolEntries.filter((item) => item.category === 'bioastro');

  return (
    <>
      <section className="space-y-3">
        <SectionHeader title="BioFun：生命趣味馆" subtitle="探索细胞、DNA 与生物故事的趣味入口" />
        <div className="grid gap-3">{bioTools.map((tool) => <ToolEntryCard key={tool.id} tool={tool} />)}</div>
      </section>
      <section className="space-y-3">
        <SectionHeader title="AstroFun：宇宙趣味馆" subtitle="从行星、星座到宇宙尺度的探索入口" />
        <div className="grid gap-3">{astroTools.map((tool) => <ToolEntryCard key={tool.id} tool={tool} />)}</div>
      </section>
      <section className="space-y-3">
        <SectionHeader title="BioAstro：生命与宇宙交叉馆" subtitle="连接生命科学与宇宙探索的交叉主题" />
        <div className="grid gap-3">{bioAstroTools.map((tool) => <ToolEntryCard key={tool.id} tool={tool} />)}</div>
      </section>
    </>
  );
}
