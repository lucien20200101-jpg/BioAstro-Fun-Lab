export const DATASET_KEYS = [
  'bio.facts',
  'bio.concepts',
  'bio.organelles',
  'bio.dna_cases',
  'bio.cell_story',
  'astro.facts',
  'astro.planets',
  'astro.constellations',
  'astro.scale_items',
  'bioastro.habitability_rules',
  'bioastro.worlds',
  'bioastro.life_scenarios',
  'quizzes.organelle_quiz',
  'quizzes.planet_quiz',
] as const;

export type DatasetKey = (typeof DATASET_KEYS)[number];

export interface DatasetMeta {
  datasetKey: DatasetKey;
  label: string;
  category: 'bio' | 'astro' | 'bioastro' | 'quizzes';
  description: string;
  defaultData: unknown[];
  itemNameField?: 'id' | 'name' | 'title' | 'factor';
  supportsEnabled?: boolean;
  supportsCategory?: boolean;
}

export interface LocalDatasetState<T> {
  data: T[];
  isUsingLocalData: boolean;
  error: string | null;
}
