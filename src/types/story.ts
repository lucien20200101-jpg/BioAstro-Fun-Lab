export type StoryNodeStatus = 'start' | 'normal' | 'challenge' | 'ending'

export interface StoryOption {
  text: string
  effects: string[]
  nextNodeId: string
  feedback: string
}

export interface StoryNode {
  id: string
  title: string
  description: string
  status: StoryNodeStatus
  options: StoryOption[]
}
