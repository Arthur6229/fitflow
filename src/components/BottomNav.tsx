import { Home, Activity, Dumbbell, Apple, User } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const tabs: Tab[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'calisthenics', label: 'Skills', icon: Activity },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'diet', label: 'Diet', icon: Apple },
  { id: 'profile', label: 'Me', icon: User },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: 'white',
      borderTop: '1px solid #f1f5f9',
      display: 'flex',
      padding: '8px 0 20px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      zIndex: 100,
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              color: isActive ? '#6366f1' : '#94a3b8',
              transition: 'color 0.15s',
            }}
          >
            <div style={{
              padding: '4px 12px',
              borderRadius: 12,
              background: isActive ? '#eef2ff' : 'transparent',
              transition: 'background 0.15s',
            }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
