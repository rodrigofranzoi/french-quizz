import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors, spacing } from '../theme';
import type { GameSettings, Pronoun } from '../types';
import { PRONOUNS } from '../types';
import { tenseLabel } from '../utils/conjugation';
import { answersMatch } from '../utils/normalize';
import {
  generateConjugationDistractor,
  generateConjugationQuestion,
} from '../utils/quiz';

interface ConjugationGameScreenProps {
  settings: GameSettings;
  onBack: () => void;
}

const PRONOUN_LABELS: Record<Pronoun, string> = {
  je: 'je',
  tu: 'tu',
  elle: 'elle',
  nous: 'nous',
  vous: 'vous',
  elles: 'elles',
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ConjugationGameScreen({
  settings,
  onBack,
}: ConjugationGameScreenProps) {
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [question, setQuestion] = useState(() =>
    generateConjugationQuestion(settings),
  );
  const [pronounIndex, setPronounIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<Pronoun, string>>({
    je: '',
    tu: '',
    elle: '',
    nous: '',
    vous: '',
    elles: '',
  });
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<Pronoun, boolean> | null>(null);
  const [mcFeedback, setMcFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentPronoun = PRONOUNS[pronounIndex];
  const isMc = settings.inputMode === 'multiple_choice';

  const mcChoices = useMemo(() => {
    if (!isMc) return [];
    const correct = question.answers[currentPronoun];
    const wrong = new Set<string>();
    while (wrong.size < 3) {
      wrong.add(
        generateConjugationDistractor(
          question.verb,
          question.tense,
          currentPronoun,
          question.negative,
          correct,
        ),
      );
    }
    return shuffle([correct, ...Array.from(wrong)]);
  }, [isMc, question, currentPronoun]);

  const resetRound = useCallback(() => {
    setInputs({ je: '', tu: '', elle: '', nous: '', vous: '', elles: '' });
    setPronounIndex(0);
    setChecked(false);
    setResults(null);
    setMcFeedback(null);
  }, []);

  const nextQuestion = useCallback(() => {
    setQuestion(generateConjugationQuestion(settings));
    resetRound();
  }, [settings, resetRound]);

  const checkKeyboardAnswers = () => {
    const res = PRONOUNS.reduce(
      (acc, p) => {
        acc[p] = answersMatch(inputs[p], question.answers[p]);
        return acc;
      },
      {} as Record<Pronoun, boolean>,
    );
    setResults(res);
    setChecked(true);
    const correctCount = Object.values(res).filter(Boolean).length;
    setScore((s) => ({
      correct: s.correct + (correctCount === 6 ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const handleMcAnswer = (answer: string) => {
    if (mcFeedback !== null) return;
    const ok = answersMatch(answer, question.answers[currentPronoun]);
    setMcFeedback(ok ? 'correct' : 'wrong');
    setScore((s) => ({
      correct: s.correct + (ok ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const handleMcNext = () => {
    if (pronounIndex < PRONOUNS.length - 1) {
      setPronounIndex((i) => i + 1);
      setMcFeedback(null);
    } else {
      nextQuestion();
    }
  };

  const allCorrect = results && Object.values(results).every(Boolean);

  return (
    <ScreenLayout
      title="Conjugaison complète"
      subtitle={
        isMc
          ? `Score : ${score.correct} / ${score.total} — ${PRONOUN_LABELS[currentPronoun]} (${pronounIndex + 1}/6)`
          : `Score : ${score.correct} / ${score.total} (6/6 = 1 point)`
      }
      onBack={onBack}
    >
      <View style={styles.meta}>
        <Text style={styles.badge}>{tenseLabel(question.tense)}</Text>
        {question.negative && <Text style={styles.badgeNeg}>Négatif</Text>}
      </View>

      <View style={styles.verbCard}>
        <Text style={styles.verb}>{question.verb.infinitive}</Text>
        <Text style={styles.english}>{question.verb.english}</Text>
        <Text style={styles.instruction}>
          {isMc
            ? `Choisis la bonne forme pour « ${PRONOUN_LABELS[currentPronoun]} »`
            : 'Conjugue pour : je, tu, elle, nous, vous, elles'}
        </Text>
      </View>

      {isMc ? (
        <View>
          {mcChoices.map((choice) => (
            <Button
              key={choice}
              title={`${PRONOUN_LABELS[currentPronoun]} ${choice}`}
              variant={
                mcFeedback
                  ? answersMatch(choice, question.answers[currentPronoun])
                    ? 'primary'
                    : 'outline'
                  : 'outline'
              }
              onPress={() => handleMcAnswer(choice)}
              disabled={mcFeedback !== null}
              style={styles.choice}
            />
          ))}
          {mcFeedback && (
            <View
              style={[
                styles.feedback,
                mcFeedback === 'correct' ? styles.ok : styles.ko,
              ]}
            >
              <Text style={styles.feedbackText}>
                {mcFeedback === 'correct'
                  ? '✓ Correct !'
                  : `✗ Réponse : ${question.answers[currentPronoun]}`}
              </Text>
              <Button
                title={
                  pronounIndex < PRONOUNS.length - 1
                    ? 'Pronom suivant'
                    : 'Verbe suivant'
                }
                onPress={handleMcNext}
              />
            </View>
          )}
        </View>
      ) : (
        <>
          {PRONOUNS.map((p) => (
            <View key={p} style={styles.row}>
              <Text style={styles.pronoun}>{PRONOUN_LABELS[p]}</Text>
              <TextInput
                style={[
                  styles.input,
                  checked &&
                    results &&
                    (results[p] ? styles.inputOk : styles.inputKo),
                ]}
                value={inputs[p]}
                onChangeText={(text) =>
                  setInputs((prev) => ({ ...prev, [p]: text }))
                }
                placeholder="…"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!checked}
              />
              {checked && results && !results[p] && (
                <Text style={styles.correctAnswer}>{question.answers[p]}</Text>
              )}
            </View>
          ))}

          {!checked && (
            <Button title="Vérifier" onPress={checkKeyboardAnswers} style={styles.check} />
          )}

          {checked && (
            <View
              style={[styles.feedback, allCorrect ? styles.ok : styles.ko]}
            >
              <Text style={styles.feedbackText}>
                {allCorrect
                  ? '✓ Parfait — 6/6 !'
                  : `✗ ${Object.values(results!).filter(Boolean).length}/6 correct(s)`}
              </Text>
              <Button title="Verbe suivant" onPress={nextQuestion} />
            </View>
          )}
        </>
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
  verbCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  verb: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  english: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  instruction: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  row: {
    marginBottom: spacing.md,
  },
  pronoun: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 17,
    color: colors.text,
  },
  inputOk: {
    borderColor: colors.success,
    backgroundColor: '#F0FDF4',
  },
  inputKo: {
    borderColor: colors.error,
    backgroundColor: '#FEF2F2',
  },
  correctAnswer: {
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  choice: {
    marginBottom: spacing.sm,
  },
  check: {
    marginTop: spacing.md,
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
});
