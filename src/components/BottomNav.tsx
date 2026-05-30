import { Home, Activity, Dumbbell, Apple, User } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const tabs: Tab[] = [
  { id: 'home',         label: 'Home',       icon: Home },
  { id: 'calisthenics', label: 'Skills',     icon: Activity },
  { id: 'gym',          label: 'Gym',        icon: Dumbbell },
  { id: 'diet',         label: 'Diet',       icon: Apple },
  { id: 'profile',      label: 'Profile',    icon: User },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <aside style={{
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      width: 220,
      background: 'white',
      borderRight: '1px solid #f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px',
      zIndex: 100,
      boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 12px', marginBottom: 32,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg,#6366f1,#4338ca)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 900, color: 'white', flexShrink: 0,
        }}>F</div>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>FitFlow</span>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 12,
                background: isActive ? '#eef2ff' : 'transparent',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                color: isActive ? '#6366f1' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom version tag */}
      <div style={{ padding: '0 12px', fontSize: 11, color: '#cbd5e1' }}>FitFlow v1.0</div>
    </aside>
  );
}
