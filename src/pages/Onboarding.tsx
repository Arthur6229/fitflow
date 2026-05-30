import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { UserProfile, Gender, ActivityLevel, Goal, WorkoutType } from '../types';

const goals: { id: Goal; label: string; desc: string; icon: string }[] = [
  { id: 'loseWeight', label: 'Lose Weight', desc: 'Burn fat with a calorie deficit', icon: '🔥' },
  { id: 'buildMuscle', label: 'Build Muscle', desc: 'Gain strength and muscle mass', icon: '💪' },
  { id: 'maintain', label: 'Maintain', desc: 'Stay fit and healthy', icon: '⚖️' },
  { id: 'improveSkills', label: 'Improve Skills', desc: 'Master calisthenics movements', icon: '🤸' },
];

const activities: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise' },
  { id: 'light', label: 'Lightly Active', desc: '1-3 workouts/week' },
  { id: 'moderate', label: 'Moderately Active', desc: '3-5 workouts/week' },
  { id: 'active', label: 'Very Active', desc: '6-7 workouts/week' },
  { id: 'veryActive', label: 'Extremely Active', desc: 'Physical job + daily training' },
];

const workoutTypes: { id: WorkoutType; label: string; desc: string; icon: string }[] = [
  { id: 'calisthenics', label: 'Calisthenics', desc: 'Bodyweight skills & progressions', icon: '🤸' },
  { id: 'gym', label: 'Gym', desc: 'Weight training programs', icon: '🏋️' },
  { id: 'both', label: 'Both', desc: 'Combine calisthenics and weights', icon: '⚡' },
];

const TOTAL_STEPS = 4;

