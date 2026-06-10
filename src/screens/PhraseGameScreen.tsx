import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors, spacing } from '../theme';
import type { GameSettings } from '../types';
import { tenseLabel } from '../utils/conjugation';
import { answersMatch } from '../utils/normalize';
import {
  generatePhraseChoices,
  generatePhraseQuestion,
} from '../utils/quiz';

interface PhraseGameScreenProps {
  settings: GameSettings;
  onBack: () => void;
}

export function PhraseGameScreen({ settings, onBack }: PhraseGameScreenProps) {
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [question, setQuestion] = useState(() => generatePhraseQuestion(settings));
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const choices = useMemo(
    () =>
      settings.inputMode === 'multiple_choice'
        ? generatePhraseChoices(question)
        : [],
    [question, settings.inputMode],
  );

  const nextQuestion = useCallback(() => {
    setQuestion(generatePhraseQuestion(settings));
    setInput('');
    setFeedback(null);
  }, [settings]);

  const checkAnswer = (answer: string) => {
    const ok = answersMatch(answer, question.answer);
    setFeedback(ok ? 'correct' : 'wrong');
    setScore((s) => ({
      correct: s.correct + (ok ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const displayBefore = question.negative
    ? question.before
    : question.before;
  const displayAfter = question.negative
    ? question.after
    : question.after;

  return (
    <ScreenLayout
      title="Compléter la phrase"
      subtitle={`Score : ${score.correct} / ${score.total}`}
      onBack={onBack}
    >
      <View style={styles.meta}>
        <Text style={styles.badge}>{tenseLabel(question.tense)}</Text>
        {question.negative && <Text style={styles.badgeNeg}>Négatif</Text>}
      </View>

      <View style={styles.phraseCard}>
        <Text style={styles.phrase}>
          {displayBefore}
          <Text style={styles.blank}> ___ </Text>
          {displayAfter}
        </Text>
        <Text style={styles.hint}>Verbe : {question.hint}</Text>
      </View>

      {settings.inputMode === 'keyboard' ? (
        <View>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ta réponse…"
            autoCapitalize="none"
            autoCorrect={false}
            editable={feedback === null}
          />
          {feedback === null && (
            <Button title="Vérifier" onPress={() => checkAnswer(input)} />
          )}
        </View>
      ) : (
        <View>
          {choices.map((choice) => (
            <Button
              key={choice}
              title={choice}
              variant={feedback ? (answersMatch(choice, question.answer) ? 'primary' : 'outline') : 'outline'}
              onPress={() => feedback === null && checkAnswer(choice)}
              disabled={feedback !== null}
              style={styles.choice}
            />
          ))}
        </View>
      )}

      {feedback && (
        <View style={[styles.feedback, feedback === 'correct' ? styles.ok : styles.ko]}>
          <Text style={styles.feedbackText}>
            {feedback === 'correct' ? '✓ Correct !' : `✗ Réponse : ${question.answer}`}
          </Text>
          <Button title="Question suivante" onPress={nextQuestion} style={styles.next} />
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  meta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    color: '#fff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: '600',
  },
  badgeNeg: {
    backgroundColor: colors.accent,
    color: '#fff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  phraseCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  phrase: {
    fontSize: 20,
    color: colors.text,
    lineHeight: 30,
  },
  blank: {
    color: colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  hint: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 18,
    marginBottom: spacing.md,
    color: colors.text,
  },
  choice: {
    marginBottom: spacing.sm,
  },
  feedback: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
  },
  ok: {
    backgroundColor: '#DCFCE7',
  },
  ko: {
    backgroundColor: '#FEE2E2',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  next: {
    marginTop: spacing.sm,
  },
});
