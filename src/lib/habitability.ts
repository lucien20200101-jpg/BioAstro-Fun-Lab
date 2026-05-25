export interface WorldProfile {
  id: string;
  name: string;
  system?: string;
  worldType?: string;
  environmentType?: string;
  water?: string;
  energy?: string;
  organics?: string;
  atmosphere?: string;
  radiation?: string;
  stability?: string;
  risks?: string[];
  possibleLife?: string;
  detectionAdvice?: string;
  lifePotentialScore?: number;
  enabled?: boolean;
}

export interface HabitabilityRule {
  id: string;
  factor: string;
  condition: string;
  score: number;
  explanation?: string;
  enabled?: boolean;
}

export type LevelLabel = '低' | '中' | '较高' | '高';

export interface HabitabilityInput {
  hasLiquidWater: boolean;
  hasStableAtmosphere: boolean;
  hasMagneticField: boolean;
  moderateTemperature: boolean;
  radiationIntensity: 'low' | 'medium' | 'high';
  tidalLocked: boolean;
  geologicalActivity: boolean;
  stableEnergySource: boolean;
  hasOrganics: boolean;
  environmentStability: 'low' | 'medium' | 'high';
  detectionDifficulty: 'easy' | 'medium' | 'hard';
}

export interface MatchedRule {
  rule: HabitabilityRule;
  matched: boolean;
  impact: number;
  reason: string;
}

export interface HabitabilityResult {
  score: number;
  level: LevelLabel;
  advantages: string[];
  risks: string[];
  possibleLifeType: string;
  detectionAdvice: string[];
  matchedRules: MatchedRule[];
  explanation: string;
}

const LOW_WORDS = ['稀薄', '极稀薄', '低', '无'];
const HIGH_WORDS = ['强', '高', '剧烈'];

const includesAny = (text: string, words: string[]) => words.some((word) => text.includes(word));

