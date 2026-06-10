import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import type { Pronoun, Tense, VerbEntry } from '../types';
import { PRONOUNS } from '../types';
import { getAllConjugations, tenseLabel } from '../utils/conjugation';
import { formatPronounForm } from '../utils/display';

interface ConjugationTableProps {
  verb: VerbEntry;
  tense: Tense;
  negative: boolean;
  highlightPronoun?: Pronoun;
  /** Show complete forms (j'ai oublié) instead of verb-only (ai oublié). */
  showFullForms?: boolean;
}

export function ConjugationTable({
  verb,
  tense,
  negative,
  highlightPronoun,
  showFullForms = false,
}: ConjugationTableProps) {
  const forms = getAllConjugations(verb, tense, negative);

  return (
    <View style={styles.table}>
      <Text style={styles.title}>
        {verb.infinitive} — {tenseLabel(tense)}
        {negative ? ' (négatif)' : ''}
      </Text>
      {PRONOUNS.map((p) => (
        <View
          key={p}
          style={[styles.row, highlightPronoun === p && styles.highlight]}
        >
          {showFullForms ? (
            <Text style={styles.fullForm}>{formatPronounForm(p, forms[p])}</Text>
          ) : (
            <>
              <Text style={styles.pronoun}>{p}</Text>
              <Text style={styles.form}>{forms[p]}</Text>
            </>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
  },
  highlight: {
    backgroundColor: '#DBEAFE',
  },
  pronoun: {
    width: 56,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  form: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  fullForm: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
});
