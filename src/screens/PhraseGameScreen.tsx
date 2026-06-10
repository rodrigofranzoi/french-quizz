import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { ConjugationTable } from '../components/ConjugationTable';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors, spacing } from '../theme';
import type { GameSettings } from '../types';
import { tenseLabel } from '../utils/conjugation';
import {
  formatPronounForm,
  stripSubjectFromPhraseBefore,
} from '../utils/display';
import {
  type AnswerGrade,
  answersMatch,
  gradeAnswer,
  isGradedCorrect,
} from '../utils/normalize';
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
  const [grade, setGrade] = useState<AnswerGrade | null>(null);

  const isKeyboard = settings.inputMode === 'keyboard';
  const expectedFull = formatPronounForm(question.pronoun, question.answer);
  const phraseBefore = isKeyboard
    ? stripSubjectFromPhraseBefore(question.before, question.pronoun)
    : question.before;

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
    setGrade(null);
  }, [settings]);

  const checkAnswer = (answer: string) => {
    const result = isKeyboard
      ? gradeAnswer(answer, expectedFull)
      : answersMatch(answer, question.answer)
        ? 'correct'
        : 'wrong';
    setGrade(result);
    setScore((s) => ({
      correct: s.correct + (isGradedCorrect(result) ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const feedbackStyle =
    grade === 'wrong' ? styles.ko : grade === 'accent_missing' ? styles.warn : styles.ok;

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
          {phraseBefore}
          <Text style={styles.blank}> ___ </Text>
          {question.after}
        </Text>
        <Text style={styles.hint}>Verbe : {question.hint}</Text>
        {isKeyboard && (
          <Text style={styles.keyboardHint}>
            Inclus le pronom : ex. j&apos;ai payé, nous lisons…
          </Text>
        )}
      </View>

      {isKeyboard ? (
        <View>
          <TextInput
            style={[
              styles.input,
              grade === 'correct' && styles.inputOk,
              grade === 'accent_missing' && styles.inputWarn,
              grade === 'wrong' && styles.inputKo,
            ]}
            value={input}
            onChangeText={setInput}
            placeholder={`ex. ${expectedFull}`}
            autoCapitalize="none"
            autoCorrect={false}
            editable={grade === null}
          />
          {grade === null && (
            <Button title="Vérifier" onPress={() => checkAnswer(input)} />
          )}
        </View>
      ) : (
        <View>
          {choices.map((choice) => (
            <Button
              key={choice}
              title={choice}
              variant={
                grade
                  ? answersMatch(choice, question.answer)
                    ? 'primary'
                    : 'outline'
                  : 'outline'
              }
              onPress={() => grade === null && checkAnswer(choice)}
              disabled={grade !== null}
              style={styles.choice}
            />
          ))}
        </View>
      )}

      {grade && (
        <View style={[styles.feedback, feedbackStyle]}>
          <Text style={styles.feedbackText}>
            {grade === 'correct' && '✓ Correct !'}
            {grade === 'accent_missing' && '✓ Correct — accents oubliés !'}
            {grade === 'wrong' && '✗ Incorrect'}
          </Text>
          {isKeyboard && (
            <>
              <Text style={styles.answerLabel}>Réponse attendue :</Text>
              <Text style={styles.expectedBlank}>{expectedFull}</Text>
              {grade === 'accent_missing' && (
                <Text style={styles.accentNote}>
                  N&apos;oublie pas les accents : {expectedFull}
                </Text>
              )}
              {grade === 'wrong' && input.trim().length > 0 && (
                <Text style={styles.yourAnswer}>Ta réponse : {input}</Text>
              )}
            </>
          )}
          <Text style={styles.fullPhrase}>
            {phraseBefore}
            {expectedFull}
            {question.after}
          </Text>
          <ConjugationTable
            verb={question.verb}
            tense={question.tense}
            negative={question.negative}
            highlightPronoun={question.pronoun}
            showFullForms={isKeyboard}
          />
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
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  keyboardHint: {
    marginTop: spacing.sm,
    fontSize: 13,
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
    marginBottom: spacing.sm,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  expectedBlank: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  accentNote: {
    fontSize: 15,
    color: colors.warning,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  yourAnswer: {
    fontSize: 15,
    color: colors.error,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  fullPhrase: {
    fontSize: 16,
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  next: {
    marginTop: spacing.md,
  },
});
