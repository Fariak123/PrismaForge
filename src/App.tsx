import { useState } from 'react';
import './app/App.css';
import Canvas from './widgets/canvas/Canvas';
import WelcomeScreen from './features/welcome/WelcomeScreen';

type Screen = 'welcome' | 'editor';

export type StartupAction = 'new' | 'open' | 'demo';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');

  const [startupAction, setStartupAction] = useState<StartupAction | null>(
    null,
  );

  switch (screen) {
    case 'welcome':
      return (
        <WelcomeScreen
          onNewProject={() => {
            setStartupAction('new');
            setScreen('editor');
          }}
          onOpenProject={async () => {
            setStartupAction('open');
            setScreen('editor');
          }}
          onLoadDemo={() => {
            setStartupAction('demo');
            setScreen('editor');
          }}
        />
      );

    case 'editor':
      return <Canvas startupAction={startupAction} />;
  }
}
