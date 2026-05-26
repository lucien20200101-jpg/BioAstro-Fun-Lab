import { Link } from 'react-router-dom';
import type { ToolEntry } from '../../types/tool';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export function ToolEntryCard({ tool }: { tool: ToolEntry }) {
  const isReady = tool.status === 'ready';

  return (
    <Card
      className={`space-y-3 border transition ${
        isReady
          ? 'border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.15)]'
          : 'border-slate-600/60 bg-slate-800/80 opacity-85'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className={`text-base font-semibold ${isReady ? 'text-white' : 'text-slate-200'}`}>{tool.title}</h3>
        <Badge>{isReady ? '可用' : '开发中'}</Badge>
      </div>
      <p className={`text-sm leading-6 ${isReady ? 'text-slate-100' : 'text-slate-400'}`}>{tool.description}</p>
      <Link
        to={tool.path}
        className={`block min-h-11 rounded-xl border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 ${
          isReady
            ? 'border-cyan-300/70 bg-cyan-400/20 text-cyan-100 hover:bg-cyan-400/30 hover:text-white focus-visible:ring-cyan-300/80'
            : 'border-slate-500/40 bg-slate-700/60 text-slate-300 hover:border-slate-400/60 hover:bg-slate-600/70 hover:text-slate-100 focus-visible:ring-slate-300/60'
        }`}
      >
        {isReady ? '进入工具' : '查看预告'}
      </Link>
    </Card>
  );
}
