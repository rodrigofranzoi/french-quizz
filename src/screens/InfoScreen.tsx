import { StyleSheet, Text, View } from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { TENSE_RULES } from '../data/tenseRules';
import { colors, spacing } from '../theme';

interface InfoScreenProps {
  onBack: () => void;
}

export function InfoScreen({ onBack }: InfoScreenProps) {
  return (
    <ScreenLayout
      title="Règles des temps"
      subtitle="Passé composé, futur proche et futur simple — avec la forme négative."
      onBack={onBack}
    >
      {TENSE_RULES.map((rule) => (
        <View key={rule.id} style={styles.card}>
          <Text style={styles.cardTitle}>{rule.title}</Text>

          <Text style={styles.label}>Formation</Text>
          <Text style={styles.body}>{rule.formation}</Text>

          <Text style={styles.label}>Exemples</Text>
          {rule.examples.map((ex) => (
            <Text key={ex} style={styles.example}>
              • {ex}
            </Text>
          ))}

          <Text style={styles.label}>Négatif</Text>
          <Text style={styles.body}>{rule.negative}</Text>

          <Text style={styles.label}>À retenir</Text>
          {rule.tips.map((tip) => (
            <Text key={tip} style={styles.tip}>
              → {tip}
            </Text>
          ))}
        </View>
      ))}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  example: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  tip: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
});
