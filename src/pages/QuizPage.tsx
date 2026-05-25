import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { QuizEngine } from '../components/engines/QuizEngine';

export function QuizPage() {
  const location = useLocation();

  const config = useMemo(() => {
    if (location.pathname === '/bio/organelle-quiz') {
      return {
        questionDatasetKey: 'quizzes.organelle_quiz' as const,
        resultDatasetKey: 'bio.organelles' as const,
        title: '今天你是哪种细胞器',
        subtitle: '用几道轻问答看看你更像哪类细胞器角色。',
        resultType: '细胞器',
        emptyText: '当前测试题或结果库为空，请先到管理页补充并启用数据。',
        accent: {
          border: 'border-emerald-400/50',
          glow: 'shadow-[0_0_24px_rgba(16,185,129,0.18)]',
          button: 'border-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/30',
          tag: 'bg-emerald-500/20 text-emerald-200',
          progress: 'bg-gradient-to-r from-emerald-400 to-sky-400',
        },
      };
    }

    return {
      questionDatasetKey: 'quizzes.planet_quiz' as const,
      resultDatasetKey: 'astro.planets' as const,
      title: '你是哪颗行星',
      subtitle: '完成趣味题目，匹配你的行星风格画像。',
      resultType: '行星',
      emptyText: '当前测试题或结果库为空，请先到管理页补充并启用数据。',
      accent: {
        border: 'border-violet-400/50',
        glow: 'shadow-[0_0_24px_rgba(167,139,250,0.2)]',
        button: 'border-violet-400/50 bg-violet-500/20 hover:bg-violet-500/30',
        tag: 'bg-indigo-500/25 text-indigo-200',
        progress: 'bg-gradient-to-r from-violet-400 to-sky-400',
      },
    };
  }, [location.pathname]);

  return <QuizEngine {...config} />;
}