export function normalizeWorldToHabitabilityInput(world: WorldProfile): HabitabilityInput {
  const water = world.water ?? '';
  const atmosphere = world.atmosphere ?? '';
  const radiation = world.radiation ?? '';
  const environmentType = world.environmentType ?? '';
  const energy = world.energy ?? '';
  const organics = world.organics ?? '';
  const stability = world.stability ?? '';

  return {
    hasLiquidWater: water.includes('液态') || water.includes('海洋') || water.includes('水'),
    hasStableAtmosphere: !includesAny(atmosphere, LOW_WORDS),
    hasMagneticField: atmosphere.includes('屏蔽') || radiation.includes('屏蔽') || radiation.includes('较低'),
    moderateTemperature: !environmentType.includes('low') && !environmentType.includes('cold') && !environmentType.includes('严苛'),
    radiationIntensity: includesAny(radiation, HIGH_WORDS) ? 'high' : radiation.includes('较低') ? 'low' : 'medium',
    tidalLocked: energy.includes('潮汐') || environmentType.includes('tidal'),
    geologicalActivity: energy.includes('热液') || energy.includes('地化') || stability.includes('活动'),
    stableEnergySource: energy.length > 0 && !energy.includes('待确认'),
    hasOrganics: organics.includes('有机'),
    environmentStability: stability.includes('稳定') ? 'high' : stability.includes('不确定') ? 'low' : 'medium',
    detectionDifficulty: world.worldType?.includes('moon') || world.worldType?.includes('sub-neptune') ? 'hard' : 'medium',
  };
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getHabitabilityLevel(score: number): LevelLabel {
  if (score >= 80) return '高';
  if (score >= 60) return '较高';
  if (score >= 40) return '中';
  return '低';
}

export function getHabitabilityAdvantages(input: HabitabilityInput, matchedRules: MatchedRule[]): string[] {
  const advantages = matchedRules.filter((item) => item.matched).map((item) => `${item.rule.factor}：${item.reason}`);
  if (input.hasMagneticField) advantages.push('存在一定屏蔽条件，可能降低高能粒子影响。');
  if (input.geologicalActivity) advantages.push('地质或潮汐活动可能提供持续化学能。');
  return Array.from(new Set(advantages)).slice(0, 5);
}

export function getHabitabilityRisks(input: HabitabilityInput, matchedRules: MatchedRule[]): string[] {
  const risks = matchedRules.filter((item) => !item.matched).map((item) => `${item.rule.factor}不足：${item.reason}`);
  if (input.radiationIntensity === 'high') risks.push('高辐射环境可能破坏复杂有机分子。');
  if (!input.hasStableAtmosphere) risks.push('大气不稳定或过于稀薄，会降低表层宜居潜力。');
  if (input.detectionDifficulty === 'hard') risks.push('当前探测难度较高，推测结论有待更多任务验证。');
  return Array.from(new Set(risks)).slice(0, 6);
}

export function inferPossibleLifeType(input: HabitabilityInput, score: number): string {
  if (score >= 75 && input.hasLiquidWater) return '可能存在微生物级生命候选，需原位探测进一步验证。';
  if (score >= 55 && input.hasOrganics) return '可能存在前生命化学体系或间歇性微生物生态位。';
  return '目前更可能处于前生物化学阶段，生命存在性仍是推测。';
}

export function buildDetectionAdvice(input: HabitabilityInput, world?: WorldProfile): string[] {
  const advice = [
    '优先关注水-能量-有机物三要素的联动观测。',
    '建议进行多波段重复观测，并结合独立模型交叉验证。',
  ];
  if (input.hasLiquidWater) advice.push('可优先设计地下/冰下环境取样策略。');
  if (input.radiationIntensity === 'high') advice.push('需增强辐射屏蔽并提高样本污染控制等级。');
  if (world?.detectionAdvice) advice.push(`档案建议：${world.detectionAdvice}`);
  return advice.slice(0, 5);
}

export function formatHabitabilityReport(result: HabitabilityResult): string {
  return [
    `宜居性评分：${result.score}/100（${result.level}）`,
    `主要优势：${result.advantages.join('；') || '暂无明显优势'}`,
    `主要风险：${result.risks.join('；') || '暂无明显风险'}`,
    `可能生命类型：${result.possibleLifeType}`,
    `探测建议：${result.detectionAdvice.join('；')}`,
    '免责声明：该结果基于简化规则的科普推理，不代表真实天体生命结论。',
  ].join('\n');
}

export function calculateHabitabilityScore(input: HabitabilityInput, rules: HabitabilityRule[]): HabitabilityResult {
  const enabledRules = rules.filter((rule) => rule.enabled !== false);
  const matchedRules = enabledRules.map((rule): MatchedRule => {
    const factor = rule.factor;
    let matched = false;
    let reason = '当前条件未满足该因子。';

    if (factor.includes('液态水')) {
      matched = input.hasLiquidWater;
      reason = input.hasLiquidWater ? '具备潜在液态水线索。' : '缺少明确液态水条件。';
    } else if (factor.includes('能量')) {
      matched = input.stableEnergySource;
      reason = matched ? '存在相对稳定能量来源。' : '能量来源不稳定或证据不足。';
    } else if (factor.includes('有机')) {
      matched = input.hasOrganics;
      reason = matched ? '检测到或推测存在有机物。' : '缺少有机物证据。';
    } else if (factor.includes('大气') || factor.includes('屏蔽')) {
      matched = input.hasStableAtmosphere || input.hasMagneticField;
      reason = matched ? '存在一定环境屏蔽条件。' : '大气/磁场屏蔽不足。';
    } else if (factor.includes('稳定')) {
      matched = input.environmentStability !== 'low' && !input.tidalLocked;
      reason = matched ? '环境波动处于可讨论范围。' : '环境长期稳定性不足。';
    }

    return {
      rule,
      matched,
      impact: matched ? rule.score : 0,
      reason,
    };
  });

  let score = matchedRules.reduce((acc, item) => acc + item.impact, 0);
  if (input.radiationIntensity === 'high') score -= 12;
  if (input.moderateTemperature) score += 6;
  if (input.detectionDifficulty === 'hard') score -= 5;

  const finalScore = clampScore(score);
  const level = getHabitabilityLevel(finalScore);
  const advantages = getHabitabilityAdvantages(input, matchedRules);
  const risks = getHabitabilityRisks(input, matchedRules);
  const possibleLifeType = inferPossibleLifeType(input, finalScore);
  const detectionAdvice = buildDetectionAdvice(input);

  return {
    score: finalScore,
    level,
    advantages,
    risks,
    possibleLifeType,
    detectionAdvice,
    matchedRules,
    explanation: '评分由启用规则、环境修正项与风险扣分共同组成，属于基于简化条件的科普推理。',
  };
}
