import { useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useLocalDataset } from '../../hooks/useLocalDataset';
import type { DatasetKey } from '../../types/dataset';
import type { RandomFact } from '../../types/content';

type AccentTheme = {
  border: string;
  glow: string;
  badge: string;
  button: string;
};

type RandomCardBoxProps = {
  datasetKey: DatasetKey;
  title: string;
  subtitle: string;
  accent: AccentTheme;
  emptyText: string;
};

function isEnabled(item: Partial<RandomFact>) {
  if (typeof item.enabled === 'boolean') return item.enabled;
  return true;
}

function formatCardText(card: Partial<RandomFact>) {
  const keywords = Array.isArray(card.keywords) ? card.keywords.join('、') : '暂无';
  return [
    `标题：${card.title ?? '未命名内容'}`,
    `分类：${card.category ?? '未分类'}`,
    `摘要：${card.summary ?? '暂无摘要'}`,
    `详细解释：${card.detail ?? '暂无详细解释'}`,
    `关键词：${keywords}`,
    `延伸问题：${card.question ?? '暂无延伸问题'}`,
  ].join('\n');
}

export function RandomCardBox({ datasetKey, title, subtitle, accent, emptyText }: RandomCardBoxProps) {
  const { data } = useLocalDataset<RandomFact>(datasetKey);
  const [selectedCard, setSelectedCard] = useState<Partial<RandomFact> | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('');
  const [favoriteStatus, setFavoriteStatus] = useState<string>('');

  const availableCards = useMemo(
    () => (Array.isArray(data) ? data.filter((item) => isEnabled(item ?? {})) : []),
    [data],
  );

  const favoritesKey = `bioastro-favorites-${datasetKey}`;

  const drawCard = () => {
    if (!availableCards.length) return;
    const pool = availableCards.length > 1 ? availableCards.filter((card) => card.id !== lastId) : availableCards;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setSelectedCard(random);
    setLastId(random.id ?? null);
    setCopyStatus('');
    setFavoriteStatus('');
  };

  const handleCopy = async () => {
    if (!selectedCard) return;
    const text = formatCardText(selectedCard);

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
      setCopyStatus('复制成功');
    } catch {
      setCopyStatus('复制失败：当前环境暂不支持复制，请手动复制。');
    }
  };

  const handleFavorite = () => {
    if (!selectedCard || !selectedCard.id) return;
    try {
      const raw = localStorage.getItem(favoritesKey);
      const list = raw ? (JSON.parse(raw) as Partial<RandomFact>[]) : [];
      const exists = list.some((item) => item.id === selectedCard.id);
      if (exists) {
        setFavoriteStatus('已收藏，无需重复添加');
        return;
      }
      const next = [...list, selectedCard];
      localStorage.setItem(favoritesKey, JSON.stringify(next));
      setFavoriteStatus('已收藏到本地');
    } catch {
      setFavoriteStatus('收藏失败，请稍后重试');
    }
  };

  const isFavorited = useMemo(() => {
    if (!selectedCard?.id) return false;
    try {
      const raw = localStorage.getItem(favoritesKey);
      const list = raw ? (JSON.parse(raw) as Partial<RandomFact>[]) : [];
      return list.some((item) => item.id === selectedCard.id);
    } catch {
      return false;
    }
  }, [favoritesKey, selectedCard?.id]);

  const themeByDataset =
    datasetKey.startsWith('bio')
      ? {
          shell: 'from-emerald-500/20 via-teal-500/10 to-slate-900/90',
          texture:
            'bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_48%),radial-gradient(circle_at_80%_70%,rgba(52,211,153,0.16),transparent_50%)]',
          line: 'border-emerald-300/30',
        }
      : {
          shell: 'from-fuchsia-500/20 via-violet-500/10 to-slate-900/90',
          texture:
            'bg-[radial-gradient(circle_at_22%_20%,rgba(217,70,239,0.2),transparent_48%),radial-gradient(circle_at_78%_74%,rgba(168,85,247,0.22),transparent_52%),conic-gradient(from_180deg_at_50%_50%,rgba(168,85,247,0.08),transparent_38%,rgba(244,114,182,0.08))]',
          line: 'border-violet-300/30',
        };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <Card className={`border ${accent.border} bg-slate-950/70`}>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
      </Card>

      {!availableCards.length ? (
        <Card className="border border-slate-700/80 bg-slate-900/60">
          <p className="text-sm text-slate-300">{emptyText}</p>
        </Card>
      ) : (
        <Card
          className={`overflow-hidden border ${accent.border} ${accent.glow} bg-gradient-to-br ${themeByDataset.shell} transition-all duration-500`}
        >
          {!selectedCard ? (
            <div className={`relative overflow-hidden rounded-xl border ${themeByDataset.line} ${themeByDataset.texture} p-6 text-center`}>
              <div className="absolute -left-8 top-8 h-20 w-20 rounded-full border border-white/10" />
              <div className="absolute -right-10 bottom-6 h-28 w-28 rounded-full border border-white/10" />
              <div className="space-y-4">
                <p className="text-xs tracking-[0.24em] text-slate-400">待开启能量卡盒</p>
                <p className="text-sm text-slate-200">点击充能后抽取你的今日科学灵感。</p>
                <div className="flex justify-center">
                  <Button
                    className={`${accent.button} relative overflow-hidden transition active:scale-95`}
                    onClick={drawCard}
                  >
                    <span className="absolute inset-0 animate-pulse bg-white/10" />
                    <span className="relative">⚡ 充能开启</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`relative overflow-hidden rounded-2xl border ${themeByDataset.line} ${themeByDataset.texture} p-4 shadow-[0_0_40px_rgba(15,23,42,0.55)] animate-fadeIn`}>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.16)_45%,transparent_65%)] animate-[scan_1.15s_ease-out_1]" />
                <p className="mb-2 text-[11px] tracking-[0.24em] text-slate-400">COLLECTIBLE ENERGY CARD</p>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-white">{selectedCard.title ?? '未命名内容'}</h2>
                  <span className={`rounded-full px-2 py-1 text-xs ${accent.badge}`}>
                    {selectedCard.category ?? '未分类'}
                  </span>
                  <span className="rounded-full border border-slate-600/80 bg-slate-800/80 px-2 py-1 text-xs text-slate-200">
                    难度：{selectedCard.difficulty ?? '未知'}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(selectedCard.keywords) && selectedCard.keywords.length
                    ? selectedCard.keywords
                    : ['暂无关键词']
                  ).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-white/15 bg-slate-900/70 px-2.5 py-1 text-xs text-slate-100"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 break-words text-slate-100">{selectedCard.summary ?? '暂无摘要'}</p>
                <p className="mt-2 text-sm leading-7 break-words text-slate-300">{selectedCard.detail ?? '暂无详细解释'}</p>
                <p className="mt-3 text-sm leading-6 break-words text-slate-200">延伸问题：{selectedCard.question ?? '暂无延伸问题'}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button className={`${accent.button} transition active:scale-95`} onClick={drawCard}>🎲 再抽一次</Button>
                <Button className="transition active:scale-95" onClick={handleCopy}>📋 复制卡片</Button>
                <Button className="transition active:scale-95" onClick={handleFavorite}>{isFavorited ? '✅ 已收藏' : '⭐ 收藏卡片'}</Button>
              </div>
              {copyStatus ? <p className="animate-fadeIn text-xs text-emerald-300">{copyStatus}</p> : null}
              {favoriteStatus ? <p className="animate-fadeIn text-xs text-cyan-300">{favoriteStatus}</p> : null}
            </div>
          )}
        </Card>
      )}
    </section>
  );
}
