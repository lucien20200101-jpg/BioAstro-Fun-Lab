import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { RandomCardBox } from '../components/engines/RandomCardBox';

export function RandomBoxPage() {
  const location = useLocation();

  const config = useMemo(() => {
    if (location.pathname === '/bio/random-facts') {
      return {
        datasetKey: 'bio.facts' as const,
        title: '生物冷知识盲盒',
        subtitle: '从本地内容库中随机开启一条生物冷知识。',
        emptyText: '当前暂无可开启的生物冷知识，请先到管理页启用或补充内容。',
        accent: {
          border: 'border-emerald-400/50',
          glow: 'shadow-[0_0_24px_rgba(16,185,129,0.18)]',
          badge: 'bg-emerald-500/20 text-emerald-200',
          button: 'border-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/30',
        },
      };
    }

    return {
      datasetKey: 'astro.facts' as const,
      title: '今日宇宙盲盒',
      subtitle: '从本地内容库中随机开启一条宇宙趣味内容。',
      emptyText: '当前暂无可开启的宇宙冷知识，请先到管理页启用或补充内容。',
      accent: {
        border: 'border-violet-400/50',
        glow: 'shadow-[0_0_24px_rgba(167,139,250,0.2)]',
        badge: 'bg-indigo-500/25 text-indigo-200',
        button: 'border-violet-400/50 bg-violet-500/20 hover:bg-violet-500/30',
      },
    };
  }, [location.pathname]);

  return <RandomCardBox {...config} />;
}
