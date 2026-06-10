import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameSetup } from './src/components/GameSetup';
import { ScreenLayout } from './src/components/ScreenLayout';
import { ConjugationGameScreen } from './src/screens/ConjugationGameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { InfoScreen } from './src/screens/InfoScreen';
import { PhraseGameScreen } from './src/screens/PhraseGameScreen';
import type { GameSettings, Screen } from './src/types';
import { TENSES } from './src/types';

const DEFAULT_SETTINGS: GameSettings = {
  tenses: [...TENSES],
  inputMode: 'multiple_choice',
  includeNegative: true,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  const goHome = () => setScreen('home');

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onNavigate={setScreen} />;
      case 'phrase_setup':
        return (
          <ScreenLayout
            title="Compléter la phrase"
            subtitle="Choisis les temps, le mode et si tu veux des phrases négatives."
            onBack={goHome}
          >
            <GameSetup
              settings={settings}
              onChange={setSettings}
              onStart={() => setScreen('phrase_game')}
              gameTitle="Phrases"
            />
          </ScreenLayout>
        );
      case 'phrase_game':
        return (
          <PhraseGameScreen settings={settings} onBack={() => setScreen('phrase_setup')} />
        );
      case 'conjugation_setup':
        return (
          <ScreenLayout
            title="Conjugaison complète"
            subtitle="Conjugue le verbe pour tous les pronoms."
            onBack={goHome}
          >
            <GameSetup
              settings={settings}
              onChange={setSettings}
              onStart={() => setScreen('conjugation_game')}
              gameTitle="Conjugaison"
            />
          </ScreenLayout>
        );
      case 'conjugation_game':
        return (
          <ConjugationGameScreen
            settings={settings}
            onBack={() => setScreen('conjugation_setup')}
          />
        );
      case 'info':
        return <InfoScreen onBack={goHome} />;
      default:
        return <HomeScreen onNavigate={setScreen} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {renderScreen()}
    </SafeAreaProvider>
  );
}
