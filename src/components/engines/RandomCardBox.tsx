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
        <Card className={`overflow-hidden border ${accent.border} ${accent.glow} bg-slate-900/70 transition-all duration-300`}>
          {!selectedCard ? (
            <div className="space-y-4 p-1 text-center animate-pulse">
              <p className="text-sm text-slate-300">准备好后点击下方按钮开启盲盒。</p>
              <Button className={accent.button} onClick={drawCard}>开启盲盒</Button>
            </div>
          ) : (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-white">{selectedCard.title ?? '未命名内容'}</h2>
                <span className={`rounded-full px-2 py-1 text-xs ${accent.badge}`}>
                  {selectedCard.category ?? '未分类'}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-200">
                  难度：{selectedCard.difficulty ?? '未知'}
                </span>
              </div>
              <p className="text-sm leading-6 break-words text-slate-200">{selectedCard.summary ?? '暂无摘要'}</p>
              <p className="text-sm leading-7 break-words text-slate-300">{selectedCard.detail ?? '暂无详细解释'}</p>
              <p className="text-xs leading-6 text-slate-300 break-words">
                关键词：{Array.isArray(selectedCard.keywords) && selectedCard.keywords.length ? selectedCard.keywords.join('、') : '暂无'}
              </p>
              <p className="text-sm leading-6 break-words text-slate-200">延伸问题：{selectedCard.question ?? '暂无延伸问题'}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button className={accent.button} onClick={drawCard}>再抽一次</Button>
                <Button onClick={handleCopy}>复制卡片内容</Button>
                <Button onClick={handleFavorite}>{isFavorited ? '已收藏' : '收藏到本地'}</Button>
              </div>
              {copyStatus ? <p className="text-xs text-emerald-300">{copyStatus}</p> : null}
              {favoriteStatus ? <p className="text-xs text-cyan-300">{favoriteStatus}</p> : null}
            </div>
          )}
        </Card>
      )}
    </section>
  );
}
