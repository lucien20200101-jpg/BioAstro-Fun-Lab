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
        <Card className="space-y-3">
          <h3 className="font-semibold">环境条件设置区</h3>
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
            <label key={key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2 text-sm">
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

        <Card className="space-y-3">
          <h3 className="font-semibold">评分结果区</h3>
          <p className="text-3xl font-bold text-cosmic-lifeGreen">{result?.score ?? 0}<span className="text-base text-cosmic-textMuted">/100</span></p>
          <p className="text-sm">宜居性等级：<span className="font-semibold">{result?.level ?? '低'}</span></p>
          <p className="text-sm text-cosmic-textMuted">{result?.explanation}</p>
          <div>
            <p className="text-sm font-medium">主要优势</p>
            <ul className="list-disc pl-5 text-sm">{result?.advantages.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <p className="text-sm font-medium">主要风险</p>
            <ul className="list-disc pl-5 text-sm">{result?.risks.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <p className="text-sm">可能生命类型：{result?.possibleLifeType}</p>
          <div>
            <p className="text-sm font-medium">探测建议</p>
            <ul className="list-disc pl-5 text-sm">{detectionAdvice.map((item) => <li key={item}>{item}</li>)}</ul>
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
        <p className="text-xs text-cosmic-textMuted">免责声明：本工具是基于简化规则的科普推理，不是专业天体生物学评估模型，所有结论均有待探测验证。</p>
      </Card>
    </section>
  );
}
