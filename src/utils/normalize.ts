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
