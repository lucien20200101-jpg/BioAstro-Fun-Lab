import astroConstellations from '../data/astro/constellations.json';
import astroFacts from '../data/astro/facts.json';
import astroPlanets from '../data/astro/planets.json';
import astroScaleItems from '../data/astro/scale_items.json';
import bioConcepts from '../data/bio/concepts.json';
import bioCellStory from '../data/bio/cell_story.json';
import bioDnaCases from '../data/bio/dna_cases.json';
import bioFacts from '../data/bio/facts.json';
import bioOrganelles from '../data/bio/organelles.json';
import bioastroHabitabilityRules from '../data/bioastro/habitability_rules.json';
import bioastroLifeScenarios from '../data/bioastro/life_scenarios.json';
import bioastroWorlds from '../data/bioastro/worlds.json';
import planetQuiz from '../data/quizzes/planet_quiz.json';
import organelleQuiz from '../data/quizzes/organelle_quiz.json';
import type { DatasetKey, DatasetMeta } from '../types/dataset';

const registry: Record<DatasetKey, DatasetMeta> = {
  'bio.facts': {
    datasetKey: 'bio.facts', label: '生物冷知识', category: 'bio', description: '生物冷知识条目', defaultData: bioFacts as unknown[], itemNameField: 'title', supportsEnabled: true, supportsCategory: true,
  },
  'bio.concepts': {
    datasetKey: 'bio.concepts', label: '生物概念卡片', category: 'bio', description: '生物概念解释内容', defaultData: bioConcepts as unknown[], itemNameField: 'name', supportsEnabled: true, supportsCategory: true,
  },
  'bio.organelles': {
    datasetKey: 'bio.organelles', label: '细胞器角色', category: 'bio', description: '细胞器角色化数据集', defaultData: bioOrganelles as unknown[], itemNameField: 'name', supportsEnabled: true,
  },
  'bio.dna_cases': {
    datasetKey: 'bio.dna_cases', label: 'DNA 案例', category: 'bio', description: 'DNA 推理案例数据', defaultData: bioDnaCases as unknown[], itemNameField: 'name', supportsEnabled: true,
  },
  'bio.cell_story': {
    datasetKey: 'bio.cell_story', label: '细胞剧情节点', category: 'bio', description: '细胞冒险剧情节点', defaultData: bioCellStory as unknown[], itemNameField: 'title',
  },
  'astro.facts': {
    datasetKey: 'astro.facts', label: '天文冷知识', category: 'astro', description: '天文冷知识条目', defaultData: astroFacts as unknown[], itemNameField: 'title', supportsEnabled: true, supportsCategory: true,
  },
  'astro.planets': {
    datasetKey: 'astro.planets', label: '星球档案', category: 'astro', description: '星球资料数据集', defaultData: astroPlanets as unknown[], itemNameField: 'name', supportsEnabled: true, supportsCategory: true,
  },
  'astro.constellations': {
    datasetKey: 'astro.constellations', label: '星座资料', category: 'astro', description: '星座内容数据集', defaultData: astroConstellations as unknown[], itemNameField: 'name', supportsEnabled: true,
  },
  'astro.scale_items': {
    datasetKey: 'astro.scale_items', label: '尺度比较项', category: 'astro', description: '宇宙尺度比较项目', defaultData: astroScaleItems as unknown[], itemNameField: 'name', supportsEnabled: true, supportsCategory: true,
  },
  'bioastro.habitability_rules': {
    datasetKey: 'bioastro.habitability_rules', label: '宜居性规则', category: 'bioastro', description: '生命宜居性评分规则', defaultData: bioastroHabitabilityRules as unknown[], itemNameField: 'factor', supportsEnabled: true,
  },
  'bioastro.worlds': {
    datasetKey: 'bioastro.worlds', label: '世界档案', category: 'bioastro', description: '候选世界与生命潜力数据', defaultData: bioastroWorlds as unknown[], itemNameField: 'name', supportsEnabled: true,
  },
  'bioastro.life_scenarios': {
    datasetKey: 'bioastro.life_scenarios', label: '生命情景', category: 'bioastro', description: '潜在生命情景数据', defaultData: bioastroLifeScenarios as unknown[], itemNameField: 'title', supportsEnabled: true,
  },
  'quizzes.organelle_quiz': {
    datasetKey: 'quizzes.organelle_quiz', label: '细胞器测验', category: 'quizzes', description: '细胞器趣味测试题', defaultData: organelleQuiz as unknown[], itemNameField: 'id',
  },
  'quizzes.planet_quiz': {
    datasetKey: 'quizzes.planet_quiz', label: '星球测验', category: 'quizzes', description: '星球趣味测试题', defaultData: planetQuiz as unknown[], itemNameField: 'id',
  },
};

export const datasetRegistry = registry;
export const datasetKeys = Object.keys(registry) as DatasetKey[];

export function getDatasetMeta(datasetKey: DatasetKey): DatasetMeta {
  return datasetRegistry[datasetKey];
}

export function getDefaultDataset<T = unknown>(datasetKey: DatasetKey): T[] {
  return [...datasetRegistry[datasetKey].defaultData] as T[];
}
