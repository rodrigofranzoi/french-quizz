import type { Pronoun } from '../types';

export interface PhraseContext {
  before: string;
  after: string;
  pronoun: Pronoun;
  negative?: boolean;
  /** Phrases for movement/état verbs with auxiliary être. */
  etreOnly?: boolean;
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

  // Passé composé + être (movement, arrival, departure)
  { before: 'Hier, je ', after: ' à Paris en train.', pronoun: 'je', etreOnly: true },
  { before: 'Ce matin, tu ', after: ' de bonne heure.', pronoun: 'tu', etreOnly: true },
  { before: 'Samedi, elle ', after: ' à la fête de Marie.', pronoun: 'elle', etreOnly: true },
  { before: 'La semaine dernière, nous ', after: ' en Espagne.', pronoun: 'nous', etreOnly: true },
  { before: 'Hier soir, vous ', after: ' au restaurant italien.', pronoun: 'vous', etreOnly: true },
  { before: 'Dimanche, elles ', after: ' du marché à midi.', pronoun: 'elles', etreOnly: true },
  { before: 'Hier, je ', after: ' de chez moi à 18 heures.', pronoun: 'je', etreOnly: true },
  { before: 'Ce matin, tu ', after: ' dans la salle de cours.', pronoun: 'tu', etreOnly: true },
  { before: 'L\'après-midi, elle ', after: ' du bureau tard.', pronoun: 'elle', etreOnly: true },
  { before: 'Hier, nous ', after: ' du musée fatigués.', pronoun: 'nous', etreOnly: true },
  { before: 'Ce matin, vous ', after: ' à l\'école ensemble.', pronoun: 'vous', etreOnly: true },
  { before: 'Hier soir, elles ', after: ' du cinéma joyeuses.', pronoun: 'elles', etreOnly: true },
  { before: 'En juin, je ', after: ' dans cette ville.', pronoun: 'je', etreOnly: true },
  { before: 'L\'année dernière, tu ', after: ' en Italie pour les vacances.', pronoun: 'tu', etreOnly: true },
  { before: 'Hier, elle ', after: ' de chez ses parents.', pronoun: 'elle', etreOnly: true },
  { before: 'Ce week-end, nous ', after: ' à la montagne.', pronoun: 'nous', etreOnly: true },
  { before: 'Hier matin, vous ', after: ' au bureau à 9 heures.', pronoun: 'vous', etreOnly: true },
  { before: 'La semaine passée, elles ', after: ' en France.', pronoun: 'elles', etreOnly: true },
  { before: 'À 7 heures, je ', after: ' à l\'école.', pronoun: 'je', etreOnly: true },
  { before: 'Tard le soir, tu ', after: ' dans ta chambre.', pronoun: 'tu', etreOnly: true },
  { before: 'Hier, je ', after: ' pas à l\'heure au rendez-vous.', pronoun: 'je', etreOnly: true, negative: true },
  { before: 'Ce matin, tu ', after: ' pas de la maison.', pronoun: 'tu', etreOnly: true, negative: true },
  { before: 'Samedi, elle ', after: ' pas à la réunion.', pronoun: 'elle', etreOnly: true, negative: true },
  { before: 'Hier, nous ', after: ' pas du tout fatigués.', pronoun: 'nous', etreOnly: true, negative: true },
  { before: 'Ce soir, vous ', after: ' pas encore.', pronoun: 'vous', etreOnly: true, negative: true },
  { before: 'Dimanche, elles ', after: ' pas de la fête.', pronoun: 'elles', etreOnly: true, negative: true },
];
