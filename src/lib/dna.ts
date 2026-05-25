export type TranscriptionMode = 'template' | 'coding'
export type MutationType = 'substitution' | 'insertion' | 'deletion'

export interface SequenceValidationResult {
  valid: boolean
  invalidChars: string[]
}

export interface MutationResult {
  type: MutationType
  position: number
  before: string
  after: string
  label: string
  mutatedSequence: string
}

export interface TranslationResult {
  mrna: string
  codons: string[]
  remainder: string
  aminoAcids: string[]
  aminoAcidSequence: string
  startCodonIndexes: number[]
  stopCodonIndexes: number[]
}

export interface MutationClassification {
  kind: 'same' | 'synonymous' | 'missense' | 'nonsense' | 'frameshift'
  message: string
}

const RNA_BASES = ['A', 'U', 'C', 'G'] as const
const STOP_CODONS = new Set(['UAA', 'UAG', 'UGA'])

const GENETIC_CODE: Record<string, string> = {
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser',
  UAU: 'Tyr', UAC: 'Tyr', UAA: 'Stop', UAG: 'Stop',
  UGU: 'Cys', UGC: 'Cys', UGA: 'Stop', UGG: 'Trp',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
  CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met',
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys',
  AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
  GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
  GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
}

export function cleanDnaSequence(input: string): string {
  return input.replace(/\s+/g, '').toUpperCase()
}

export function validateDnaSequence(sequence: string): SequenceValidationResult {
  const uniqueChars = new Set(sequence.split(''))
  const invalidChars = [...uniqueChars].filter((char) => !['A', 'T', 'C', 'G'].includes(char))
  return { valid: invalidChars.length === 0, invalidChars }
}

export function transcribeTemplateDnaToMrna(sequence: string): string {
  const map: Record<string, string> = { A: 'U', T: 'A', C: 'G', G: 'C' }
  return sequence.split('').map((base) => map[base] ?? '').join('')
}

export function transcribeCodingDnaToMrna(sequence: string): string {
  return sequence.replace(/T/g, 'U')
}

export function splitCodons(mrna: string): { codons: string[]; remainder: string } {
  const codons: string[] = []
  for (let i = 0; i + 2 < mrna.length; i += 3) {
    codons.push(mrna.slice(i, i + 3))
  }
  const remainderStart = codons.length * 3
  return { codons, remainder: mrna.slice(remainderStart) }
}

export function translateCodon(codon: string): string {
  return GENETIC_CODE[codon] ?? 'Unknown'
}

export function findStartCodons(codons: string[]): number[] {
  return codons.flatMap((codon, index) => (codon === 'AUG' ? [index] : []))
}

export function findStopCodons(codons: string[]): number[] {
  return codons.flatMap((codon, index) => (STOP_CODONS.has(codon) ? [index] : []))
}

export function translateMrna(mrna: string): TranslationResult {
  const { codons, remainder } = splitCodons(mrna)
  const aminoAcids = codons.map((codon) => translateCodon(codon))
  return {
    mrna,
    codons,
    remainder,
    aminoAcids,
    aminoAcidSequence: aminoAcids.join('-'),
    startCodonIndexes: findStartCodons(codons),
    stopCodonIndexes: findStopCodons(codons),
  }
}

export function mutateDna(sequence: string, type: MutationType): MutationResult {
  if (sequence.length === 0) {
    throw new Error('Cannot mutate empty sequence')
  }

  if (type === 'substitution') {
    const position = Math.floor(Math.random() * sequence.length)
    const before = sequence[position]
    const candidates = ['A', 'T', 'C', 'G'].filter((base) => base !== before)
    const after = candidates[Math.floor(Math.random() * candidates.length)]
    const mutatedSequence = `${sequence.slice(0, position)}${after}${sequence.slice(position + 1)}`
    return { type, position, before, after, label: `第 ${position + 1} 位碱基替换`, mutatedSequence }
  }

  if (type === 'insertion') {
    const position = Math.floor(Math.random() * (sequence.length + 1))
    const after = RNA_BASES[Math.floor(Math.random() * RNA_BASES.length)].replace('U', 'T')
    const mutatedSequence = `${sequence.slice(0, position)}${after}${sequence.slice(position)}`
    return { type, position, before: '-', after, label: `第 ${position + 1} 位发生碱基插入`, mutatedSequence }
  }

  const position = Math.floor(Math.random() * sequence.length)
  const before = sequence[position]
  const mutatedSequence = `${sequence.slice(0, position)}${sequence.slice(position + 1)}`
  return { type, position, before, after: '-', label: `第 ${position + 1} 位发生碱基缺失`, mutatedSequence }
}

export function compareTranslations(
  before: TranslationResult,
  after: TranslationResult,
  mutation: MutationResult,
): MutationClassification {
  if (before.aminoAcidSequence === after.aminoAcidSequence) {
    return { kind: 'synonymous', message: '同义突变：氨基酸序列未发生变化。' }
  }

  if (mutation.type === 'insertion' || mutation.type === 'deletion') {
    return { kind: 'frameshift', message: '移码突变：插入或缺失改变了阅读框。' }
  }

  const beforeStop = before.stopCodonIndexes[0]
  const afterStop = after.stopCodonIndexes[0]
  if (afterStop !== undefined && (beforeStop === undefined || afterStop < beforeStop)) {
    return { kind: 'nonsense', message: '无义突变：检测到提前终止密码子。' }
  }

  return { kind: 'missense', message: '错义突变：氨基酸序列发生改变。' }
}

export function transcribeFromMode(sequence: string, mode: TranscriptionMode): string {
  return mode === 'template' ? transcribeTemplateDnaToMrna(sequence) : transcribeCodingDnaToMrna(sequence)
}
