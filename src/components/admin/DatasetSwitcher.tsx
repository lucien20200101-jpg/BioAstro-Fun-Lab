import type { DatasetKey, DatasetMeta } from '../../types/dataset';

interface DatasetSwitcherProps {
  datasetKeys: DatasetKey[];
  selectedKey: DatasetKey;
  onSelect: (key: DatasetKey) => void;
  getMeta: (key: DatasetKey) => DatasetMeta;
}

export function DatasetSwitcher({ datasetKeys, selectedKey, onSelect, getMeta }: DatasetSwitcherProps) {
  return (
    <div className="space-y-2">
      {datasetKeys.map((key) => {
        const meta = getMeta(key);
        const active = selectedKey === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`w-full rounded-xl border p-3 text-left transition ${
              active ? 'border-cosmic-bioGreen bg-cosmic-bioGreen/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
            }`}
          >
            <p className="text-sm font-semibold text-white">{meta.label}</p>
            <p className="text-xs text-slate-300">{meta.datasetKey}</p>
            <p className="mt-1 text-xs text-cosmic-bioBlue">{meta.category}</p>
            <p className="mt-1 text-xs text-slate-400">{meta.description}</p>
          </button>
        );
      })}
    </div>
  );
}
