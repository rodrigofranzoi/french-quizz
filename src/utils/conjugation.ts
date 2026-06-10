import type { Pronoun, Tense, VerbEntry } from '../types';
import { PRONOUNS } from '../types';

const AVOIR_PC: Record<Pronoun, string> = {
  je: "j'ai",
  tu: 'as',
  elle: 'a',
  nous: 'avons',
  vous: 'avez',
  elles: 'ont',
};

const ETRE_PC: Record<Pronoun, string> = {
  je: 'suis',
  tu: 'es',
  elle: 'est',
  nous: 'sommes',
  vous: 'êtes',
  elles: 'sont',
};

const ALLER_FP: Record<Pronoun, string> = {
  je: 'vais',
  tu: 'vas',
  elle: 'va',
  nous: 'allons',
  vous: 'allez',
  elles: 'vont',
};

const FS_ENDINGS: Record<Pronoun, string> = {
  je: 'ai',
  tu: 'as',
  elle: 'a',
  nous: 'ons',
  vous: 'ez',
  elles: 'ont',
};

export function buildPasseComposeAvoir(
  pastParticiple: string,
  feminine?: Partial<Record<'elle' | 'elles', string>>,
): Record<Pronoun, string> {
  const base = (p: Pronoun, pp: string) => {
    const aux = AVOIR_PC[p];
    return p === 'je' ? `${aux} ${pp}` : `${aux} ${pp}`;
  };
  return {
    je: base('je', pastParticiple),
    tu: `as ${pastParticiple}`,
    elle: `a ${feminine?.elle ?? pastParticiple}`,
    nous: `avons ${pastParticiple}`,
    vous: `avez ${pastParticiple}`,
    elles: `ont ${feminine?.elles ?? pastParticiple}`,
  };
}

export function buildPasseComposeEtre(
  pastParticiple: string,
  feminine?: Partial<Record<'elle' | 'elles', string>>,
): Record<Pronoun, string> {
  return {
    je: `suis ${pastParticiple}`,
    tu: `es ${pastParticiple}`,
    elle: `est ${feminine?.elle ?? pastParticiple}`,
    nous: `sommes ${pastParticiple}`,
    vous: `êtes ${pastParticiple}`,
    elles: `sont ${feminine?.elles ?? pastParticiple}`,
  };
}

export function buildFuturProche(infinitive: string): Record<Pronoun, string> {
  return {
    je: `vais ${infinitive}`,
    tu: `vas ${infinitive}`,
    elle: `va ${infinitive}`,
    nous: `allons ${infinitive}`,
    vous: `allez ${infinitive}`,
    elles: `vont ${infinitive}`,
  };
}

export function buildFuturSimple(stem: string): Record<Pronoun, string> {
  return PRONOUNS.reduce(
    (acc, p) => {
      acc[p] = p === 'je' ? `${stem}${FS_ENDINGS[p]}` : `${stem}${FS_ENDINGS[p]}`;
      return acc;
    },
    {} as Record<Pronoun, string>,
  );
}

export function getConjugation(
  verb: VerbEntry,
  tense: Tense,
  pronoun: Pronoun,
): string {
  switch (tense) {
    case 'passe_compose':
      return verb.passeCompose[pronoun];
    case 'futur_proche':
      return verb.futurProche[pronoun];
    case 'futur_simple':
      return verb.futurSimple[pronoun];
  }
}

export function getNegativeConjugation(
  verb: VerbEntry,
  tense: Tense,
  pronoun: Pronoun,
): string {
  const form = getConjugation(verb, tense, pronoun);

  switch (tense) {
    case 'passe_compose': {
      if (verb.auxiliary === 'etre') {
        const aux = ETRE_PC[pronoun];
        const pp = form.replace(/^(suis|es|est|sommes|êtes|sont) /, '');
        const negAux =
          pronoun === 'je'
            ? "ne suis pas"
            : pronoun === 'tu'
              ? 'ne es pas'
              : pronoun === 'elle'
                ? "n'est pas"
                : pronoun === 'nous'
                  ? 'ne sommes pas'
                  : pronoun === 'vous'
                    ? "n'êtes pas"
                    : 'ne sont pas';
        return `${negAux} ${pp}`;
      }
      const pp = form.replace(/^(j'ai|as|a|avons|avez|ont) /, '');
      const negMap: Record<Pronoun, string> = {
        je: "n'ai pas",
        tu: "n'as pas",
        elle: "n'a pas",
        nous: "n'avons pas",
        vous: "n'avez pas",
        elles: "n'ont pas",
      };
      return `${negMap[pronoun]} ${pp}`;
    }
    case 'futur_proche': {
      const inf = form.replace(/^(vais|vas|va|allons|allez|vont) /, '');
      const negAller: Record<Pronoun, string> = {
        je: 'ne vais pas',
        tu: 'ne vas pas',
        elle: 'ne va pas',
        nous: "n'allons pas",
        vous: "n'allez pas",
        elles: 'ne vont pas',
      };
      return `${negAller[pronoun]} ${inf}`;
    }
    case 'futur_simple': {
      if (pronoun === 'je') {
        const startsVowel = /^[aeiouhéèêëàâîïôùûü]/i.test(form);
        return startsVowel ? `n'${form} pas` : `ne ${form} pas`;
      }
      return `ne ${form} pas`;
    }
  }
}

export function getAllConjugations(
  verb: VerbEntry,
  tense: Tense,
  negative: boolean,
): Record<Pronoun, string> {
  return PRONOUNS.reduce(
    (acc, p) => {
      acc[p] = negative
        ? getNegativeConjugation(verb, tense, p)
        : getConjugation(verb, tense, p);
      return acc;
    },
    {} as Record<Pronoun, string>,
  );
}

export function tenseLabel(tense: Tense): string {
  switch (tense) {
    case 'passe_compose':
      return 'Passé composé';
    case 'futur_proche':
      return 'Futur proche';
    case 'futur_simple':
      return 'Futur simple';
  }
}
