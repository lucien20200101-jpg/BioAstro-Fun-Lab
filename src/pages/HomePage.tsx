import { ToolEntryCard } from '../components/cards/ToolEntryCard';
import { SectionHeader } from '../components/layout/SectionHeader';
import { AstroOrbit } from '../components/visual/AstroOrbit';
import { CosmicBackground } from '../components/visual/CosmicBackground';
import { DnaHelixMark } from '../components/visual/DnaHelixMark';
import { TechGrid } from '../components/visual/TechGrid';
import { toolEntries } from '../data/toolEntries';

export function HomePage() {
  const bioTools = toolEntries.filter((item) => item.category === 'bio');
  const astroTools = toolEntries.filter((item) => item.category === 'astro');
  const bioAstroTools = toolEntries.filter((item) => item.category === 'bioastro');

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-cyan-300/30 bg-cosmic-panel/90 p-6 shadow-glow">
        <CosmicBackground />
        <TechGrid />
        <div className="relative z-10 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">生命 × 宇宙 · 趣味科学工具箱</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">BioAstro Fun Lab</h1>
          <p className="text-base text-cyan-100/90">把生物学与天文学的知识，做成可探索、可测验、可互动的小工具。</p>
          <p className="text-sm font-medium text-cosmic-bioGreen">从细胞到星球，把科学做成可以玩的工具</p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-emerald-300/30 bg-emerald-500/10 p-4 space-y-4">
        <DnaHelixMark />
        <SectionHeader title="BioFun：生命趣味馆" subtitle="探索细胞、DNA 与生物故事的趣味入口" />
        <div className="grid gap-4">{bioTools.map((tool) => <ToolEntryCard key={tool.id} tool={tool} />)}</div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-violet-300/30 bg-violet-500/10 p-4 space-y-4">
        <AstroOrbit />
        <SectionHeader title="AstroFun：宇宙趣味馆" subtitle="从行星、星座到宇宙尺度的探索入口" />
        <div className="grid gap-4">{astroTools.map((tool) => <ToolEntryCard key={tool.id} tool={tool} />)}</div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-cyan-300/30 bg-cyan-500/10 p-4 space-y-4">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-cyan-200/10 to-transparent" aria-hidden />
        <SectionHeader title="BioAstro：生命与宇宙交叉馆" subtitle="连接生命科学与宇宙探索的交叉主题" />
        <div className="grid gap-4">{bioAstroTools.map((tool) => <ToolEntryCard key={tool.id} tool={tool} />)}</div>
      </section>
    </>
  );
}
