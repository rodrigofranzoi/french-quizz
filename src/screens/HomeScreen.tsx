import { StyleSheet, Text, View } from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { colors, spacing } from '../theme';
import type { Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <ScreenLayout
      title="Quiz de Français"
      subtitle="Entraîne-toi au présent, passé composé, futur proche et futur simple."
    >
      <View style={styles.card}>
        <Text style={styles.flag}>🇫🇷</Text>
        <Text style={styles.desc}>
          Deux jeux, deux modes — choix multiples ou clavier. Avec des phrases au
          négatif aussi !
        </Text>
      </View>

      <Button
        title="Compléter la phrase"
        onPress={() => onNavigate('phrase_setup')}
        style={styles.btn}
      />
      <Button
        title="Conjuguer (je / tu / elle…)"
        variant="secondary"
        onPress={() => onNavigate('conjugation_setup')}
        style={styles.btn}
      />
      <Button
        title="Règles des temps"
        variant="outline"
        onPress={() => onNavigate('info')}
        style={styles.btn}
      />
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
    alignItems: 'center',
  },
  flag: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  desc: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    marginBottom: spacing.md,
  },
});
