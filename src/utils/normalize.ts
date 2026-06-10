import type { Pronoun, Tense, VerbEntry } from '../types';
import { getMasculineEtrePasseCompose } from './conjugation';
import { formatPronounForm, stripPronounPrefix } from './display';

export type AnswerGrade =
  | 'correct'
  | 'accent_missing'
  | 'gender_warning'
  | 'spelling_warning'
  | 'accent_and_gender'
  | 'accent_and_spelling'
  | 'gender_and_spelling'
  | 'accent_gender_spelling'
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
  spellingWarn: boolean,
): AnswerGrade {
  if (quality === 'exact' && !genderWarn && !spellingWarn) return 'correct';
  if (quality === 'exact' && genderWarn && !spellingWarn) return 'gender_warning';
  if (quality === 'exact' && !genderWarn && spellingWarn) return 'spelling_warning';
  if (quality === 'exact' && genderWarn && spellingWarn) return 'gender_and_spelling';
  if (quality === 'accent' && !genderWarn && !spellingWarn) return 'accent_missing';
  if (quality === 'accent' && genderWarn && !spellingWarn) return 'accent_and_gender';
  if (quality === 'accent' && !genderWarn && spellingWarn) return 'accent_and_spelling';
  return 'accent_gender_spelling';
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
  const { form: verbOnly, hadPronoun, hadVouzTypo } = stripPronounPrefix(trimmed);
  const correctedFull = hadVouzTypo
    ? trimmed.replace(/^vouz\s+/i, 'vous ')
    : trimmed;
  const { form: correctedVerbOnly } = stripPronounPrefix(correctedFull);
  const candidates = [...new Set([trimmed, verbOnly, correctedFull, correctedVerbOnly])];

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

  const spellingWarn = pronoun === 'vous' && hadVouzTypo;
  return combineGrade(quality, genderWarn, spellingWarn);
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
  return (
    grade === 'gender_warning' ||
    grade === 'accent_and_gender' ||
    grade === 'gender_and_spelling' ||
    grade === 'accent_gender_spelling'
  );
}

export function gradeHasSpellingWarning(grade: AnswerGrade): boolean {
  return (
    grade === 'spelling_warning' ||
    grade === 'accent_and_spelling' ||
    grade === 'gender_and_spelling' ||
    grade === 'accent_gender_spelling'
  );
}

export function gradeFeedbackLabel(grade: AnswerGrade): string {
  switch (grade) {
    case 'correct':
      return '✓ Correct !';
    case 'accent_missing':
      return '✓ Correct — accents oubliés !';
    case 'gender_warning':
      return '✓ Correct — accord masculin/féminin !';
    case 'spelling_warning':
      return '✓ Correct — écris « vous », pas « vouz » !';
    case 'accent_and_gender':
      return '✓ Correct — accents et accord à revoir !';
    case 'accent_and_spelling':
      return '✓ Correct — accents et orthographe du pronom à revoir !';
    case 'gender_and_spelling':
      return '✓ Correct — accord et orthographe du pronom à revoir !';
    case 'accent_gender_spelling':
      return '✓ Correct — accents, accord et orthographe à revoir !';
    case 'wrong':
      return '✗ Incorrect';
  }
}
