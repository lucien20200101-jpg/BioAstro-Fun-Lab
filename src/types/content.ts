export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface RandomFact {
  id: string
  title: string
  category: string
  summary: string
  detail: string
  keywords: string[]
  question: string
  difficulty: DifficultyLevel
  enabled: boolean
  sourceNote?: string
}

export interface KnowledgeCard {
  id: string
  name: string
  category: string
  summary: string
  explanation: string
  analogy: string
  keywords: string[]
  misconceptions: string[]
  extensionQuestion: string
  enabled: boolean
}
