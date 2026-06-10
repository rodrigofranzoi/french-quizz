import { PHRASE_CONTEXTS } from '../data/phrases';
import { VERBS } from '../data/verbs';
import type {
  ConjugationQuestion,
  GameSettings,
  PhraseQuestion,
  Pronoun,
  Tense,
  VerbEntry,
} from '../types';
import { PRONOUNS } from '../types';
import {
  getAllConjugations,
  getConjugation,
  getNegativeConjugation,
  tenseLabel,
} from './conjugation';

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function eligibleVerbs(tenses: Tense[]): VerbEntry[] {
  return VERBS.filter((v) => v.infinitive !== 'pleuvoir' || tenses.length > 0);
}

export function generatePhraseQuestion(settings: GameSettings): PhraseQuestion {
  const verbs = eligibleVerbs(settings.tenses);
  const verb = pick(verbs);
  const tense = pick(settings.tenses);
  const pool = settings.includeNegative
    ? PHRASE_CONTEXTS
    : PHRASE_CONTEXTS.filter((c) => !c.before.includes(' ne '));
  const context = pick(pool);
  const negative = context.before.includes(' ne ') || context.after.startsWith(' pas');
  const pronoun = context.pronoun;

  const answer = negative
    ? getNegativeConjugation(verb, tense, pronoun)
    : getConjugation(verb, tense, pronoun);

  return {
    verb,
    tense,
    pronoun,
    negative,
    before: context.before,
    after: context.after,
    answer,
    hint: `${verb.infinitive} (${tenseLabel(tense)})`,
  };
}

export function generateConjugationQuestion(
  settings: GameSettings,
): ConjugationQuestion {
  const verbs = eligibleVerbs(settings.tenses).filter(
    (v) => v.infinitive !== 'asseoir' && v.infinitive !== 'pleuvoir',
  );
  const verb = pick(verbs);
  const tense = pick(settings.tenses);
  const negative =
    settings.includeNegative && Math.random() > 0.4 ? true : false;

  return {
    verb,
    tense,
    negative,
    answers: getAllConjugations(verb, tense, negative),
  };
}

export function generatePhraseChoices(
  question: PhraseQuestion,
  count = 4,
): string[] {
  const wrong = new Set<string>();
  const otherTenses: Tense[] = ['passe_compose', 'futur_proche', 'futur_simple'].filter(
    (t) => t !== question.tense,
  ) as Tense[];

  while (wrong.size < count - 1) {
    const v = pick(VERBS);
    const t = Math.random() > 0.5 ? question.tense : pick(otherTenses);
    const p = pick(PRONOUNS);
    const form = question.negative
      ? getNegativeConjugation(v, t, p)
      : getConjugation(v, t, p);
    if (form !== question.answer) wrong.add(form);
  }

  return shuffle([question.answer, ...Array.from(wrong)]);
}

export function generateConjugationDistractor(
  verb: VerbEntry,
  tense: Tense,
  pronoun: Pronoun,
  negative: boolean,
  correct: string,
): string {
  const attempts = 20;
  for (let i = 0; i < attempts; i++) {
    const v = Math.random() > 0.5 ? verb : pick(VERBS);
    const t = Math.random() > 0.5 ? tense : pick(['passe_compose', 'futur_proche', 'futur_simple'] as Tense[]);
    const p = Math.random() > 0.5 ? pronoun : pick(PRONOUNS);
    const form = negative
      ? getNegativeConjugation(v, t, p)
      : getConjugation(v, t, p);
    if (form !== correct) return form;
  }
  return correct + 's';
}
