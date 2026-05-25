import { Card } from '../components/ui/Card';

export function AdminPage() {
  return (
    <Card>
      <h2 className="mb-2 text-lg font-semibold">管理中心</h2>
      <p className="text-sm text-slate-300">用于后续提供本地 JSON 数据导入、导出、恢复默认等能力。</p>
      <p className="mt-2 text-sm text-cosmic-bioGreen">当前状态：开发中</p>
    </Card>
  );
}
