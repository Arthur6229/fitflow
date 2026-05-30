import { useState } from 'react';
import { Scale, Target, Zap, TrendingUp, ChevronRight, Edit3, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { calcBMI, bmiCategory, calcTargetCalories, calcTDEE, goalLabel, activityLabel } from '../utils/calculations';
import type { Goal, ActivityLevel } from '../types';

const goals: { id: Goal; label: string; icon: string }[] = [
  { id: 'loseWeight', label: 'Lose Weight', icon: '🔥' },
  { id: 'buildMuscle', label: 'Build Muscle', icon: '💪' },
  { id: 'maintain', label: 'Maintain', icon: '⚖️' },
  { id: 'improveSkills', label: 'Improve Skills', icon: '🤸' },
];

const activities: { id: ActivityLevel; label: string }[] = [
  { id: 'sedentary', label: 'Sedentary' },
  { id: 'light', label: 'Lightly Active' },
  { id: 'moderate', label: 'Moderately Active' },
  { id: 'active', label: 'Very Active' },
  { id: 'veryActive', label: 'Extremely Active' },
];

export function Profile() {
  const { profile, weightHistory, workoutDates, addWeightEntry, updateProfile, reset } = useStore();
  const [editingWeight, setEditingWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!profile) return null;

  const bmi = calcBMI(profile.weight, profile.height);
  const cat = bmiCategory(bmi);
  const tdee = calcTDEE(profile);
  const targetCal = calcTargetCalories(profile);
  const totalWorkouts = workoutDates.length;

  const handleSaveWeight = () => {
    const w = parseFloat(newWeight);
    if (w > 0) { addWeightEntry(w); }
    setEditingWeight(false);
    setNewWeight('');
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    padding: '18px',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 0', borderBottom: '1px solid #f8fafc',
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
        padding: '56px 20px 28px',
        borderRadius: '0 0 28px 28px',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)', margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, border: '3px solid rgba(255,255,255,0.4)',
        }}>
          {profile.name[0].toUpperCase()}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 2 }}>{profile.name}</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>{goalLabel(profile.goal)} · {activityLabel(profile.activityLevel)}</div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          {[
            { label: 'Workouts', value: totalWorkouts },
            { label: 'BMI', value: bmi },
            { label: 'Age', value: profile.age },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* BMI card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={18} color={cat.color} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>BMI Overview</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: cat.color, lineHeight: 1 }}>{bmi}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>BMI</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ background: cat.bg, borderRadius: 12, padding: '10px 14px', border: `1px solid ${cat.color}22` }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: cat.color }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {profile.height}cm · {profile.weight}kg
                </div>
              </div>
            </div>
          </div>

          {/* BMI scale bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', background: 'linear-gradient(to right, #3b82f6, #10b981 33%, #f59e0b 66%, #ef4444)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
              <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
            </div>
          </div>
        </div>

        {/* Weight update */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} color="#10b981" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Weight Log</div>
            </div>
            <button
              onClick={() => setEditingWeight(!editingWeight)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151' }}
            >
              <Edit3 size={14} />{editingWeight ? 'Cancel' : 'Update'}
            </button>
          </div>

          {editingWeight && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <input
                type="number"
                placeholder={`Current: ${profile.weight} kg`}
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                style={{
                  flex: 1, padding: '12px 14px', borderRadius: 12, border: '1.5px solid #6366f1',
                  fontSize: 16, outline: 'none', fontWeight: 600, color: '#111827',
                }}
              />
              <button
                onClick={handleSaveWeight}
                style={{ padding: '12px 16px', borderRadius: 12, border: 'none', background: '#6366f1', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                <Check size={18} />
              </button>
            </div>
          )}

          {/* Weight history */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {weightHistory.slice(-5).reverse().map((entry, i) => (
              <div key={entry.date} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', background: i === 0 ? '#eef2ff' : '#f8fafc', borderRadius: 10,
              }}>
                <span style={{ fontSize: 13, color: i === 0 ? '#4f46e5' : '#64748b', fontWeight: i === 0 ? 700 : 500 }}>
                  {i === 0 ? 'Today' : entry.date}
                </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: i === 0 ? '#4f46e5' : '#374151' }}>{entry.weight} kg</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calorie info */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#f97316" />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Calorie Breakdown</div>
          </div>
          {[
            { label: 'TDEE (maintenance)', value: tdee, color: '#6366f1' },
            { label: `Daily target (${goalLabel(profile.goal)})`, value: targetCal, color: '#f97316' },
            { label: 'Difference', value: targetCal - tdee, color: targetCal > tdee ? '#10b981' : '#ef4444', prefix: true },
          ].map(item => (
            <div key={item.label} style={rowStyle}>
              <span style={{ fontSize: 14, color: '#374151' }}>{item.label}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>
                {item.prefix && item.value > 0 ? '+' : ''}{item.value} kcal
              </span>
            </div>
          ))}
        </div>

        {/* Goal settings */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={18} color="#6366f1" />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Your Settings</div>
          </div>

          {/* Goal */}
          <div style={rowStyle}>
            <span style={{ fontSize: 14, color: '#374151' }}>Goal</span>
            <button onClick={() => setEditingGoal(!editingGoal)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: 'none', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>
              {goalLabel(profile.goal)} <ChevronRight size={14} />
            </button>
          </div>
          {editingGoal && (
            <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px', marginTop: 6, marginBottom: 6 }}>
              {goals.map(g => (
                <button
                  key={g.id}
                  onClick={() => { updateProfile({ goal: g.id }); setEditingGoal(false); }}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none',
                    background: profile.goal === g.id ? '#eef2ff' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                    marginBottom: 4, fontWeight: 600, color: profile.goal === g.id ? '#4f46e5' : '#374151', fontSize: 13,
                  }}
                >
                  <span>{g.icon}</span><span>{g.label}</span>
                  {profile.goal === g.id && <Check size={14} color="#6366f1" style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          )}

          {/* Activity */}
          <div style={rowStyle}>
            <span style={{ fontSize: 14, color: '#374151' }}>Activity Level</span>
            <button onClick={() => setEditingActivity(!editingActivity)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: 'none', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>
              {activityLabel(profile.activityLevel)} <ChevronRight size={14} />
            </button>
          </div>
          {editingActivity && (
            <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px', marginTop: 6, marginBottom: 6 }}>
              {activities.map(a => (
                <button
                  key={a.id}
                  onClick={() => { updateProfile({ activityLevel: a.id }); setEditingActivity(false); }}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none',
                    background: profile.activityLevel === a.id ? '#eef2ff' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', fontWeight: 600,
                    color: profile.activityLevel === a.id ? '#4f46e5' : '#374151', fontSize: 13, marginBottom: 4,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <span>{a.label}</span>
                  {profile.activityLevel === a.id && <Check size={14} color="#6366f1" />}
                </button>
              ))}
            </div>
          )}

          {/* Static info rows */}
          {[
            { label: 'Height', value: `${profile.height} cm` },
            { label: 'Gender', value: profile.gender === 'male' ? '♂ Male' : '♀ Female' },
            { label: 'Age', value: `${profile.age} years` },
            { label: 'Workout Style', value: profile.workoutType === 'both' ? 'Calisthenics + Gym' : profile.workoutType === 'calisthenics' ? 'Calisthenics' : 'Gym' },
          ].map(row => (
            <div key={row.label} style={rowStyle}>
              <span style={{ fontSize: 14, color: '#374151' }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Reset */}
        <div style={{ ...cardStyle, border: '1px solid #fee2e2', background: '#fff5f5' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>Danger Zone</div>
          <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 14 }}>Resetting will clear all progress and return to onboarding.</div>
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid #fca5a5', background: 'white', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
            >
              Reset All Data
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowConfirmReset(false)}
                style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => reset()}
                style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#dc2626', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                Yes, Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
