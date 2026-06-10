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
  gradeConjugationInput,
  gradeFeedbackLabel,
  gradeHasAccentWarning,
  gradeHasGenderWarning,
  gradeHasSpellingWarning,
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

const KEYBOARD_PRONOUN_TITLES: Record<Pronoun, string> = {
  je: "je / j'",
  tu: 'tu',
  elle: 'il / elle',
  nous: 'nous',
  vous: 'vous',
  elles: 'ils / elles',
};

function inputStyleForGrade(grade: AnswerGrade | undefined) {
  if (!grade) return undefined;
  if (grade === 'wrong') return styles.inputKo;
  if (grade === 'correct') return styles.inputOk;
  return styles.inputWarn;
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
        acc[p] = gradeConjugationInput(
          inputs[p],
          question.answers[p],
          p,
          question.verb,
          question.tense,
          question.negative,
        );
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
    results && Object.values(results).some(gradeHasAccentWarning);
  const hasGenderWarnings =
    results && Object.values(results).some(gradeHasGenderWarning);
  const hasSpellingWarnings =
    results && Object.values(results).some(gradeHasSpellingWarning);

  const screenTitle = isMc
    ? `Conjugaison — ${PRONOUN_LABELS[mcPronoun]}`
    : 'Conjugaison complète';

  return (
    <ScreenLayout
      title={screenTitle}
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
        {!isMc && (
          <Text style={styles.instruction}>
            Pronom optionnel (je/j&apos;, il/elle…) — accord féminin signalé si besoin
          </Text>
        )}
      </View>

      {isMc ? (
        <View>
          {mcChoices.map((choice) => (
            <Button
              key={choice}
              title={choice}
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
              <Text style={styles.pronounTitle}>{KEYBOARD_PRONOUN_TITLES[p]}</Text>
              <TextInput
                style={[styles.input, checked && inputStyleForGrade(results?.[p])]}
                value={inputs[p]}
                onChangeText={(text) =>
                  setInputs((prev) => ({ ...prev, [p]: text }))
                }
                placeholder="…"
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
                        ? gradeHasAccentWarning(results[p]) ||
                          gradeHasGenderWarning(results[p]) ||
                          gradeHasSpellingWarning(results[p])
                          ? styles.expectedWarn
                          : styles.expectedOk
                        : styles.expectedKo,
                    ]}
                  >
                    → {expectedFull(p)}
                  </Text>
                  {gradeHasAccentWarning(results[p]) && (
                    <Text style={styles.accentNote}>
                      Accents oubliés — écris : {expectedFull(p)}
                    </Text>
                  )}
                  {gradeHasGenderWarning(results[p]) && (
                    <Text style={styles.accentNote}>
                      Accord féminin attendu : {expectedFull(p)}
                    </Text>
                  )}
                  {gradeHasSpellingWarning(results[p]) && (
                    <Text style={styles.accentNote}>
                      Orthographe du pronom : écris « vous », pas « vouz »
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
                  ? hasAccentWarnings || hasGenderWarnings || hasSpellingWarnings
                    ? styles.warn
                    : styles.ok
                  : styles.ko,
              ]}
            >
              <Text style={styles.feedbackText}>
                {allCorrect
                  ? [hasAccentWarnings, hasGenderWarnings, hasSpellingWarnings].filter(
                      Boolean,
                    ).length > 1
                    ? '✓ 6/6 — quelques détails à revoir !'
                    : hasAccentWarnings
                      ? '✓ 6/6 — accents oubliés sur certaines réponses !'
                      : hasGenderWarnings
                        ? '✓ 6/6 — accord masculin/féminin à revoir !'
                        : hasSpellingWarnings
                          ? '✓ 6/6 — orthographe du pronom (vous) à revoir !'
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
  pronounTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
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
