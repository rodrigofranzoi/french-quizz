import type { Pronoun, Tense, VerbEntry } from '../types';
import { getMasculineEtrePasseCompose } from './conjugation';
import { formatPronounForm, stripPronounPrefix } from './display';

export type AnswerGrade =
  | 'correct'
  | 'accent_missing'
  | 'gender_warning'
  | 'accent_and_gender'
  | 'wrong';

export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/'/g, "'")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function answersMatch(user: string, expected: string): boolean {
  return normalizeAnswer(user) === normalizeAnswer(expected);
}

type MatchQuality = 'exact' | 'accent' | null;

function matchQuality(user: string, expected: string): MatchQuality {
  if (user === expected) return 'exact';
  if (normalizeAnswer(user) === normalizeAnswer(expected)) return 'accent';
  return null;
}

function combineGrade(
  quality: 'exact' | 'accent',
  genderWarn: boolean,
): AnswerGrade {
  if (quality === 'exact' && !genderWarn) return 'correct';
  if (quality === 'exact' && genderWarn) return 'gender_warning';
  if (quality === 'accent' && !genderWarn) return 'accent_missing';
  return 'accent_and_gender';
}

/**
 * Grade a keyboard answer: pronoun optional (je/j'/il/elle…), accents flexible,
 * masculine passé composé accepted for elle/elles with a warning when pronoun is included.
 */
export function gradeConjugationInput(
  user: string,
  expectedVerbForm: string,
  pronoun: Pronoun,
  verb: VerbEntry,
  tense: Tense,
  negative: boolean,
): AnswerGrade {
  const trimmed = user.trim().replace(/\s+/g, ' ');
  if (!trimmed) return 'wrong';

  const expectedFull = formatPronounForm(pronoun, expectedVerbForm);
  const { form: verbOnly, hadPronoun } = stripPronounPrefix(trimmed);
  const candidates = [trimmed, verbOnly];

  let quality: MatchQuality = null;
  for (const c of candidates) {
    quality =
      matchQuality(c, expectedVerbForm) ?? matchQuality(c, expectedFull);
    if (quality) break;
  }

  let genderWarn = false;

  if (
    !quality &&
    (pronoun === 'elle' || pronoun === 'elles') &&
    tense === 'passe_compose'
  ) {
    const masculine = getMasculineEtrePasseCompose(verb, pronoun, negative);
    if (masculine) {
      for (const c of candidates) {
        const q = matchQuality(c, masculine);
        if (q) {
          quality = q;
          genderWarn =
            hadPronoun &&
            normalizeAnswer(c) !== normalizeAnswer(expectedVerbForm);
          break;
        }
      }
    }
  }

  if (!quality) return 'wrong';
  return combineGrade(quality, genderWarn);
}

/** @deprecated Use gradeConjugationInput for keyboard mode. */
export function gradeAnswer(user: string, expected: string): AnswerGrade {
  const u = user.trim().replace(/\s+/g, ' ');
  const e = expected.trim().replace(/\s+/g, ' ');

  if (u === e) return 'correct';
  if (normalizeAnswer(u) === normalizeAnswer(e)) return 'accent_missing';
  return 'wrong';
}

export function isGradedCorrect(grade: AnswerGrade): boolean {
  return grade !== 'wrong';
}

export function gradeHasAccentWarning(grade: AnswerGrade): boolean {
  return grade === 'accent_missing' || grade === 'accent_and_gender';
}

export function gradeHasGenderWarning(grade: AnswerGrade): boolean {
  return grade === 'gender_warning' || grade === 'accent_and_gender';
}

export function gradeFeedbackLabel(grade: AnswerGrade): string {
  switch (grade) {
    case 'correct':
      return '✓ Correct !';
    case 'accent_missing':
      return '✓ Correct — accents oubliés !';
    case 'gender_warning':
      return '✓ Correct — accord masculin/féminin !';
    case 'accent_and_gender':
      return '✓ Correct — accents et accord à revoir !';
    case 'wrong':
      return '✗ Incorrect';
  }
}
