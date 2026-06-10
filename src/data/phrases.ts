import type { Pronoun } from '../types';

export interface PhraseContext {
  before: string;
  after: string;
  pronoun: Pronoun;
  negative?: boolean;
}

export const PHRASE_CONTEXTS: PhraseContext[] = [
  { before: 'Chaque jour, je ', after: ' le journal le matin.', pronoun: 'je' },
  { before: 'Souvent, tu ', after: ' du piano le soir.', pronoun: 'tu' },
  { before: 'En ce moment, elle ', after: ' un roman intéressant.', pronoun: 'elle' },
  { before: 'Nous ', after: ' toujours à l\'heure.', pronoun: 'nous' },
  { before: 'Vous ', after: ' le français avec patience.', pronoun: 'vous' },
  { before: 'Elles ', after: ' au parc tous les mercredis.', pronoun: 'elles' },
  { before: 'Hier, je ', after: ' le livre à la bibliothèque.', pronoun: 'je' },
  { before: 'Demain, tu ', after: ' le bus à 8 heures.', pronoun: 'tu' },
  { before: 'La semaine dernière, elle ', after: ' un gâteau délicieux.', pronoun: 'elle' },
  { before: 'L\'année prochaine, nous ', after: ' en vacances en France.', pronoun: 'nous' },
  { before: 'Bientôt, vous ', after: ' vos amis au restaurant.', pronoun: 'vous' },
  { before: 'Hier soir, elles ', after: ' un film au cinéma.', pronoun: 'elles' },
  { before: 'Ce matin, je ', after: ' mon café tranquillement.', pronoun: 'je' },
  { before: 'Demain matin, tu ', after: ' ton travail à temps.', pronoun: 'tu' },
  { before: 'La semaine passée, elle ', after: ' une nouvelle robe.', pronoun: 'elle' },
  { before: 'Ce soir, nous ', after: ' le dîner ensemble.', pronoun: 'nous' },
  { before: 'Plus tard, vous ', after: ' la réunion importante.', pronoun: 'vous' },
  { before: 'Hier, elles ', after: ' leurs devoirs rapidement.', pronoun: 'elles' },
  { before: 'Hier, je ', after: ' mon parapluie.', pronoun: 'je', negative: true },
  { before: 'Demain, tu ', after: ' en retard.', pronoun: 'tu', negative: true },
  { before: 'La semaine dernière, elle ', after: ' la vérité.', pronoun: 'elle', negative: true },
  { before: 'Nous ', after: ' encore la réponse.', pronoun: 'nous', negative: true },
  { before: 'Vous ', after: ' ce film, n\'est-ce pas ?', pronoun: 'vous', negative: true },
  { before: 'Samedi, elles ', after: ' à la fête.', pronoun: 'elles', negative: true },
  { before: 'Ce soir, je ', after: ' sortir.', pronoun: 'je', negative: true },
  { before: 'Demain, tu ', after: ' ce livre.', pronoun: 'tu', negative: true },
  { before: 'Lundi, elle ', after: ' travailler.', pronoun: 'elle', negative: true },
  { before: 'Cet été, nous ', after: ' voyager.', pronoun: 'nous', negative: true },
  { before: 'Bientôt, vous ', after: ' nous voir.', pronoun: 'vous', negative: true },
  { before: 'Elles ', after: ' acheter cette maison.', pronoun: 'elles', negative: true },
];
