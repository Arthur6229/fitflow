import { Flame, TrendingUp, Dumbbell, Activity, Droplets, Award } from 'lucide-react';
import { useStore } from '../store/useStore';
import { calcBMI, bmiCategory, calcTargetCalories, calcMacros } from '../utils/calculations';
import { goalLabel } from '../utils/calculations';

interface Props { onNavigate: (tab: string) => void; }

function BMIArc({ bmi }: { bmi: number }) {
  const cat = bmiCategory(bmi);
  const pct = Math.min(1, Math.max(0, (bmi - 10) / 30));
  const r = 64;
  const cx = 80;
  const cy = 80;
  const startAngle = 210;
  const totalAngle = 300;
  const angle = startAngle + pct * totalAngle;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX = (deg: number) => cx + r * Math.cos(toRad(deg));
  const arcY = (deg: number) => cy + r * Math.sin(toRad(deg));

  const describeArc = (start: number, end: number) => {
    const s = { x: arcX(start), y: arcY(start) };
    const e = { x: arcX(end), y: arcY(end) };
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={160} height={130} viewBox="0 0 160 130">
        {/* Track */}
        <path d={describeArc(startAngle, startAngle + totalAngle)} fill="none" stroke="#e2e8f0" strokeWidth={12} strokeLinecap="round" />
        {/* Fill */}
        <path d={describeArc(startAngle, angle)} fill="none" stroke={cat.color} strokeWidth={12} strokeLinecap="round" />
        {/* Needle dot */}
        <circle cx={arcX(angle)} cy={arcY(angle)} r={7} fill={cat.color} />
        {/* BMI value */}
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize={28} fontWeight={800} fill="#111827">{bmi}</text>
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize={11} fill="#94a3b8">BMI</text>
      </svg>
      <div style={{
        background: cat.bg, color: cat.color,
        borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700,
        marginTop: -8,
      }}>
        {cat.label}
      </div>
    </div>
  );
}

function MacroBar({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
  const total = protein * 4 + carbs * 4 + fat * 9;
  const pP = (protein * 4 / total) * 100;
  const pC = (carbs * 4 / total) * 100;
  const pF = (fat * 9 / total) * 100;
  return (
    <div>
      <div style={{ height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex', marginBottom: 8 }}>
        <div style={{ width: `${pP}%`, background: '#6366f1' }} />
        <div style={{ width: `${pC}%`, background: '#f59e0b' }} />
        <div style={{ width: `${pF}%`, background: '#10b981' }} />
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
        {[
          { label: 'Protein', value: protein, color: '#6366f1' },
          { label: 'Carbs', value: carbs, color: '#f59e0b' },
          { label: 'Fat', value: fat, color: '#10b981' },
        ].map(m => (
          <div key={m.label} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, margin: '0 auto 3px' }} />
            <div style={{ fontWeight: 700, color: '#111827' }}>{m.value}g</div>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Home({ onNavigate }: Props) {
  const { profile, workoutDates } = useStore();

  if (!profile) return null;

  const bmi = calcBMI(profile.weight, profile.height);
  const calories = calcTargetCalories(profile);
  const macros = calcMacros(calories, profile.goal);
  const today = new Date().toISOString().split('T')[0];
  const workedOutToday = workoutDates.includes(today);
  const streak = (() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (workoutDates.includes(dateStr)) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
  };

  return (
    <div style={{ paddingBottom: '6rem', paddingTop: 0 }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        padding: '56px 24px 32px',
        borderRadius: '0 0 28px 28px',
        color: 'white',
      }}>
        <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 4 }}>{greeting} 👋</div>
        <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{profile.name}</div>
        <div style={{ fontSize: 13, opacity: 0.75 }}>{goalLabel(profile.goal)} · {profile.weight} kg</div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '12px 14px', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>Daily Target</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{calories.toLocaleString()}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>kcal / day</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '12px 14px', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>Streak</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{streak} 🔥</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>days in a row</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '12px 14px', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>Today</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{workedOutToday ? '✅' : '⏳'}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>{workedOutToday ? 'Done!' : 'Pending'}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* BMI Card */}
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Body Mass Index</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>Based on {profile.height}cm · {profile.weight}kg</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <BMIArc bmi={bmi} />
            <div style={{ flex: 1 }}>
              {[
                { label: 'Underweight', range: '< 18.5', color: '#3b82f6' },
                { label: 'Normal', range: '18.5–24.9', color: '#10b981' },
                { label: 'Overweight', range: '25–29.9', color: '#f59e0b' },
                { label: 'Obese', range: '≥ 30', color: '#ef4444' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>{c.range}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calorie & Macros */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} color="#f97316" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Daily Nutrition</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Target macros for your goal</div>
            </div>
          </div>
          <div style={{
            background: '#fafafa', borderRadius: 14, padding: '14px 16px', marginBottom: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#111827' }}>{calories.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>kcal · {goalLabel(profile.goal)}</div>
            </div>
            <div style={{ fontSize: 40 }}>🎯</div>
          </div>
          <MacroBar {...macros} />
        </div>

        {/* Quick Actions */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Calisthenics', icon: <Activity size={22} color="#ec4899" />, bg: '#fdf2f8', tab: 'calisthenics' },
              { label: 'Gym Workout', icon: <Dumbbell size={22} color="#6366f1" />, bg: '#eef2ff', tab: 'gym' },
              { label: 'Meal Plan', icon: <span style={{ fontSize: 22 }}>🥗</span>, bg: '#f0fdf4', tab: 'diet' },
              { label: 'My Profile', icon: <TrendingUp size={22} color="#f97316" />, bg: '#fff7ed', tab: 'profile' },
            ].map(a => (
              <button
                key={a.tab}
                onClick={() => onNavigate(a.tab)}
                style={{
                  ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  gap: 10, cursor: 'pointer', border: 'none', padding: '18px 16px', transition: 'transform 0.1s',
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 12, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {a.icon}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Water reminder */}
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 32 }}><Droplets size={32} color="#3b82f6" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1e40af' }}>Stay Hydrated 💧</div>
              <div style={{ fontSize: 13, color: '#3b82f6', marginTop: 2 }}>Aim for 8 glasses (2L) today</div>
            </div>
            <Award size={20} color="#3b82f6" />
          </div>
        </div>
      </div>
    </div>
  );
}
