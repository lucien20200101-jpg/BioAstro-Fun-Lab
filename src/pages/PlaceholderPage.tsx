import { useLocation } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export function PlaceholderPage() {
  const location = useLocation();

  return (
    <Card>
      <h2 className="mb-2 text-lg font-semibold">开发中</h2>
      <p className="text-sm text-slate-300">该工具正在开发中，敬请期待。</p>
      <p className="mt-2 text-xs text-cosmic-bioBlue">当前路径：{location.pathname}</p>
    </Card>
  );
}
