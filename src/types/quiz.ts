export interface QuizOption {
  label: string
  text: string
  scores: Record<string, number>
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export interface QuizResult {
  id: string
  name: string
  title: string
  keywords: string[]
  description: string
  scienceExplanation: string
  quote: string
  color: string
  enabled: boolean
}

export interface OrganelleCharacter extends QuizResult {
  role: string
  appearance: string
  function: string
  lines: string[]
  events: string[]
}
