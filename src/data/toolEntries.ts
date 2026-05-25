import type { ToolEntry } from '../types/tool';

export const toolEntries: ToolEntry[] = [
  { id: 'bio-trivia-box', title: '生物冷知识盲盒', description: '随机探索一条有趣的生物知识。', category: 'bio', path: '/bio/random-facts' },
  { id: 'cell-organelle-type', title: '今天你是哪种细胞器', description: '用轻问答匹配你的细胞器人格。', category: 'bio', path: '/tools/cell-organelle-type' },
  { id: 'dna-translator', title: 'DNA 密码翻译器', description: '查看 DNA 与蛋白质编码的可视化入口。', category: 'bio', path: '/tools/dna-translator' },
  { id: 'bio-card-generator', title: '生物概念卡片生成器', description: '将生物概念转为结构化记忆卡片。', category: 'bio', path: '/tools/bio-card-generator' },
  { id: 'organelle-theater', title: '细胞器拟人化小剧场', description: '细胞器角色剧情入口（开发中）。', category: 'bio', path: '/tools/organelle-theater' },
  { id: 'cell-day-story', title: '一个细胞的一天', description: '以时间线方式浏览细胞活动。', category: 'bio', path: '/tools/cell-day-story' },

  { id: 'cosmic-blind-box', title: '今日宇宙盲盒', description: '每日一条宇宙趣味内容入口。', category: 'astro', path: '/astro/random-facts' },
  { id: 'planet-personality', title: '你是哪颗行星', description: '轻测试匹配你的行星风格。', category: 'astro', path: '/tools/planet-personality' },
  { id: 'constellation-card', title: '星座故事卡片生成器', description: '把星座故事生成为卡片模板。', category: 'astro', path: '/tools/constellation-card' },
  { id: 'cosmic-scale-ruler', title: '宇宙尺度滑尺', description: '以尺度滑动查看宇宙层级。', category: 'astro', path: '/tools/cosmic-scale-ruler' },

  { id: 'habitability-scorer', title: '星球宜居性评分器', description: '基于参数展示宜居性评分框架。', category: 'bioastro', path: '/tools/habitability-scorer' },
  { id: 'alien-life-finder', title: '外星生命可能在哪里', description: '探索潜在生命环境的资料入口。', category: 'bioastro', path: '/tools/alien-life-finder' },
];
