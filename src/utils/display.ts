import type { Pronoun } from '../types';

/** True when « je » elides to « j' » before this form (not already n'…). */
function jeElides(form: string): boolean {
  if (/^n'/.test(form)) return false;
  return /^[aeiouhéèêëàâîïôùûü]/i.test(form);
}

/** Full subject + form, e.g. je + ai oublié → j'ai oublié */
export function formatPronounForm(pronoun: Pronoun, form: string): string {
  if (pronoun === 'je') {
    if (/^n'/.test(form)) return `je ${form}`;
    if (jeElides(form)) return `j'${form}`;
    return `je ${form}`;
  }
  return `${pronoun} ${form}`;
}

const SUBJECT_PREFIX =
  /^(je|j'|tu|il|elle|nous|vous|ils|elles)\s+/i;

/** Strip an optional subject pronoun from a typed answer. */
export function stripPronounPrefix(text: string): {
  form: string;
  hadPronoun: boolean;
} {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  const match = trimmed.match(SUBJECT_PREFIX);
  if (match) {
    return { form: trimmed.slice(match[0].length).trim(), hadPronoun: true };
  }
  return { form: trimmed, hadPronoun: false };
}

/** Remove subject pronoun from phrase prefix — keyboard answers include the pronoun. */
export function stripSubjectFromPhraseBefore(
  before: string,
  pronoun: Pronoun,
): string {
  const withComma = before.replace(new RegExp(`, ${pronoun} $`, 'i'), ', ');
  if (withComma !== before) return withComma;

  if (new RegExp(`^${pronoun} `, 'i').test(before)) {
    return before.replace(new RegExp(`^${pronoun} `, 'i'), '');
  }

  return before;
}

/** Insert conjugation into a phrase fragment that already contains the subject. */
export function assemblePhrase(before: string, form: string, after: string): string {
  if (/\bje $/i.test(before) && jeElides(form)) {
    return before.replace(/je $/i, `j'${form}`) + after;
  }
  return before + form + after;
}
