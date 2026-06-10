export type AnswerGrade = 'correct' | 'accent_missing' | 'wrong';

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

/** Grade answer: exact match, accent-free match, or wrong. */
export function gradeAnswer(user: string, expected: string): AnswerGrade {
  const u = user.trim().replace(/\s+/g, ' ');
  const e = expected.trim().replace(/\s+/g, ' ');

  if (u === e) return 'correct';
  if (normalizeAnswer(u) === normalizeAnswer(e)) return 'accent_missing';
  return 'wrong';
}

export function isGradedCorrect(grade: AnswerGrade): boolean {
  return grade === 'correct' || grade === 'accent_missing';
}
