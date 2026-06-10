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
import { PRONOUNS, TENSES } from '../types';
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
    : PHRASE_CONTEXTS.filter((c) => !c.negative);
  const context = pick(pool);
  const negative = context.negative ?? false;
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
    hint: `${verb.infinitive} — ${verb.english} (${tenseLabel(tense)})`,
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
    pronoun: pick(PRONOUNS),
    answers: getAllConjugations(verb, tense, negative),
  };
}

function formFor(
  verb: VerbEntry,
  tense: Tense,
  pronoun: Pronoun,
  negative: boolean,
): string {
  return negative
    ? getNegativeConjugation(verb, tense, pronoun)
    : getConjugation(verb, tense, pronoun);
}

/** Wrong answers from the same verb, same polarity (no affirmative/negative flip). */
function getSameVerbDistractors(
  verb: VerbEntry,
  tense: Tense,
  pronoun: Pronoun,
  negative: boolean,
  correct: string,
): string[] {
  const candidates = new Set<string>();

  for (const t of TENSES) {
    if (t !== tense) {
      candidates.add(formFor(verb, t, pronoun, negative));
    }
  }

  for (const p of PRONOUNS) {
    if (p !== pronoun) {
      candidates.add(formFor(verb, tense, p, negative));
    }
  }

  for (const t of TENSES) {
    for (const p of PRONOUNS) {
      if (t === tense && p === pronoun) continue;
      candidates.add(formFor(verb, t, p, negative));
    }
  }

  candidates.delete(correct);
  return shuffle(Array.from(candidates));
}

function pickDistractors(
  verb: VerbEntry,
  tense: Tense,
  pronoun: Pronoun,
  negative: boolean,
  correct: string,
  count: number,
): string[] {
  const pool = getSameVerbDistractors(verb, tense, pronoun, negative, correct);
  return pool.slice(0, count);
}

export function generatePhraseChoices(
  question: PhraseQuestion,
  count = 4,
): string[] {
  const wrong = pickDistractors(
    question.verb,
    question.tense,
    question.pronoun,
    question.negative,
    question.answer,
    count - 1,
  );

  return shuffle([question.answer, ...wrong]);
}

export function generateConjugationChoices(
  verb: VerbEntry,
  tense: Tense,
  pronoun: Pronoun,
  negative: boolean,
  correct: string,
  count = 4,
): string[] {
  const wrong = pickDistractors(verb, tense, pronoun, negative, correct, count - 1);
  return shuffle([correct, ...wrong]);
}
