import { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { SectionHeader } from '../components/layout/SectionHeader';
import { useLocalDataset } from '../hooks/useLocalDataset';
import {
  buildDetectionAdvice,
  calculateHabitabilityScore,
  formatHabitabilityReport,
  normalizeWorldToHabitabilityInput,
  type HabitabilityInput,
  type HabitabilityRule,
  type WorldProfile,
} from '../lib/habitability';

const defaultInput: HabitabilityInput = {
  hasLiquidWater: false,
  hasStableAtmosphere: false,
  hasMagneticField: false,
  moderateTemperature: false,
  radiationIntensity: 'medium',
  tidalLocked: false,
  geologicalActivity: false,
  stableEnergySource: false,
  hasOrganics: false,
  environmentStability: 'medium',
  detectionDifficulty: 'medium',
};

export function HabitabilityPage() {
  const { data: rawRules } = useLocalDataset<HabitabilityRule>('bioastro.habitability_rules');
  const { data: rawWorlds } = useLocalDataset<WorldProfile>('bioastro.worlds');

  const rules = useMemo(() => rawRules.filter((item) => item.enabled !== false), [rawRules]);
  const worlds = useMemo(() => rawWorlds.filter((item) => item.enabled !== false), [rawWorlds]);

  const [selectedWorldId, setSelectedWorldId] = useState('');
  const [input, setInput] = useState<HabitabilityInput>(defaultInput);
  const [copyStatus, setCopyStatus] = useState('');

  const selectedWorld = useMemo(() => worlds.find((item) => item.id === selectedWorldId), [selectedWorldId, worlds]);

  useEffect(() => {
    if (!selectedWorld && worlds.length > 0) {
      setSelectedWorldId(worlds[0].id);
      setInput(normalizeWorldToHabitabilityInput(worlds[0]));
    }
  }, [selectedWorld, worlds]);

  const result = useMemo(() => {
    if (rules.length === 0) return null;
    return calculateHabitabilityScore(input, rules);
  }, [input, rules]);

  const detectionAdvice = useMemo(() => {
    if (!result) return [];
    return buildDetectionAdvice(input, selectedWorld);
  }, [input, result, selectedWorld]);

  const onWorldChange = (worldId: string) => {
    setSelectedWorldId(worldId);
    const world = worlds.find((item) => item.id === worldId);
    if (world) setInput(normalizeWorldToHabitabilityInput(world));
  };

  const copyReport = async () => {
    if (!result) return;
    const report = [
      `星球/卫星：${selectedWorld?.name ?? '自定义对象'}`,
      formatHabitabilityReport({ ...result, detectionAdvice }),
      '声明：以上内容仅用于科普推理，结论需后续探测验证。',
    ].join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(report);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = report;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopyStatus('复制成功，可分享给同伴继续讨论。');
    } catch {
      setCopyStatus('复制失败，请手动选择文本复制。');
    }
  };

  if (rules.length === 0 || worlds.length === 0) {
    return (
      <section className="space-y-4">
        <SectionHeader title="星球宜居性评分器" subtitle="基于简化规则进行科普推理" />
        <Card>
          <p className="text-sm text-cosmic-textMuted">当前评分规则或星球档案为空，请先在内容管理页补充并启用数据集。</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <SectionHeader title="星球宜居性评分器" subtitle="基于简化条件判断，结果仅供科普讨论" />

      <Card className="space-y-3">
        <h3 className="text-base font-semibold text-cosmic-starlight">预设星球/卫星选择区</h3>
        <Select value={selectedWorldId} onChange={(event) => onWorldChange(event.target.value)}>
          {worlds.map((world) => <option key={world.id} value={world.id}>{world.name}</option>)}
        </Select>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="relative space-y-3 overflow-hidden border border-cyan-500/30 bg-slate-950/70">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_45%),linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:auto,22px_22px,22px_22px]" />
          <div className="relative">
            <h3 className="font-semibold text-cyan-100">环境控制台参数面板</h3>
            <p className="text-xs text-cyan-200/80">简化模型输入模块（用于科普推测，不替代真实天体环境测量）。</p>
          </div>
          {[
            ['hasLiquidWater', '是否存在液态水'],
            ['hasStableAtmosphere', '是否存在稳定大气'],
            ['hasMagneticField', '是否存在磁场'],
            ['moderateTemperature', '温度是否适中'],
            ['tidalLocked', '是否潮汐锁定'],
            ['geologicalActivity', '是否有地质活动'],
            ['stableEnergySource', '是否有稳定能量来源'],
            ['hasOrganics', '是否存在有机物'],
          ].map(([key, label]) => (
            <label key={key} className="relative flex items-center justify-between gap-3 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-sm">
              <span>{label}</span>
              <input className="h-5 w-5 accent-emerald-400" type="checkbox" checked={input[key as keyof HabitabilityInput] as boolean} onChange={(e) => setInput((prev) => ({ ...prev, [key]: e.target.checked }))} />
            </label>
          ))}
          <label className="space-y-1 text-sm">
            <span>辐射强度</span>
            <Select value={input.radiationIntensity} onChange={(e) => setInput((prev) => ({ ...prev, radiationIntensity: e.target.value as HabitabilityInput['radiationIntensity'] }))}>
              <option value="low">低</option><option value="medium">中</option><option value="high">高</option>
            </Select>
          </label>
          <label className="space-y-1 text-sm">
            <span>环境稳定性</span>
            <Select value={input.environmentStability} onChange={(e) => setInput((prev) => ({ ...prev, environmentStability: e.target.value as HabitabilityInput['environmentStability'] }))}>
              <option value="low">低</option><option value="medium">中</option><option value="high">高</option>
            </Select>
          </label>
          <label className="space-y-1 text-sm">
            <span>探测难度</span>
            <Select value={input.detectionDifficulty} onChange={(e) => setInput((prev) => ({ ...prev, detectionDifficulty: e.target.value as HabitabilityInput['detectionDifficulty'] }))}>
              <option value="easy">低</option><option value="medium">中</option><option value="hard">高</option>
            </Select>
          </label>
        </Card>

        <Card className="relative space-y-3 overflow-hidden border border-violet-500/30 bg-slate-950/75">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.35),transparent_45%),repeating-linear-gradient(90deg,rgba(148,163,184,0.1)_0px,rgba(148,163,184,0.1)_1px,transparent_1px,transparent_8px)]" />
          <h3 className="relative font-semibold">评分结果区</h3>
          <div className="relative rounded-xl border border-cosmic-lifeGreen/40 bg-black/35 p-4 text-center shadow-[0_0_26px_rgba(74,222,128,0.25)]">
            <p className="text-xs uppercase tracking-[0.24em] text-cosmic-textMuted">Habitability Index</p>
            <p className="text-5xl font-black text-cosmic-lifeGreen">{result?.score ?? 0}<span className="text-base text-cosmic-textMuted">/100</span></p>
            <p className="mt-1 text-sm">等级：<span className="rounded-full border border-cosmic-starlight/30 bg-cosmic-nebulaPurple/20 px-2 py-1 font-semibold">{result?.level ?? '低'}</span></p>
          </div>
          <p className="relative rounded-lg border border-amber-300/40 bg-amber-500/10 p-2 text-sm text-amber-100">⚠ 本结果是简化模型推测，不代表确定结论；“可能存在生命”不等于“已经发现生命”，仍有待后续探测验证。</p>
          <p className="text-sm text-cosmic-textMuted">{result?.explanation}</p>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3">
              <p className="mb-1 text-sm font-medium text-emerald-200">主要优势</p>
              <ul className="list-disc pl-5 text-sm">{result?.advantages.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3">
              <p className="mb-1 text-sm font-medium text-rose-200">主要风险</p>
              <ul className="list-disc pl-5 text-sm">{result?.risks.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="rounded-lg border border-sky-400/30 bg-sky-500/10 p-3">
              <p className="mb-1 text-sm font-medium text-sky-200">生命可能性（推测）</p>
              <p className="text-sm">{result?.possibleLifeType}</p>
            </div>
            <div className="rounded-lg border border-violet-400/30 bg-violet-500/10 p-3">
              <p className="mb-1 text-sm font-medium text-violet-200">探测建议（待验证）</p>
              <ul className="list-disc pl-5 text-sm">{detectionAdvice.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
          <Button onClick={copyReport}>复制评分结果</Button>
          {copyStatus ? <p className="text-xs text-cosmic-starlight">{copyStatus}</p> : null}
        </Card>
      </div>

      <Card className="space-y-2">
        <h3 className="font-semibold">星球档案卡</h3>
        <p className="text-sm">名称：{selectedWorld?.name}</p>
        <p className="text-sm">所属天体系统：{selectedWorld?.system}</p>
        <p className="text-sm">天体类型：{selectedWorld?.worldType}</p>
        <p className="text-sm">环境类型：{selectedWorld?.environmentType}</p>
        <p className="text-sm">液态水条件：{selectedWorld?.water}</p>
        <p className="text-sm">能量来源：{selectedWorld?.energy}</p>
        <p className="text-sm">有机物条件：{selectedWorld?.organics}</p>
        <p className="text-sm">大气条件：{selectedWorld?.atmosphere}</p>
        <p className="text-sm">辐射风险：{selectedWorld?.radiation}</p>
        <p className="text-sm">环境稳定性：{selectedWorld?.stability}</p>
        <p className="text-sm">宜居性评分：{result?.score}</p>
        <p className="text-sm">可能生命类型：{result?.possibleLifeType}</p>
        <p className="text-sm break-words">探测建议：{detectionAdvice.join('；')}</p>
      </Card>

      <Card className="space-y-2">
        <h3 className="font-semibold">评分规则说明</h3>
        <ul className="space-y-2 text-sm">
          {result?.matchedRules.map((item) => (
            <li key={item.rule.id} className="rounded-lg border border-cosmic-nebulaPurple/40 bg-black/20 p-2">
              <p>{item.rule.factor}（{item.matched ? '命中' : '未命中'}，权重 {item.rule.score}）</p>
              <p className="text-cosmic-textMuted">条件：{item.rule.condition}</p>
              <p className="text-cosmic-textMuted">依据：{item.reason}</p>
            </li>
          ))}
        </ul>
        <p className="rounded-md border border-amber-300/40 bg-amber-500/10 px-2 py-1 text-xs text-amber-100">免责声明：本工具基于简化规则进行科普推理，涉及“可能/推测/有待验证”的结论，不构成专业天体生物学评估。</p>
      </Card>
    </section>
  );
}
