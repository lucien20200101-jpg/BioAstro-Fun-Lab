import { Link } from 'react-router-dom';
import type { ToolEntry } from '../../types/tool';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export function ToolEntryCard({ tool }: { tool: ToolEntry }) {
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-medium text-white">{tool.title}</h3>
        <Badge>开发中</Badge>
      </div>
      <p className="mb-3 text-sm text-slate-300">{tool.description}</p>
      <Link to={tool.path} className="text-sm text-cosmic-bioBlue hover:text-cosmic-bioGreen">
        进入工具
      </Link>
    </Card>
  );
}
