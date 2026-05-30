import { useState } from 'react';
import { useStore } from './store/useStore';
import { BottomNav } from './components/BottomNav';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Calisthenics } from './pages/Calisthenics';
import { Gym } from './pages/Gym';
import { Diet } from './pages/Diet';
import { Profile } from './pages/Profile';

function App() {
  const { onboardingComplete } = useStore();
  const [tab, setTab] = useState('home');

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <div style={{
      maxWidth: 430,
      width: '100%',
      minHeight: '100vh',
      background: '#f8fafc',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <div style={{ overflowY: 'auto', minHeight: '100vh' }}>
        {tab === 'home' && <Home onNavigate={setTab} />}
        {tab === 'calisthenics' && <Calisthenics />}
        {tab === 'gym' && <Gym />}
        {tab === 'diet' && <Diet />}
        {tab === 'profile' && <Profile />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default App;
