import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

interface ContentEditorProps {
  item: Record<string, unknown> | null;
  onSave: (next: Record<string, unknown>) => void;
  onDelete: () => void;
  canToggleEnabled: boolean;
  onToggleEnabled: () => void;
}

export function ContentEditor({ item, onSave, onDelete, canToggleEnabled, onToggleEnabled }: ContentEditorProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(item ? JSON.stringify(item, null, 2) : '');
    setError(null);
  }, [item]);

  const enabledLabel = useMemo(() => {
    if (!item || !canToggleEnabled) return '';
    return item.enabled === false ? '启用' : '停用';
  }, [canToggleEnabled, item]);

  if (!item) {
    return <p className="text-sm text-slate-300">请先从左侧列表选择条目进行编辑。</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => {
            try {
              const parsed = JSON.parse(text) as unknown;
              if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                throw new Error('条目必须是 JSON 对象。');
              }
              setError(null);
              onSave(parsed as Record<string, unknown>);
            } catch (err) {
              setError((err as Error).message || 'JSON 格式错误');
            }
          }}
        >
          保存条目
        </Button>
        {canToggleEnabled ? (
          <Button type="button" onClick={onToggleEnabled}>
            {enabledLabel}
          </Button>
        ) : null}
        <Button
          type="button"
          className="border-rose-500/60 bg-rose-500/20 hover:bg-rose-500/30"
          onClick={() => {
            if (window.confirm('确认删除此条目？删除后不可恢复。')) {
              onDelete();
            }
          }}
        >
          删除条目
        </Button>
      </div>
      <Textarea rows={16} value={text} onChange={(e) => setText(e.target.value)} />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
