import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Textarea } from '../components/ui/Textarea'
import { useLocalDataset } from '../hooks/useLocalDataset'
import {
  cleanDnaSequence,
  compareTranslations,
  mutateDna,
  transcribeFromMode,
  translateMrna,
  validateDnaSequence,
  type MutationClassification,
  type MutationResult,
  type MutationType,
  type TranscriptionMode,
} from '../lib/dna'
import type { DNACase } from '../types/dna'

export function DNATranslatorPage() {
  const { data } = useLocalDataset<DNACase>('bio.dna_cases')
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<TranscriptionMode>('template')
  const [mutation, setMutation] = useState<MutationResult | null>(null)
  const [copyStatus, setCopyStatus] = useState<string>('')

  const enabledCases = useMemo(() => data.filter((item) => item.enabled !== false), [data])
  const cleaned = cleanDnaSequence(input)
  const validation = validateDnaSequence(cleaned)

  const warning = useMemo(() => {
    if (!cleaned) return '请输入 DNA 序列。'
    if (!validation.valid) return `存在非法字符：${validation.invalidChars.join(', ')}`
    if (cleaned.length < 3) return '序列长度不足 3，无法形成完整密码子。'
    return ''
  }, [cleaned, validation.invalidChars, validation.valid])

  const baseMrna = validation.valid ? transcribeFromMode(cleaned, mode) : ''
  const baseResult = translateMrna(baseMrna)
  const activeSequence = mutation?.mutatedSequence ?? cleaned
  const activeMrna = validation.valid ? transcribeFromMode(activeSequence, mode) : ''
  const activeResult = translateMrna(activeMrna)
  const classification: MutationClassification | null = mutation ? compareTranslations(baseResult, activeResult, mutation) : null

  const runRandomMutation = () => {
    if (!cleaned || !validation.valid) return
    const types: MutationType[] = ['substitution', 'insertion', 'deletion']
    const randomType = types[Math.floor(Math.random() * types.length)]
    setMutation(mutateDna(cleaned, randomType))
  }

  const copyResult = async () => {
    const payload = [
      `DNA 序列: ${activeSequence}`,
      `转录模式: ${mode === 'template' ? '模板链模式' : '编码链模式'}`,
      `mRNA 序列: ${activeResult.mrna}`,
      `密码子列表: ${activeResult.codons.join(', ')}`,
      `氨基酸序列: ${activeResult.aminoAcidSequence || '无'}`,
      `起始密码子: ${activeResult.startCodonIndexes.length > 0 ? '存在' : '不存在'}`,
      `终止密码子: ${activeResult.stopCodonIndexes.length > 0 ? '存在' : '不存在'}`,
      mutation ? `突变分析: ${classification?.message ?? '无'}` : null,
    ].filter(Boolean).join('\n')

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = payload
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopyStatus('复制成功')
    } catch {
      setCopyStatus('复制失败：当前环境不支持复制，请手动复制。')
    }
  }

  return (
    <div className="space-y-4 text-slate-100">
      <Card>
        <h2 className="text-lg font-semibold text-cosmic-bioGreen">DNA 密码翻译器</h2>
        <p className="mb-3 text-sm text-slate-300">输入 DNA，按模板链或编码链模式转录并翻译为氨基酸。</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-cosmic-bioGreen">输入区</h3>
            <div className="rounded-xl border border-cyan-400/40 bg-slate-950/70 p-3 shadow-[0_0_22px_rgba(56,189,248,0.12)]">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-cyan-300/80">Sequence Scanner</p>
              <Textarea value={input} rows={7} onChange={(event) => setInput(event.target.value)} placeholder="例如：TACGCCATT" className="border-cyan-300/40 bg-black/40 font-mono tracking-[0.18em] text-cyan-100" />
            </div>
            <p className="text-xs text-slate-300">会自动移除空格/换行并转成大写，仅允许 A/T/C/G。</p>
            {warning && <p className="text-xs text-amber-300">{warning}</p>}

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cyan-300">示例案例（bio.dna_cases）</h4>
              <div className="flex flex-wrap gap-2">
                {enabledCases.length > 0 ? enabledCases.map((item) => (
                  <Button key={item.id} type="button" className="bg-cosmic-bioBlue/20" onClick={() => { setInput(item.dnaSequence); setMutation(null) }}>
                    {item.name}
                  </Button>
                )) : <p className="text-xs text-slate-400">当前无启用案例，可手动输入序列继续使用。</p>}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-cosmic-bioBlue">转录模式区</h3>
            <div className="inline-flex rounded-xl border border-slate-600/80 bg-slate-900/80 p-1">
              <button type="button" className={`rounded-lg px-3 py-2 text-sm transition ${mode === 'template' ? 'bg-emerald-500/35 text-emerald-100 shadow-inner' : 'text-slate-300 hover:text-white'}`} onClick={() => setMode('template')}>模板链</button>
              <button type="button" className={`rounded-lg px-3 py-2 text-sm transition ${mode === 'coding' ? 'bg-sky-500/35 text-sky-100 shadow-inner' : 'text-slate-300 hover:text-white'}`} onClick={() => setMode('coding')}>编码链</button>
            </div>
            <p className="text-xs text-slate-300">模板链模式：按互补配对 A→U、T→A、C→G、G→C。编码链模式：保持序列方向，仅把 T 替换为 U。</p>
          </section>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-cyan-300">结果区</h2>
        <p className="mb-3 text-sm text-slate-300">显示清理后的序列、mRNA、密码子与翻译结果。</p>
        <div className="space-y-2 text-sm">
          <p>清理后 DNA：</p>
          <div className="relative overflow-hidden rounded-lg border border-cyan-400/30 bg-black/70 p-2 font-mono text-cyan-200">
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(148,163,184,0.08)_0px,rgba(148,163,184,0.08)_1px,transparent_1px,transparent_3px)]" />
            <span className="relative block overflow-x-auto break-all tracking-[0.16em]">{activeSequence || '-'}</span>
          </div>
          <p>当前模式：{mode === 'template' ? '模板链模式' : '编码链模式'}</p>
          <p>mRNA：</p>
          <div className="relative overflow-hidden rounded-lg border border-emerald-400/30 bg-black/70 p-2 font-mono text-emerald-200">
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(148,163,184,0.08)_0px,rgba(148,163,184,0.08)_1px,transparent_1px,transparent_3px)]" />
            <span className="relative block overflow-x-auto break-all tracking-[0.16em]">{activeResult.mrna || '-'}</span>
          </div>
          <p>氨基酸序列：{activeResult.aminoAcidSequence || '-'}</p>
          <p>序列长度：{activeSequence.length}；完整密码子：{activeResult.codons.length}；不完整尾部：{activeResult.remainder.length}</p>
          <p>起始密码子(AUG)：{activeResult.startCodonIndexes.length > 0 ? '存在' : '不存在'}；终止密码子(UAA/UAG/UGA)：{activeResult.stopCodonIndexes.length > 0 ? '存在' : '不存在'}</p>
          {activeResult.startCodonIndexes.length === 0 && activeResult.codons.length > 0 && (
            <p className="rounded-lg border border-amber-300/40 bg-amber-500/10 px-2 py-1 text-xs text-amber-200">未检测到 AUG 起始密码子，当前翻译仅为按三联体机械翻译结果（简化演示，不代表完整生物过程）。</p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {activeResult.codons.map((codon, index) => {
              const isStart = codon === 'AUG'
              const isStop = ['UAA', 'UAG', 'UGA'].includes(codon)
              return (
                <span key={`${codon}-${index}`} className={`rounded-full border px-2 py-1 text-xs font-semibold ${isStart ? 'border-emerald-300/70 bg-emerald-500/35 text-emerald-50 shadow-[0_0_10px_rgba(16,185,129,0.35)]' : isStop ? 'border-rose-300/70 bg-rose-500/35 text-rose-50 shadow-[0_0_10px_rgba(244,63,94,0.35)]' : 'border-slate-600 bg-slate-700/70 text-slate-200'}`}>
                  {codon}
                </span>
              )
            })}
            {activeResult.remainder && <span className="rounded-full bg-amber-500/25 px-2 py-1 text-xs text-amber-100">不完整片段: {activeResult.remainder}</span>}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-violet-300">突变分析区</h2>
        <p className="mb-3 text-sm text-slate-300">随机替换/插入/缺失碱基并比较前后翻译结果。</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={runRandomMutation} disabled={!cleaned || !validation.valid}>随机突变</Button>
          <Button type="button" onClick={() => setMutation(null)} disabled={!mutation}>清除突变</Button>
          <Button type="button" onClick={copyResult} disabled={!cleaned || !validation.valid}>复制结果</Button>
          {copyStatus && <span className="text-xs text-cyan-200">{copyStatus}</span>}
        </div>
        {mutation && (
          <div className="mt-3 space-y-1 text-sm text-slate-200">
            <p>{mutation.label}</p>
            <p>位置：第 {mutation.position + 1} 位；突变前：{mutation.before}；突变后：{mutation.after}</p>
            <p className="text-cosmic-bioGreen">{classification?.message}</p>
            <p className="rounded-md border border-slate-600/70 bg-slate-900/50 px-2 py-1 text-xs text-slate-300">说明：该判断基于当前输入序列和当前阅读框的简化分析，属于推测性结果，仍有待实验验证。</p>
          </div>
        )}
      </Card>
    </div>
  )
}
