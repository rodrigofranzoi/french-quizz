import type { Pronoun } from '../types';

export interface PhraseContext {
  before: string;
  after: string;
  pronoun: Pronoun;
}

export const PHRASE_CONTEXTS: PhraseContext[] = [
  { before: 'Hier, ', after: ' le livre à la bibliothèque.', pronoun: 'je' },
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
  { before: 'Hier, je ne ', after: ' pas mon parapluie.', pronoun: 'je' },
  { before: 'Demain, tu ne ', after: ' pas en retard.', pronoun: 'tu' },
  { before: 'Elle ne ', after: ' pas la vérité hier.', pronoun: 'elle' },
  { before: 'Nous ne ', after: ' pas encore la réponse.', pronoun: 'nous' },
  { before: 'Vous ne ', after: ' pas ce film, n\'est-ce pas ?', pronoun: 'vous' },
  { before: 'Elles ne ', after: ' pas à la fête samedi.', pronoun: 'elles' },
  { before: 'Je ne ', after: ' pas sortir ce soir.', pronoun: 'je' },
  { before: 'Tu ne ', after: ' pas ce livre demain.', pronoun: 'tu' },
  { before: 'Elle ne ', after: ' pas travailler lundi.', pronoun: 'elle' },
  { before: 'Nous ne ', after: ' pas voyager cet été.', pronoun: 'nous' },
  { before: 'Vous ne ', after: ' pas nous voir bientôt.', pronoun: 'vous' },
  { before: 'Elles ne ', after: ' pas acheter cette maison.', pronoun: 'elles' },
];
