export interface TenseRule {
  id: string;
  title: string;
  formation: string;
  examples: string[];
  negative: string;
  tips: string[];
}

export const TENSE_RULES: TenseRule[] = [
  {
    id: 'present',
    title: 'Présent',
    formation:
      'Radical + terminaisons selon le groupe du verbe.\n\n' +
      '• -er : -e, -es, -e, -ons, -ez, -ent (parler → je parle, nous parlons)\n' +
      '• -ir / -re : terminaisons variées (finir → finis, finissons / vendre → vends, vendons)\n' +
      '• Nombreux verbes irréguliers : être, avoir, faire, aller, venir, pouvoir…',
    examples: [
      'Je parle français.',
      'Tu lis un livre.',
      'Elle arrive à l\'heure.',
      'Nous préparons le dîner.',
    ],
    negative:
      'ne + verbe conjugué + pas\n\n' +
      'Exemples : Je ne parle pas. / Tu n\'oublies pas. / Nous n\'arrivons pas.',
    tips: [
      'Le présent exprime une action habituelle, un fait actuel ou une vérité générale.',
      'Attention aux verbes en -ger (mangeons) et -cer (commençons) à la 1ʳᵉ personne du pluriel.',
    ],
  },
  {
    id: 'passe_compose',
    title: 'Passé composé',
    formation:
      'Auxiliaire (avoir ou être) au présent + participe passé.\n\n' +
      '• La plupart des verbes utilisent avoir : j\'ai mangé, tu as fini.\n' +
      '• Les verbes de mouvement et certains verbes (aller, venir, naître, mourir…) utilisent être : je suis allé(e), elle est partie.\n' +
      '• Le participe passé s\'accorde avec le sujet avec être.',
    examples: [
      'J\'ai oublié mes clés.',
      'Elle est arrivée à midi.',
      'Nous avons préparé le repas.',
      'Ils sont partis tôt.',
    ],
    negative:
      'ne + auxiliaire + pas + participe passé\n\n' +
      'Exemples : Je n\'ai pas compris. / Elle n\'est pas venue. / Nous n\'avons pas fini.',
    tips: [
      'Participes passés irréguliers fréquents : fait, dit, pris, vu, eu, été, bu, lu.',
      'Avec avoir, le participe passé ne s\'accorde pas (sauf cas du COD placé avant).',
    ],
  },
  {
    id: 'futur_proche',
    title: 'Futur proche',
    formation:
      'Verbe aller au présent + infinitif du verbe principal.\n\n' +
      'je vais + infinitif / tu vas + infinitif / il/elle va + infinitif\n' +
      'nous allons + infinitif / vous allez + infinitif / ils/elles vont + infinitif',
    examples: [
      'Je vais partir demain.',
      'Tu vas manger bientôt.',
      'Nous allons voyager en été.',
      'Elles vont arriver à 18h.',
    ],
    negative:
      'ne + aller + pas + infinitif\n\n' +
      'Exemples : Je ne vais pas sortir. / Elle ne va pas venir. / Nous n\'allons pas partir.',
    tips: [
      'Exprime une action proche dans le futur ou une intention.',
      'Plus simple que le futur simple — très courant à l\'oral.',
    ],
  },
  {
    id: 'futur_simple',
    title: 'Futur simple',
    formation:
      'Infinitif (ou radical irrégulier) + terminaisons : -ai, -as, -a, -ons, -ez, -ont.\n\n' +
      'parler → je parlerai, tu parleras, il parlera…\n' +
      'Radicaux irréguliers : être → ser-, avoir → aur-, faire → fer-, aller → ir-, voir → verr-',
    examples: [
      'Je parlerai avec lui demain.',
      'Tu finiras ce projet bientôt.',
      'Elle sera là à 9 heures.',
      'Nous partirons lundi matin.',
    ],
    negative:
      'ne + verbe conjugué au futur + pas\n\n' +
      'Exemples : Je ne parlerai pas. / Elle ne viendra pas. / Nous n\'irons pas.',
    tips: [
      'Utilisé pour des actions futures plus lointaines ou formelles.',
      'Le « e » muet disparaît à l\'oral : je parlerai → « je parlerai » / « j\'parlerai ».',
    ],
  },
];
