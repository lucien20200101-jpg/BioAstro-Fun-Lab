export type ToolCategory = 'bio' | 'astro' | 'bioastro';

export type ToolEntry = {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  path: string;
  status: 'ready' | 'coming-soon';
};
