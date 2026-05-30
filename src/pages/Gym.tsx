import { useState } from 'react';
import { ChevronDown, Plus, Check, TrendingUp, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import { gymPrograms } from '../data/gym';
import { WorkoutSession } from '../components/WorkoutSession';
import type { GymExercise, SessionExercise } from '../types';

const formTipsMap: Record<string, string[]> = {
  bench: ['Retract shoulder blades into the bench', 'Feet flat on the floor, drive through them', 'Lower bar to lower chest, not neck', 'Elbows at ~45° from body'],
  ohp: ['Stand with feet shoulder-width, core braced', 'Bar starts at collarbone level', 'Press straight up, finish with arms locked', 'Keep glutes squeezed throughout'],
  incline: ['Set bench to 30-45°', 'Elbows slightly flared, not fully out', 'Lower dumbbells to upper chest', 'Squeeze at the top'],
  lateral: ['Slight bend in elbows, lead with elbows not hands', 'Raise only to shoulder height', 'Control the descent — 3 seconds down', 'Slight forward lean'],
  'tricep-pd': ['Keep elbows pinned to your sides', 'Fully extend at bottom, squeeze', 'Slow eccentric on the way up', 'No swinging the body'],
  'overhead-ext': ['Keep upper arms vertical and still', 'Lower behind head until forearms parallel', 'Press to full extension', 'Brace core to avoid lower back arch'],
  deadlift: ['Hip-width stance, bar over mid-foot', 'Hinge at hips, flat back, chest up', 'Drive through the floor, not pull up', 'Lock hips and knees out together at top'],
  'barbell-row': ['Hip-hinge position, torso ~45°', 'Pull bar to lower chest/upper abs', 'Squeeze lats at top, hold briefly', 'Control bar back to start'],
  'lat-pd': ['Lean back slightly, chest tall', 'Pull bar to upper chest, not below', 'Lead with elbows, not hands', 'Full stretch at top each rep'],
  'face-pull': ['Rope at face height or above', 'Pull to forehead, separate hands at end', 'External rotate — show your armpits', 'Control the return slowly'],
  'bicep-curl': ['Keep elbows pinned to sides throughout', 'Full extension at bottom, full curl at top', 'Supinate wrist at top', 'No body sway'],
  'hammer-curl': ['Neutral grip (thumbs up) throughout', 'Elbows stay still at sides', 'Curl to shoulder height', 'Lower under control'],
  squat: ['Feet shoulder-width, toes slightly out', 'Break at hips and knees simultaneously', 'Knees track over toes, chest up', 'Drive through full foot, not just heels'],
  'leg-press': ['Feet hip-width, mid-plate', 'Lower until 90° knee angle', 'Do not lock knees at top', 'Push through heels, not toes'],
  rdl: ['Soft bend in knees, hip hinge', 'Bar stays close to body, drag down shins', 'Feel hamstring stretch, stop before rounding', 'Drive hips forward to stand'],
  'leg-curl': ['Lie flat, pad at ankle not calf', 'Curl smoothly to full range', 'No hip rising off pad', 'Control the descent fully'],
  'hip-thrust': ['Upper back on bench, feet flat', 'Drive hips up, squeeze glutes hard', 'Chin tucked, neutral spine at top', 'Lower controlled below bench level'],
  'calf-raise': ['Full stretch at bottom each rep', 'Rise high on the ball of the foot', 'Pause at the top', 'Slow 3-second descent'],
};

function getFormTips(ex: GymExercise): string[] {
  for (const [key, tips] of Object.entries(formTipsMap)) {
    if (ex.id.includes(key) || ex.name.toLowerCase().includes(key)) return tips;
  }
  return ['Keep core braced throughout', 'Control both the lift and lower phases', 'Focus on the target muscle', 'Use full range of motion'];
}

export function Gym() {
  const { selectedProgram, currentDayIndex, gymProgress, logGymSet, clearGymSets, selectProgram, nextDay, logWorkout } = useStore();
  const [showProgramPicker, setShowProgramPicker] = useState(false);
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, { reps: string; weight: string }>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [sessionActive, setSessionActive] = useState(false);

  const program = gymPrograms.find(p => p.id === selectedProgram) ?? gymPrograms[0];
  const dayIdx = currentDayIndex % program.days.length;
  const day = program.days[dayIdx];

  const handleAddSet = (ex: GymExercise) => {
    const inp = inputs[ex.id] ?? { reps: String(ex.repsTarget), weight: '60' };
    const reps = parseInt(inp.reps) || ex.repsTarget;
    const weight = parseFloat(inp.weight) || 0;
    logGymSet(ex.id, { reps, weight });
  };

  const handleCompleteExercise = (exId: string) => {
    setCompleted(prev => new Set([...prev, exId]));
  };

  const allDone = day.exercises.every(ex => completed.has(ex.id));

  const sessionExercises: SessionExercise[] = day.exercises.map(ex => ({
    id: ex.id,
    name: ex.name,
    muscle: ex.muscle,
    sets: ex.sets,
    reps: String(ex.repsTarget),
    restSeconds: 90,
    hasWeight: true,
    formTips: getFormTips(ex),
  }));

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
  };

  const muscleColor = (muscle: string) => {
    const m = muscle.toLowerCase();
    if (m.includes('chest')) return '#ef4444';
    if (m.includes('back') || m.includes('lat')) return '#3b82f6';
    if (m.includes('shoulder') || m.includes('delt')) return '#8b5cf6';
    if (m.includes('quad') || m.includes('leg') || m.includes('glute') || m.includes('hamstring')) return '#10b981';
    if (m.includes('bicep')) return '#f59e0b';
    if (m.includes('tricep')) return '#ec4899';
    if (m.includes('calf')) return '#06b6d4';
    return '#6366f1';
  };

  if (sessionActive) {
    return (
      <WorkoutSession
        title={`${program.name} · ${day.name}`}
        exercises={sessionExercises}
        onClose={() => setSessionActive(false)}
        onComplete={() => {
          setSessionActive(false);
          setCompleted(new Set(day.exercises.map(e => e.id)));
          logWorkout();
        }}
      />
    );
  }

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
        padding: '56px 20px 24px',
        borderRadius: '0 0 28px 28px',
        color: 'white',
      }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Gym Training</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>Progressive overload · Track your gains</div>

        <button
          onClick={() => setShowProgramPicker(!showProgramPicker)}
          style={{
            marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '12px 14px',
            border: 'none', cursor: 'pointer', color: 'white',
          }}
        >
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Current Program</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{program.name}</div>
          </div>
          <ChevronDown size={18} style={{ opacity: 0.8 }} />
        </button>

        {showProgramPicker && (
          <div style={{
            marginTop: 8, background: 'white', borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}>
            {gymPrograms.map(p => (
              <button
                key={p.id}
                onClick={() => { selectProgram(p.id); setShowProgramPicker(false); setCompleted(new Set()); }}
                style={{
                  width: '100%', padding: '14px 16px', border: 'none', cursor: 'pointer',
                  background: p.id === selectedProgram ? '#eef2ff' : 'white',
                  color: p.id === selectedProgram ? '#4f46e5' : '#374151',
                  fontWeight: p.id === selectedProgram ? 700 : 500, fontSize: 14,
                  textAlign: 'left', borderBottom: '1px solid #f8fafc',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <span>{p.name}</span>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>{p.days.length} days</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Today's session card with Start button */}
        <div style={{ ...cardStyle, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{day.name}</div>
              <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 600 }}>{day.focus}</div>
            </div>
            <div style={{
              background: '#eef2ff', borderRadius: 20, padding: '4px 12px',
              fontSize: 12, fontWeight: 600, color: '#6366f1',
            }}>
              Day {dayIdx + 1}/{program.days.length}
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{day.exercises.length} exercises · {day.exercises.reduce((a, e) => a + e.sets, 0)} total sets</div>

          {/* Day tabs */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12, overflowX: 'auto' }}>
            {program.days.map((d, i) => (
              <button
                key={i}
                onClick={() => setCompleted(new Set())}
                style={{
                  padding: '6px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: i === dayIdx ? '#6366f1' : '#f1f5f9',
                  color: i === dayIdx ? 'white' : '#64748b',
                  fontWeight: i === dayIdx ? 700 : 500, fontSize: 12, whiteSpace: 'nowrap',
                }}
              >
                {d.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Start Workout button */}
          <button
            onClick={() => setSessionActive(true)}
            style={{
              marginTop: 14, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px', borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4338ca)',
              color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            }}
          >
            <Play size={20} fill="white" />
            Start Workout
          </button>
        </div>

        {/* Exercise list */}
        {day.exercises.map((ex) => {
          const isExpanded = expandedEx === ex.id;
          const sets = gymProgress[ex.id] ?? [];
          const isDone = completed.has(ex.id);
          const color = muscleColor(ex.muscle);
          const inp = inputs[ex.id] ?? { reps: String(ex.repsTarget), weight: '60' };

          return (
            <div key={ex.id} style={{ ...cardStyle, opacity: isDone ? 0.75 : 1 }}>
              <div
                onClick={() => !isDone && setExpandedEx(isExpanded ? null : ex.id)}
                style={{ padding: '16px', cursor: isDone ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: isDone ? '#ecfdf5' : '#f8fafc', border: `1px solid ${isDone ? '#bbf7d0' : '#f1f5f9'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isDone
                    ? <Check size={18} color="#10b981" />
                    : <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                  }
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: isDone ? '#94a3b8' : '#111827' }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    {ex.sets} × {ex.repsTarget} reps · {ex.muscle}
                  </div>
                  {sets.length > 0 && (
                    <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, marginTop: 2 }}>
                      {sets.length} sets logged
                    </div>
                  )}
                </div>

                <div style={{
                  background: '#f1f5f9', borderRadius: 8, padding: '4px 10px',
                  fontSize: 11, fontWeight: 600, color: color,
                }}>
                  {sets.length}/{ex.sets}
                </div>
              </div>

              {isExpanded && !isDone && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f8fafc' }}>
                  {sets.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 12 }}>
                      <TrendingUp size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                        Best today: {Math.max(...sets.map(s => s.weight))}kg × {sets.sort((a, b) => b.reps - a.reps)[0].reps} reps
                      </span>
                    </div>
                  )}

                  {sets.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      {sets.map((s, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '6px 10px', background: '#f8fafc', borderRadius: 8, marginBottom: 4, fontSize: 13,
                        }}>
                          <span style={{ color: '#94a3b8', fontWeight: 600 }}>Set {i + 1}</span>
                          <span style={{ fontWeight: 700, color: '#111827' }}>{s.weight} kg × {s.reps} reps</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>WEIGHT (kg)</div>
                      <input
                        type="number"
                        value={inp.weight}
                        onChange={e => setInputs(p => ({ ...p, [ex.id]: { ...inp, weight: e.target.value } }))}
                        style={{
                          width: '100%', padding: '12px', borderRadius: 12,
                          border: '1.5px solid #e2e8f0', fontSize: 18, fontWeight: 700,
                          color: '#111827', textAlign: 'center', outline: 'none', background: 'white',
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>REPS</div>
                      <input
                        type="number"
                        value={inp.reps}
                        onChange={e => setInputs(p => ({ ...p, [ex.id]: { ...inp, reps: e.target.value } }))}
                        style={{
                          width: '100%', padding: '12px', borderRadius: 12,
                          border: '1.5px solid #e2e8f0', fontSize: 18, fontWeight: 700,
                          color: '#111827', textAlign: 'center', outline: 'none', background: 'white',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleAddSet(ex)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '12px', borderRadius: 12, border: 'none',
                        background: '#6366f1', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14,
                      }}
                    >
                      <Plus size={16} /> Log Set
                    </button>
                    <button
                      onClick={() => { handleCompleteExercise(ex.id); setExpandedEx(null); }}
                      style={{
                        padding: '12px 16px', borderRadius: 12, border: 'none',
                        background: '#ecfdf5', color: '#16a34a', fontWeight: 700, cursor: 'pointer', fontSize: 14,
                      }}
                    >
                      ✓ Done
                    </button>
                  </div>

                  {sets.length > 0 && (
                    <button
                      onClick={() => clearGymSets(ex.id)}
                      style={{
                        marginTop: 8, width: '100%', padding: '8px', borderRadius: 10, border: '1px solid #fee2e2',
                        background: '#fff', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: 12,
                      }}
                    >
                      Clear sets
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {allDone && (
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
            borderRadius: 20, padding: '20px', textAlign: 'center',
            border: '1px solid #bbf7d0',
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#064e3b', marginBottom: 4 }}>Workout Complete!</div>
            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 16 }}>You crushed {day.name}</div>
            <button
              onClick={() => { logWorkout(); nextDay(); setCompleted(new Set()); setExpandedEx(null); }}
              style={{
                padding: '14px 28px', borderRadius: 14, border: 'none',
                background: '#10b981', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
              }}
            >
              Next Workout →
            </button>
          </div>
        )}

        <div style={{ background: '#fffbeb', borderRadius: 16, padding: '14px', border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>💡 Progressive Overload</div>
          <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.5 }}>
            Add {day.exercises[0]?.weightIncrement ?? 2.5}kg to main lifts when you complete all sets with good form. Consistency beats intensity.
          </div>
        </div>
      </div>
    </div>
  );
}
