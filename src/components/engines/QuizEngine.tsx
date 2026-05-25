import { useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useLocalDataset } from '../../hooks/useLocalDataset';
import type { DatasetKey } from '../../types/dataset';
import type { QuizQuestion } from '../../types/quiz';

type AccentTheme = {
  border: string;
  glow: string;
  button: string;
  tag: string;
  progress: string;
};

type QuizEngineProps = {
  questionDatasetKey: DatasetKey;
  resultDatasetKey: DatasetKey;
  title: string;
  subtitle: string;
  accent: AccentTheme;
  resultType: string;
  emptyText: string;
};

type GenericResult = {
  id?: string;
  name?: string;
  title?: string;
  role?: string;
  keywords?: string[];
  description?: string;
  scienceExplanation?: string;
  quote?: string;
  function?: string;
  lines?: string[];
  enabled?: boolean;
};

function isEnabled(item: GenericResult) {
  return typeof item.enabled === 'boolean' ? item.enabled : true;
}

export function QuizEngine({ questionDatasetKey, resultDatasetKey, title, subtitle, accent, resultType, emptyText }: QuizEngineProps) {
  const { data: questionsData } = useLocalDataset<QuizQuestion>(questionDatasetKey);
  const { data: resultsData } = useLocalDataset<GenericResult>(resultDatasetKey);

  const questions = useMemo(() => (Array.isArray(questionsData) ? questionsData : []).filter((q) => q?.id && q?.question && Array.isArray(q?.options) && q.options.length), [questionsData]);
  const availableResults = useMemo(() => (Array.isArray(resultsData) ? resultsData : []).filter((item) => item?.id && isEnabled(item)), [resultsData]);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [copyStatus, setCopyStatus] = useState('');

  const total = questions.length;
  const completed = answers.length === total && total > 0;
  const currentQuestion = questions[currentIndex];

  const scoreResult = useMemo(() => {
    if (!completed) return null;

    const resultMap = new Map(availableResults.map((item) => [item.id as string, item]));
    const scores: Record<string, number> = {};

    answers.forEach((optionIdx, qIndex) => {
      const option = questions[qIndex]?.options?.[optionIdx];
      if (!option?.scores) return;
      Object.entries(option.scores).forEach(([resultId, value]) => {
        if (!resultMap.has(resultId)) {
          console.warn(`[QuizEngine] Unknown result id in scores: ${resultId}`);
          return;
        }
        scores[resultId] = (scores[resultId] ?? 0) + value;
      });
    });

    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (!ranked.length) return null;

    const topScore = ranked[0][1];
    const topIds = ranked.filter(([, score]) => score === topScore).map(([id]) => id);
    const primary = resultMap.get(topIds[0]);
    if (!primary) return null;

    return {
      primary,
      primaryScore: topScore,
      ties: topIds.slice(1).map((id) => resultMap.get(id)).filter(Boolean) as GenericResult[],
      ranked: ranked
        .map(([id, score]) => ({ result: resultMap.get(id), score }))
        .filter((item) => item.result)
        .slice(1, 4) as { result: GenericResult; score: number }[],
    };
  }, [answers, availableResults, completed, questions]);

  const startQuiz = () => {
    setStarted(true);
    setCurrentIndex(0);
    setAnswers([]);
    setCopyStatus('');
  };

  const resetQuiz = () => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers([]);
    setCopyStatus('');
  };

  const selectOption = (index: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = index;
      return next;
    });
  };

  const copyResult = async () => {
    if (!scoreResult) return;
    const { primary } = scoreResult;
    const text = [
      `测试：${title}`,
      `结果：${primary.name ?? '未命名结果'}`,
      `类型：${primary.title ?? primary.role ?? '暂无'}`,
      `关键词：${Array.isArray(primary.keywords) ? primary.keywords.join('、') : '暂无'}`,
      `说明：${primary.description ?? primary.function ?? '暂无说明'}`,
      `科学解释：${primary.scienceExplanation ?? '暂无科学解释'}`,
    ].join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (!copied) throw new Error('copy-failed');
      }
      setCopyStatus('复制成功，快去分享吧！');
    } catch {
      setCopyStatus('复制失败：当前环境不支持自动复制，请手动复制。');
    }
  };

  if (!questions.length || !availableResults.length) {
    return (
      <Card className="border border-slate-700/80 bg-slate-900/60">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
        <p className="mt-4 text-sm text-slate-300">{emptyText}</p>
      </Card>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <Card className={`border ${accent.border} bg-slate-950/70`}>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
        <p className="mt-2 text-xs text-slate-400">说明：这是趣味测试，不构成科学测评或心理诊断。</p>
      </Card>

      {!started ? (
        <Card className={`border ${accent.border} ${accent.glow} bg-slate-900/70 animate-fadeIn`}>
          <p className="text-sm text-slate-200">共 {total} 题，完成后将匹配你的{resultType}类型。</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button className={accent.button} onClick={startQuiz}>开始测试</Button>
          </div>
        </Card>
      ) : completed && scoreResult ? (
        <Card className={`border ${accent.border} ${accent.glow} bg-slate-900/70 animate-fadeIn`}>
          <div className="space-y-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs ${accent.tag}`}>测试结果</span>
            <h2 className="text-2xl font-semibold text-white">{scoreResult.primary.name ?? '未命名结果'}</h2>
            <p className="text-sm text-slate-200">{scoreResult.primary.title ?? scoreResult.primary.role ?? '暂无定位'}</p>
            <p className="text-xs text-slate-300">关键词：{scoreResult.primary.keywords?.join('、') ?? '暂无'}</p>
            <p className="text-sm text-slate-200">{scoreResult.primary.description ?? scoreResult.primary.function ?? '暂无描述'}</p>
            <p className="text-sm text-slate-300">科学解释：{scoreResult.primary.scienceExplanation ?? '暂无科学解释'}</p>
            {scoreResult.primary.lines?.length ? <p className="text-sm text-slate-300">补充：{scoreResult.primary.lines.join(' / ')}</p> : null}
            <p className="text-sm italic text-cyan-200">“{scoreResult.primary.quote ?? '暂无引言'}”</p>
            <p className="text-sm text-emerald-300">主要得分：{scoreResult.primaryScore}</p>
            {scoreResult.ties.length ? (
              <p className="text-sm text-amber-200">你也具有 {scoreResult.ties.map((item) => item.name ?? '未知').join('、')} 的特质。</p>
            ) : null}
            {scoreResult.ranked.length ? (
              <div className="space-y-1 text-xs text-slate-300">
                <p>其他高分特质：</p>
                {scoreResult.ranked.map((item) => (
                  <p key={item.result.id}>{item.result.name ?? '未知'}：{item.score}</p>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button className={accent.button} onClick={resetQuiz}>重新测试</Button>
              <Button onClick={copyResult}>复制测试结果</Button>
            </div>
            {copyStatus ? <p className="text-xs text-emerald-300">{copyStatus}</p> : null}
          </div>
        </Card>
      ) : (
        <Card className={`border ${accent.border} ${accent.glow} bg-slate-900/70 animate-fadeIn`}>
          <div className="mb-3 h-2 w-full rounded-full bg-slate-800">
            <div className={`h-2 rounded-full ${accent.progress}`} style={{ width: `${((currentIndex + 1) / total) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-400">第 {currentIndex + 1} / {total} 题</p>
          <h2 className="mt-2 text-lg font-semibold text-white">{currentQuestion.question}</h2>
          <div className="mt-4 space-y-2">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={`${currentQuestion.id}-${option.label}`}
                type="button"
                className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition ${answers[currentIndex] === idx ? `${accent.border} bg-slate-800 text-white` : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500'}`}
                onClick={() => selectOption(idx)}
              >
                <span className="mr-2 text-cyan-200">{option.label}.</span>{option.text}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))} disabled={currentIndex === 0}>上一题</Button>
            <Button
              className={accent.button}
              disabled={answers[currentIndex] === undefined}
              onClick={() => {
                if (currentIndex >= total - 1) return;
                setCurrentIndex((prev) => prev + 1);
              }}
            >
              下一题
            </Button>
            <Button onClick={resetQuiz}>重新开始</Button>
          </div>
        </Card>
      )}
    </section>
  );
}
