import { useState } from 'react';
import { ContentManager } from '../components/admin/ContentManager';
import { DatasetSwitcher } from '../components/admin/DatasetSwitcher';
import { JsonImportExport } from '../components/admin/JsonImportExport';
import { Card } from '../components/ui/Card';
import { datasetKeys, getDatasetMeta } from '../lib/datasetRegistry';
import type { DatasetKey } from '../types/dataset';

export function AdminPage() {
  const [selectedKey, setSelectedKey] = useState<DatasetKey>('bio.facts');
  const [reloadTick, setReloadTick] = useState(0);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">内容管理中心</h2>
        <DatasetSwitcher datasetKeys={datasetKeys} selectedKey={selectedKey} onSelect={setSelectedKey} getMeta={getDatasetMeta} />
      </Card>
      <div className="space-y-4">
        <Card>
          <h3 className="mb-2 text-base font-semibold">数据内容管理：{getDatasetMeta(selectedKey).label}</h3>
          <ContentManager key={`${selectedKey}-${reloadTick}`} datasetKey={selectedKey} />
        </Card>
        <Card>
          <h3 className="mb-2 text-base font-semibold">JSON 导入 / 导出</h3>
          <JsonImportExport datasetKey={selectedKey} onImported={() => setReloadTick((v) => v + 1)} />
        </Card>
      </div>
    </div>
  );
}
