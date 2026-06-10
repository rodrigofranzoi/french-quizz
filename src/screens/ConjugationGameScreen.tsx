import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { ConjugationTable } from '../components/ConjugationTable';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors, spacing } from '../theme';
import type { GameSettings, Pronoun } from '../types';
import { PRONOUNS } from '../types';
import { tenseLabel } from '../utils/conjugation';
import { formatPronounForm } from '../utils/display';
import {
  type AnswerGrade,
  answersMatch,
  gradeAnswer,
  isGradedCorrect,
} from '../utils/normalize';
import {
  generateConjugationChoices,
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

function inputStyleForGrade(grade: AnswerGrade | undefined) {
  if (grade === 'correct') return styles.inputOk;
  if (grade === 'accent_missing') return styles.inputWarn;
  if (grade === 'wrong') return styles.inputKo;
  return undefined;
}

export function ConjugationGameScreen({
  settings,
  onBack,
}: ConjugationGameScreenProps) {
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [question, setQuestion] = useState(() =>
    generateConjugationQuestion(settings),
  );
  const [inputs, setInputs] = useState<Record<Pronoun, string>>({
    je: '',
    tu: '',
    elle: '',
    nous: '',
    vous: '',
    elles: '',
  });
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<Pronoun, AnswerGrade> | null>(
    null,
  );
  const [mcFeedback, setMcFeedback] = useState<'correct' | 'wrong' | null>(null);

  const mcPronoun = question.pronoun;
  const isMc = settings.inputMode === 'multiple_choice';

  const expectedFull = (p: Pronoun) =>
    formatPronounForm(p, question.answers[p]);

  const mcChoices = useMemo(() => {
    if (!isMc) return [];
    const correct = question.answers[mcPronoun];
    return generateConjugationChoices(
      question.verb,
      question.tense,
      mcPronoun,
      question.negative,
      correct,
    );
  }, [isMc, question, mcPronoun]);

  const resetRound = useCallback(() => {
    setInputs({ je: '', tu: '', elle: '', nous: '', vous: '', elles: '' });
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
        acc[p] = gradeAnswer(inputs[p], expectedFull(p));
        return acc;
      },
      {} as Record<Pronoun, AnswerGrade>,
    );
    setResults(res);
    setChecked(true);
    const correctCount = Object.values(res).filter(isGradedCorrect).length;
    setScore((s) => ({
      correct: s.correct + (correctCount === 6 ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const handleMcAnswer = (answer: string) => {
    if (mcFeedback !== null) return;
    const ok = answersMatch(answer, question.answers[mcPronoun]);
    setMcFeedback(ok ? 'correct' : 'wrong');
    setScore((s) => ({
      correct: s.correct + (ok ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const allCorrect =
    results && Object.values(results).every(isGradedCorrect);
  const hasAccentWarnings =
    results && Object.values(results).some((r) => r === 'accent_missing');

  return (
    <ScreenLayout
      title="Conjugaison complète"
      subtitle={
        isMc
          ? `Score : ${score.correct} / ${score.total}`
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
            ? `Choisis la bonne forme pour « ${PRONOUN_LABELS[mcPronoun]} »`
            : 'Écris la forme complète avec pronom : j\'ai payé, nous lisons…'}
        </Text>
      </View>

      {isMc ? (
        <View>
          {mcChoices.map((choice) => (
            <Button
              key={choice}
              title={formatPronounForm(mcPronoun, choice)}
              variant={
                mcFeedback
                  ? answersMatch(choice, question.answers[mcPronoun])
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
                  : `✗ Réponse : ${expectedFull(mcPronoun)}`}
              </Text>
              <ConjugationTable
                verb={question.verb}
                tense={question.tense}
                negative={question.negative}
                highlightPronoun={mcPronoun}
              />
              <Button title="Verbe suivant" onPress={nextQuestion} />
            </View>
          )}
        </View>
      ) : (
        <>
          {PRONOUNS.map((p) => (
            <View key={p} style={styles.row}>
              <TextInput
                style={[styles.input, checked && inputStyleForGrade(results?.[p])]}
                value={inputs[p]}
                onChangeText={(text) =>
                  setInputs((prev) => ({ ...prev, [p]: text }))
                }
                placeholder={`ex. ${expectedFull(p)}`}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!checked}
              />
              {checked && results && (
                <>
                  <Text
                    style={[
                      styles.expectedAnswer,
                      isGradedCorrect(results[p])
                        ? results[p] === 'accent_missing'
                          ? styles.expectedWarn
                          : styles.expectedOk
                        : styles.expectedKo,
                    ]}
                  >
                    → {expectedFull(p)}
                  </Text>
                  {results[p] === 'accent_missing' && (
                    <Text style={styles.accentNote}>
                      Accents oubliés — écris : {expectedFull(p)}
                    </Text>
                  )}
                </>
              )}
            </View>
          ))}

          {!checked && (
            <Button title="Vérifier" onPress={checkKeyboardAnswers} style={styles.check} />
          )}

          {checked && (
            <View
              style={[
                styles.feedback,
                allCorrect
                  ? hasAccentWarnings
                    ? styles.warn
                    : styles.ok
                  : styles.ko,
              ]}
            >
              <Text style={styles.feedbackText}>
                {allCorrect
                  ? hasAccentWarnings
                    ? '✓ 6/6 — accents oubliés sur certaines réponses !'
                    : '✓ Parfait — 6/6 !'
                  : `✗ ${Object.values(results!).filter(isGradedCorrect).length}/6 correct(s)`}
              </Text>
              <ConjugationTable
                verb={question.verb}
                tense={question.tense}
                negative={question.negative}
                showFullForms
              />
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
  inputWarn: {
    borderColor: colors.warning,
    backgroundColor: '#FEF9C3',
  },
  inputKo: {
    borderColor: colors.error,
    backgroundColor: '#FEF2F2',
  },
  expectedAnswer: {
    fontSize: 14,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  expectedOk: {
    color: colors.success,
  },
  expectedWarn: {
    color: colors.warning,
  },
  expectedKo: {
    color: colors.error,
  },
  accentNote: {
    fontSize: 13,
    color: colors.warning,
    fontWeight: '600',
    marginTop: spacing.xs,
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
  warn: {
    backgroundColor: '#FEF9C3',
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
