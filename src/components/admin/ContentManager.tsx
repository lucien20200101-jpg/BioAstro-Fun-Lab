import { useMemo, useState } from 'react';
import { useLocalDataset } from '../../hooks/useLocalDataset';
import { getDatasetMeta } from '../../lib/datasetRegistry';
import type { DatasetKey } from '../../types/dataset';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ContentEditor } from './ContentEditor';

interface ContentManagerProps { datasetKey: DatasetKey }

export function ContentManager({ datasetKey }: ContentManagerProps) {
  const meta = getDatasetMeta(datasetKey);
  const { data, setData, saveData, resetData, isUsingLocalData, error } = useLocalDataset<Record<string, unknown>>(datasetKey);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      if (typeof item.category === 'string') set.add(item.category);
    });
    return ['all', ...Array.from(set)];
  }, [data]);

  const filtered = useMemo(() => data.filter((item) => {
    const hay = [item.id, item.title, item.name, item.category].filter((v) => typeof v === 'string').join(' ').toLowerCase();
    const hit = hay.includes(search.toLowerCase());
    const categoryOk = category === 'all' || item.category === category;
    return hit && categoryOk;
  }), [category, data, search]);

  const selectedItem = data.find((it) => String(it.id) === selectedId) ?? null;

  return <div className="space-y-3">
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-xs text-slate-200">
      <p>条目数：{data.length}</p><p>数据来源：{isUsingLocalData ? '本地修改数据' : '默认数据'}</p>{error ? <p className='text-rose-300'>错误：{error}</p> : null}
    </div>
    <div className="flex flex-wrap gap-2">
      <Input placeholder="搜索 id/title/name/category" value={search} onChange={(e) => setSearch(e.target.value)} />
      {meta.supportsCategory ? <Select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</Select> : null}
      <Button type="button" onClick={() => {
        const next: Record<string, unknown> = { id: `custom-${Date.now()}` };
        if (meta.supportsEnabled) next.enabled = true;
        setData((prev) => [next, ...prev]);
        setSelectedId(String(next.id));
      }}>新增条目</Button>
      <Button type="button" onClick={saveData}>保存全部变更</Button>
      <Button type="button" className="border-amber-500/60 bg-amber-500/20 hover:bg-amber-500/30" onClick={() => { if (window.confirm('确认恢复当前数据集默认数据？')) resetData(); }}>恢复默认</Button>
    </div>
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="max-h-[28rem] space-y-2 overflow-auto rounded-xl border border-slate-700 bg-slate-950/40 p-2">
        {filtered.map((item) => {
          const id = String(item.id ?? 'unknown-id');
          const titleField = meta.itemNameField ? item[meta.itemNameField] : item.name ?? item.title;
          return <button key={id} type="button" onClick={() => setSelectedId(id)} className="w-full rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-left hover:border-slate-500">
            <p className="text-xs text-slate-400">{id}</p>
            <p className="text-sm text-white">{typeof titleField === 'string' ? titleField : '(未命名)'}</p>
            {typeof item.category === 'string' ? <p className="text-xs text-cosmic-bioBlue">{item.category}</p> : null}
            {typeof item.enabled === 'boolean' ? <p className="text-xs text-cosmic-bioGreen">{item.enabled ? '已启用' : '已停用'}</p> : null}
          </button>;
        })}
      </div>
      {filtered.length === 0 ? <p className="text-xs text-slate-400 lg:col-span-2">没有匹配条目，请调整搜索词或分类筛选。</p> : null}
      <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
        <ContentEditor
          item={selectedItem}
          canToggleEnabled={typeof selectedItem?.enabled === 'boolean'}
          onToggleEnabled={() => {
            if (!selectedItem || typeof selectedItem.enabled !== 'boolean') return;
            setData((prev) => prev.map((x) => (x.id === selectedItem.id ? { ...x, enabled: !selectedItem.enabled } : x)));
          }}
          onDelete={() => {
            if (!selectedItem) return;
            setData((prev) => prev.filter((x) => x.id !== selectedItem.id));
            setSelectedId(null);
          }}
          onSave={(next) => {
            setData((prev) => prev.map((x) => (x.id === selectedItem?.id ? next : x)));
          }}
        />
      </div>
    </div>
  </div>;
}
