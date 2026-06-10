import { StyleSheet, Text, View } from 'react-native';
import type { GameSettings, InputMode, Tense } from '../types';
import { TENSES } from '../types';
import { tenseLabel } from '../utils/conjugation';
import { colors, spacing } from '../theme';
import { Button } from './Button';
import { Chip } from './Chip';

interface GameSetupProps {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
  onStart: () => void;
  gameTitle: string;
}

export function GameSetup({ settings, onChange, onStart, gameTitle }: GameSetupProps) {
  const toggleTense = (tense: Tense) => {
    const has = settings.tenses.includes(tense);
    const tenses = has
      ? settings.tenses.filter((t) => t !== tense)
      : [...settings.tenses, tense];
    onChange({ ...settings, tenses });
  };

  const setMode = (inputMode: InputMode) => onChange({ ...settings, inputMode });

  const canStart = settings.tenses.length > 0;

  return (
    <View>
      <Text style={styles.section}>Temps verbaux</Text>
      <View style={styles.row}>
        {TENSES.map((t) => (
          <Chip
            key={t}
            label={tenseLabel(t)}
            selected={settings.tenses.includes(t)}
            onPress={() => toggleTense(t)}
          />
        ))}
      </View>

      <Text style={styles.section}>Mode de réponse</Text>
      <View style={styles.row}>
        <Chip
          label="Choix multiples"
          selected={settings.inputMode === 'multiple_choice'}
          onPress={() => setMode('multiple_choice')}
        />
        <Chip
          label="Clavier"
          selected={settings.inputMode === 'keyboard'}
          onPress={() => setMode('keyboard')}
        />
      </View>

      <Text style={styles.section}>Forme négative</Text>
      <View style={styles.row}>
        <Chip
          label="Oui"
          selected={settings.includeNegative}
          onPress={() => onChange({ ...settings, includeNegative: true })}
        />
        <Chip
          label="Non"
          selected={!settings.includeNegative}
          onPress={() => onChange({ ...settings, includeNegative: false })}
        />
      </View>

      <Button
        title={`Commencer — ${gameTitle}`}
        onPress={onStart}
        disabled={!canStart}
        style={styles.start}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  start: {
    marginTop: spacing.xl,
  },
});
