import { Card } from '../components/ui/Card';
import { datasetKeys } from '../lib/datasetRegistry';
import { useLocalDataset } from '../hooks/useLocalDataset';

export function AdminPage() {
  const { data, isUsingLocalData, error } = useLocalDataset('bio.facts');

  return (
    <Card>
      <h2 className="mb-2 text-lg font-semibold">管理中心</h2>
      <p className="text-sm text-slate-300">用于后续提供本地 JSON 数据导入、导出、恢复默认等能力。</p>
      <p className="mt-2 text-sm text-cosmic-bioGreen">当前状态：开发中</p>

      <div className="mt-4 rounded-md border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-200">
        <p>数据集总数：{datasetKeys.length}</p>
        <p>示例数据集（bio.facts）条目数：{data.length}</p>
        <p>示例数据来源：{isUsingLocalData ? 'localStorage' : '默认 JSON'}</p>
        {error ? <p className="mt-1 text-rose-300">读取错误：{error}</p> : null}
      </div>
    </Card>
  );
}
