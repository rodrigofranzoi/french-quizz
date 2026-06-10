export const PRONOUNS = ['je', 'tu', 'elle', 'nous', 'vous', 'elles'] as const;
export type Pronoun = (typeof PRONOUNS)[number];

export const TENSES = ['passe_compose', 'futur_proche', 'futur_simple'] as const;
export type Tense = (typeof TENSES)[number];

export type InputMode = 'multiple_choice' | 'keyboard';

export type Screen =
  | 'home'
  | 'phrase_setup'
  | 'phrase_game'
  | 'conjugation_setup'
  | 'conjugation_game'
  | 'info';

export interface GameSettings {
  tenses: Tense[];
  inputMode: InputMode;
  includeNegative: boolean;
}

export interface VerbEntry {
  infinitive: string;
  english: string;
  auxiliary: 'avoir' | 'etre' | 'impersonal';
  passeCompose: Record<Pronoun, string>;
  futurProche: Record<Pronoun, string>;
  futurSimple: Record<Pronoun, string>;
  /** Feminine past participle forms for être verbs (elle, elles) */
  passeComposeFeminine?: Partial<Record<'elle' | 'elles', string>>;
}

export interface PhraseQuestion {
  verb: VerbEntry;
  tense: Tense;
  pronoun: Pronoun;
  negative: boolean;
  before: string;
  after: string;
  answer: string;
  hint: string;
}

export interface ConjugationQuestion {
  verb: VerbEntry;
  tense: Tense;
  negative: boolean;
  answers: Record<Pronoun, string>;
}
