export interface DNAMutation {
  id: string
  from: string
  to: string
  impact: string
}

export interface DNACaseQuestion {
  id: string
  prompt: string
  hint: string
  expectedKeywords: string[]
}

export interface DNACase {
  id: string
  name: string
  dnaSequence: string
  description: string
  knowledgePoints: string[]
  mutations: DNAMutation[]
  questions: DNACaseQuestion[]
  enabled: boolean
}
