import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { Button } from './Button';

interface ScreenLayoutProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
  scroll?: boolean;
}

export function ScreenLayout({
  title,
  subtitle,
  onBack,
  children,
  scroll = true,
}: ScreenLayoutProps) {
  const content = (
    <View style={styles.inner}>
      {onBack && (
        <Button title="← Retour" variant="ghost" onPress={onBack} style={styles.back} />
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  inner: {
    padding: spacing.lg,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  back: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
});
