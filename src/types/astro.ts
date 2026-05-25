export interface ScaleItem {
  id: string
  name: string
  scaleMeter: number
  displayScale: string
  category: string
  summary: string
  detail: string
  enabled: boolean
}

export interface HabitabilityRule {
  id: string
  factor: string
  condition: string
  score: number
  explanation: string
  enabled: boolean
}

export interface WorldProfile {
  id: string
  name: string
  system: string
  worldType: string
  environmentType: string
  water: string
  energy: string
  organics: string
  atmosphere: string
  radiation: string
  stability: string
  risks: string[]
  possibleLife: string
  detectionAdvice: string
  lifePotentialScore: number
  enabled: boolean
}
