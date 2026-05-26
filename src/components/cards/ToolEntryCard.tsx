import { Link } from 'react-router-dom';
import type { ToolEntry } from '../../types/tool';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export function ToolEntryCard({ tool }: { tool: ToolEntry }) {
  const isReady = tool.status === 'ready';
  return (
    <Card className="space-y-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">{tool.title}</h3>
        <Badge>{isReady ? '可用' : '开发中'}</Badge>
      </div>
      <p className="text-sm leading-6 text-slate-300">{tool.description}</p>
      <Link to={tool.path} className="block min-h-11 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cosmic-bioBlue transition hover:bg-cyan-500/20 hover:text-cosmic-bioGreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80">
        进入工具
      </Link>
    </Card>
  );
}
