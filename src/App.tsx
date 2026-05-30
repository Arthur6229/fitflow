import { useState } from 'react';
import { useStore } from './store/useStore';
import { BottomNav } from './components/BottomNav';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Calisthenics } from './pages/Calisthenics';
import { Gym } from './pages/Gym';
import { Diet } from './pages/Diet';
import { Profile } from './pages/Profile';

const SIDEBAR_W = 220;

function App() {
  const { onboardingComplete } = useStore();
  const [tab, setTab] = useState('home');

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <BottomNav active={tab} onChange={setTab} />

      <main style={{
        marginLeft: SIDEBAR_W,
        flex: 1,
        minHeight: '100vh',
        overflowX: 'hidden',
      }}>
        {tab === 'home'         && <Home onNavigate={setTab} />}
        {tab === 'calisthenics' && <Calisthenics />}
        {tab === 'gym'          && <Gym />}
        {tab === 'diet'         && <Diet />}
        {tab === 'profile'      && <Profile />}
      </main>
    </div>
  );
}

export default App;
