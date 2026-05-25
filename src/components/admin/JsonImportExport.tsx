import { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { downloadJson, exportAllDatasets, exportDataset, importAllDatasets, importDataset } from '../../lib/json';
import type { DatasetKey } from '../../types/dataset';

interface JsonImportExportProps {
  datasetKey: DatasetKey;
  onImported: () => void;
}

export function JsonImportExport({ datasetKey, onImported }: JsonImportExportProps) {
  const [currentJson, setCurrentJson] = useState('');
  const [backupJson, setBackupJson] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => downloadJson(`${datasetKey}.json`, JSON.parse(exportDataset(datasetKey)))}>导出当前数据集</Button>
        <Button type="button" onClick={() => downloadJson(`bioastro-backup-${Date.now()}.json`, JSON.parse(exportAllDatasets()))}>导出全部备份</Button>
      </div>
      <div>
        <p className="mb-1 text-xs text-slate-300">导入当前数据集 JSON（数组）</p>
        <Textarea rows={6} value={currentJson} onChange={(e) => setCurrentJson(e.target.value)} placeholder="粘贴 JSON 数组..." />
        <Button
          type="button"
          className="mt-2"
          onClick={() => {
            try {
              importDataset(datasetKey, currentJson);
              onImported();
              setMessage('当前数据集导入成功。');
            } catch (error) {
              setMessage(`当前数据集导入失败：${(error as Error).message}`);
            }
          }}
        >
          导入当前数据集
        </Button>
      </div>
      <div>
        <p className="mb-1 text-xs text-slate-300">导入全部数据集备份（对象）</p>
        <Textarea rows={6} value={backupJson} onChange={(e) => setBackupJson(e.target.value)} placeholder="粘贴 backup JSON 对象..." />
        <Button
          type="button"
          className="mt-2"
          onClick={() => {
            try {
              importAllDatasets(backupJson);
              onImported();
              setMessage('全部数据集备份导入成功。');
            } catch (error) {
              setMessage(`全部备份导入失败：${(error as Error).message}`);
            }
          }}
        >
          导入全部备份
        </Button>
      </div>
      {message ? <p className="text-sm text-cosmic-bioGreen">{message}</p> : null}
    </div>
  );
}
