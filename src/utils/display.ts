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

/** Insert conjugation into a phrase fragment that already contains the subject. */
export function assemblePhrase(before: string, form: string, after: string): string {
  if (/\bje $/i.test(before) && jeElides(form)) {
    return before.replace(/je $/i, `j'${form}`) + after;
  }
  return before + form + after;
}
