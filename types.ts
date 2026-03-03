
export enum PersonaType {
  MZ_NEWBIE = 'MZ_NEWBIE',
  CYNICAL_PART_TIMER = 'CYNICAL_PART_TIMER',
  HYPER_MARKETER = 'HYPER_MARKETER',
  EMO_CEO = 'EMO_CEO',
  MYSTERY_GURU = 'MYSTERY_GURU'
}

export interface Persona {
  id: PersonaType;
  name: string;
  emoji: string;
  description: string;
  promptInstruction: string;
}

export interface ViralFormula {
  id: string;
  title: string;
  emoji: string;
  description: string;
  tip: string;
  prompt: string;
}

export interface FormulaRecommendation {
  formulaId: string;
  reason: string;
}

export interface ProfileContent {
  name: string;
  bio: string;
  imagePrompt: string;
}

export type AppMode = 'TRANSFORM' | 'VIRAL_FORMULA' | 'ADVISOR' | 'PROFILE';