export function Onboarding() {
  const completeOnboarding = useStore(s => s.completeOnboarding);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    gender: 'male' as Gender,
    age: '',
    height: '',
    weight: '',
    goal: 'buildMuscle' as Goal,
    activityLevel: 'moderate' as ActivityLevel,
    workoutType: 'both' as WorkoutType,
  });

  const update = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 1) return form.name.trim().length > 0 && form.age !== '';
    if (step === 2) return form.height !== '' && form.weight !== '';
    return true;
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      name: form.name,
      gender: form.gender,
      age: parseInt(form.age),
      height: parseFloat(form.height),
      weight: parseFloat(form.weight),
      goal: form.goal,
      activityLevel: form.activityLevel,
      workoutType: form.workoutType,
    };
    completeOnboarding(profile);
  };

  const inputStyle: React.CSSProperties = {
    border: '1.5px solid #e2e8f0',
    borderRadius: 14,
    padding: '14px 16px',
    fontSize: 16,
    width: '100%',
    outline: 'none',
    background: 'white',
    color: '#111827',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '56px 24px 24px', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 32 }}>💪</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>FitFlow</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>Your personal fitness companion</div>
          </div>
        </div>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} style={{
              height: 4,
              flex: 1,
              borderRadius: 2,
              background: i + 1 <= step ? '#6366f1' : '#e2e8f0',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>Step {step} of {TOTAL_STEPS}</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '24px 24px 120px', overflowY: 'auto' }}>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Let's get started!</h2>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: 15 }}>Tell us a bit about yourself</p>

            <label style={{ display: 'block', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Your Name</div>
              <input
                style={inputStyle}
                placeholder="e.g. Alex"
                value={form.name}
                onChange={e => update('name', e.target.value)}
              />
            </label>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Gender</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['male', 'female'] as Gender[]).map(g => (
                  <button
                    key={g}
                    onClick={() => update('gender', g)}
                    style={{
                      flex: 1, padding: '14px', borderRadius: 14, border: `2px solid ${form.gender === g ? '#6366f1' : '#e2e8f0'}`,
                      background: form.gender === g ? '#eef2ff' : 'white', cursor: 'pointer',
                      fontWeight: 600, fontSize: 15, color: form.gender === g ? '#6366f1' : '#64748b', transition: 'all 0.15s',
                    }}
                  >
                    {g === 'male' ? '♂ Male' : '♀ Female'}
                  </button>
                ))}
              </div>
            </div>

            <label style={{ display: 'block', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Age</div>
              <input
                style={inputStyle}
                type="number"
                placeholder="e.g. 25"
                value={form.age}
                onChange={e => update('age', e.target.value)}
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Your measurements</h2>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: 15 }}>Used to calculate your BMI and calorie needs</p>

            <label style={{ display: 'block', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Height (cm)</div>
              <input
                style={inputStyle}
                type="number"
                placeholder="e.g. 175"
                value={form.height}
                onChange={e => update('height', e.target.value)}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Weight (kg)</div>
              <input
                style={inputStyle}
                type="number"
                placeholder="e.g. 75"
                value={form.weight}
                onChange={e => update('weight', e.target.value)}
              />
            </label>

            {form.height && form.weight && (
              <div style={{ background: '#eef2ff', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>Your BMI</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#4f46e5', marginTop: 4 }}>
                  {(parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 6 }}>What's your goal?</h2>
            <p style={{ color: '#64748b', marginBottom: 24, fontSize: 15 }}>We'll tailor your plan to match</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {goals.map(g => (
                <button
                  key={g.id}
                  onClick={() => update('goal', g.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '16px',
                    borderRadius: 16, border: `2px solid ${form.goal === g.id ? '#6366f1' : '#e2e8f0'}`,
                    background: form.goal === g.id ? '#eef2ff' : 'white', cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{g.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: form.goal === g.id ? '#4f46e5' : '#111827', fontSize: 15 }}>{g.label}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{g.desc}</div>
                  </div>
                  {form.goal === g.id && <Check size={18} color="#6366f1" />}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Activity Level</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activities.map(a => (
                <button
                  key={a.id}
                  onClick={() => update('activityLevel', a.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 12,
                    border: `2px solid ${form.activityLevel === a.id ? '#6366f1' : '#e2e8f0'}`,
                    background: form.activityLevel === a.id ? '#eef2ff' : 'white', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: form.activityLevel === a.id ? '#4f46e5' : '#111827', fontSize: 14 }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{a.desc}</div>
                  </div>
                  {form.activityLevel === a.id && <Check size={16} color="#6366f1" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Workout style</h2>
            <p style={{ color: '#64748b', marginBottom: 24, fontSize: 15 }}>How do you prefer to train?</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {workoutTypes.map(w => (
                <button
                  key={w.id}
                  onClick={() => update('workoutType', w.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '20px',
                    borderRadius: 16, border: `2px solid ${form.workoutType === w.id ? '#6366f1' : '#e2e8f0'}`,
                    background: form.workoutType === w.id ? '#eef2ff' : 'white', cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 36 }}>{w.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: form.workoutType === w.id ? '#4f46e5' : '#111827', fontSize: 16 }}>{w.label}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{w.desc}</div>
                  </div>
                  {form.workoutType === w.id && <Check size={18} color="#6366f1" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, padding: '16px 24px 36px', background: 'white',
        borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12,
      }}>
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '16px', borderRadius: 14, border: '1.5px solid #e2e8f0',
              background: 'white', cursor: 'pointer', fontWeight: 600, color: '#374151',
              minWidth: 54,
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <button
          onClick={() => step < TOTAL_STEPS ? setStep(s => s + 1) : handleFinish()}
          disabled={!canNext()}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '16px', borderRadius: 14, border: 'none',
            background: canNext() ? '#6366f1' : '#e2e8f0', cursor: canNext() ? 'pointer' : 'not-allowed',
            fontWeight: 700, fontSize: 16, color: canNext() ? 'white' : '#94a3b8',
            transition: 'all 0.15s',
          }}
        >
          {step < TOTAL_STEPS ? (
            <><span>Continue</span><ChevronRight size={20} /></>
          ) : (
            <><span>Start My Journey</span><span>🚀</span></>
          )}
        </button>
      </div>
    </div>
  );
}
