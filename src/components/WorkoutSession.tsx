import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, SkipForward, CheckCircle } from 'lucide-react';
import type { SessionExercise } from '../types';

interface WorkoutSessionProps {
  title: string;
  exercises: SessionExercise[];
  onClose: () => void;
  onComplete: () => void;
}

// muscle → which SVG regions to light up
const muscleMap: Record<string, string[]> = {
  chest: ['chest-l', 'chest-r'],
  'upper chest': ['chest-l', 'chest-r'],
  back: ['back-l', 'back-r', 'lat-l', 'lat-r'],
  lats: ['lat-l', 'lat-r'],
  shoulders: ['shoulder-l', 'shoulder-r'],
  delts: ['shoulder-l', 'shoulder-r'],
  'rear delts': ['shoulder-l', 'shoulder-r'],
  triceps: ['tricep-l', 'tricep-r'],
  biceps: ['bicep-l', 'bicep-r'],
  brachialis: ['bicep-l', 'bicep-r'],
  abs: ['abs'],
  core: ['abs'],
  quads: ['quad-l', 'quad-r'],
  hamstrings: ['ham-l', 'ham-r'],
  glutes: ['glute-l', 'glute-r'],
  calves: ['calf-l', 'calf-r'],
  traps: ['trap-l', 'trap-r'],
};

function getHighlighted(muscle: string): string[] {
  const lower = muscle.toLowerCase();
  for (const [key, regions] of Object.entries(muscleMap)) {
    if (lower.includes(key)) return regions;
  }
  return [];
}

// human-readable label for each region id
const regionLabel: Record<string, string> = {
  'chest-l': 'Chest', 'chest-r': 'Chest',
  'shoulder-l': 'Delt', 'shoulder-r': 'Delt',
  'bicep-l': 'Bicep', 'bicep-r': 'Bicep',
  'tricep-l': 'Tricep', 'tricep-r': 'Tricep',
  'abs': 'Core',
  'glute-l': 'Glute', 'glute-r': 'Glute',
  'quad-l': 'Quad', 'quad-r': 'Quad',
  'ham-l': 'Ham', 'ham-r': 'Ham',
  'calf-l': 'Calf', 'calf-r': 'Calf',
  'lat-l': 'Lat', 'lat-r': 'Lat',
  'back-l': 'Back', 'back-r': 'Back',
  'trap-l': 'Trap', 'trap-r': 'Trap',
};

// deduplicated human labels for the "targets" pill row
function getTargetLabels(lit: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of lit) {
    const label = regionLabel[id];
    if (label && !seen.has(label)) { seen.add(label); out.push(label); }
  }
  return out;
}

function BodyDiagram({ muscle }: { muscle: string }) {
  const lit = getHighlighted(muscle);
  const isLit = (id: string) => lit.includes(id);

  // shape fill
  const fill = (id: string) => isLit(id) ? '#6366f1' : 'rgba(255,255,255,0.05)';
  // label color: bright white when active, barely-visible when not
  const tc = (id: string) => isLit(id) ? '#ffffff' : 'rgba(255,255,255,0.18)';
  const tw = (id: string): React.CSSProperties['fontWeight'] => isLit(id) ? 'bold' : 'normal';
  const glow = (id: string) => isLit(id) ? `drop-shadow(0 0 4px #818cf8)` : 'none';

  const Label = ({ id, x, y, fs = 5.5 }: { id: string; x: number; y: number; fs?: number }) => (
    <text
      x={x} y={y}
      textAnchor="middle" dominantBaseline="middle"
      fontSize={fs} fontWeight={tw(id)} fill={tc(id)}
      fontFamily="system-ui, -apple-system, sans-serif"
      style={{ filter: isLit(id) ? 'drop-shadow(0 0 2px #6366f1)' : 'none' }}
    >
      {regionLabel[id]}
    </text>
  );

  const targetLabels = getTargetLabels(lit);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {/* ── FRONT VIEW ── */}
        <div style={{ textAlign: 'center' }}>
          <svg width="130" height="290" viewBox="0 0 90 200" overflow="visible">
            {/* head + neck */}
            <ellipse cx="45" cy="13" rx="11" ry="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <rect x="41" y="24" width="8" height="7" rx="2" fill="rgba(255,255,255,0.06)" />

            {/* Delts */}
            <ellipse cx="22" cy="39" rx="11" ry="8" fill={fill('shoulder-l')} style={{ filter: glow('shoulder-l') }} />
            <Label id="shoulder-l" x={22} y={39} />
            <ellipse cx="68" cy="39" rx="11" ry="8" fill={fill('shoulder-r')} style={{ filter: glow('shoulder-r') }} />
            <Label id="shoulder-r" x={68} y={39} />

            {/* Chest */}
            <ellipse cx="36" cy="56" rx="10" ry="12" fill={fill('chest-l')} style={{ filter: glow('chest-l') }} />
            <Label id="chest-l" x={36} y={56} />
            <ellipse cx="54" cy="56" rx="10" ry="12" fill={fill('chest-r')} style={{ filter: glow('chest-r') }} />
            <Label id="chest-r" x={54} y={56} />

            {/* Biceps */}
            <rect x="9" y="38" width="12" height="32" rx="6" fill={fill('bicep-l')} style={{ filter: glow('bicep-l') }} />
            <Label id="bicep-l" x={15} y={54} fs={4.5} />
            <rect x="69" y="38" width="12" height="32" rx="6" fill={fill('bicep-r')} style={{ filter: glow('bicep-r') }} />
            <Label id="bicep-r" x={75} y={54} fs={4.5} />

            {/* Forearms (no label, not a target) */}
            <rect x="10" y="72" width="10" height="24" rx="5" fill="rgba(255,255,255,0.04)" />
            <rect x="70" y="72" width="10" height="24" rx="5" fill="rgba(255,255,255,0.04)" />

            {/* Core / Abs */}
            <rect x="37" y="69" width="16" height="28" rx="4" fill={fill('abs')} style={{ filter: glow('abs') }} />
            <Label id="abs" x={45} y={83} />

            {/* Hip / Glute front */}
            <rect x="32" y="97" width="26" height="13" rx="6" fill={fill('glute-l')} style={{ filter: glow('glute-l') }} />
            <Label id="glute-l" x={45} y={104} fs={4.5} />

            {/* Quads */}
            <rect x="32" y="110" width="14" height="52" rx="7" fill={fill('quad-l')} style={{ filter: glow('quad-l') }} />
            <Label id="quad-l" x={39} y={136} />
            <rect x="48" y="110" width="14" height="52" rx="7" fill={fill('quad-r')} style={{ filter: glow('quad-r') }} />
            <Label id="quad-r" x={55} y={136} />

            {/* Calves */}
            <rect x="32" y="164" width="12" height="26" rx="6" fill={fill('calf-l')} style={{ filter: glow('calf-l') }} />
            <Label id="calf-l" x={38} y={177} fs={4.5} />
            <rect x="47" y="164" width="12" height="26" rx="6" fill={fill('calf-r')} style={{ filter: glow('calf-r') }} />
            <Label id="calf-r" x={53} y={177} fs={4.5} />

            {/* Feet */}
            <ellipse cx="38" cy="192" rx="9" ry="4" fill="rgba(255,255,255,0.04)" />
            <ellipse cx="52" cy="192" rx="9" ry="4" fill="rgba(255,255,255,0.04)" />
          </svg>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2, letterSpacing: '0.08em' }}>FRONT</div>
        </div>

        {/* ── BACK VIEW ── */}
        <div style={{ textAlign: 'center' }}>
          <svg width="130" height="290" viewBox="0 0 90 200" overflow="visible">
            {/* head + neck */}
            <ellipse cx="45" cy="13" rx="11" ry="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <rect x="41" y="24" width="8" height="7" rx="2" fill="rgba(255,255,255,0.06)" />

            {/* Traps */}
            <ellipse cx="30" cy="37" rx="13" ry="9" fill={fill('trap-l')} style={{ filter: glow('trap-l') }} />
            <Label id="trap-l" x={30} y={37} />
            <ellipse cx="60" cy="37" rx="13" ry="9" fill={fill('trap-r')} style={{ filter: glow('trap-r') }} />
            <Label id="trap-r" x={60} y={37} />

            {/* Lats / Back */}
            <ellipse cx="30" cy="66" rx="11" ry="26" fill={fill('lat-l')} style={{ filter: glow('lat-l') }} />
            <Label id="lat-l" x={30} y={66} />
            <ellipse cx="60" cy="66" rx="11" ry="26" fill={fill('lat-r')} style={{ filter: glow('lat-r') }} />
            <Label id="lat-r" x={60} y={66} />

            {/* Triceps */}
            <rect x="9" y="38" width="12" height="32" rx="6" fill={fill('tricep-l')} style={{ filter: glow('tricep-l') }} />
            <Label id="tricep-l" x={15} y={54} fs={4} />
            <rect x="69" y="38" width="12" height="32" rx="6" fill={fill('tricep-r')} style={{ filter: glow('tricep-r') }} />
            <Label id="tricep-r" x={75} y={54} fs={4} />

            {/* Forearms */}
            <rect x="10" y="72" width="10" height="24" rx="5" fill="rgba(255,255,255,0.04)" />
            <rect x="70" y="72" width="10" height="24" rx="5" fill="rgba(255,255,255,0.04)" />

            {/* Glutes */}
            <ellipse cx="36" cy="108" rx="12" ry="14" fill={fill('glute-l')} style={{ filter: glow('glute-l') }} />
            <Label id="glute-l" x={36} y={108} />
            <ellipse cx="54" cy="108" rx="12" ry="14" fill={fill('glute-r')} style={{ filter: glow('glute-r') }} />
            <Label id="glute-r" x={54} y={108} />

            {/* Hamstrings */}
            <rect x="32" y="122" width="14" height="46" rx="7" fill={fill('ham-l')} style={{ filter: glow('ham-l') }} />
            <Label id="ham-l" x={39} y={145} />
            <rect x="48" y="122" width="14" height="46" rx="7" fill={fill('ham-r')} style={{ filter: glow('ham-r') }} />
            <Label id="ham-r" x={55} y={145} />

            {/* Calves */}
            <rect x="32" y="170" width="13" height="25" rx="6" fill={fill('calf-l')} style={{ filter: glow('calf-l') }} />
            <Label id="calf-l" x={38.5} y={182} fs={4.5} />
            <rect x="47" y="170" width="13" height="25" rx="6" fill={fill('calf-r')} style={{ filter: glow('calf-r') }} />
            <Label id="calf-r" x={53.5} y={182} fs={4.5} />

            {/* Feet */}
            <ellipse cx="38" cy="197" rx="9" ry="4" fill="rgba(255,255,255,0.04)" />
            <ellipse cx="52" cy="197" rx="9" ry="4" fill="rgba(255,255,255,0.04)" />
          </svg>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2, letterSpacing: '0.08em' }}>BACK</div>
        </div>
      </div>

      {/* Targets pill row */}
      {targetLabels.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
          <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, alignSelf: 'center' }}>TARGETS:</span>
          {targetLabels.map(label => (
            <span key={label} style={{
              background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.5)',
              color: '#a5b4fc', borderRadius: 20, padding: '3px 10px',
              fontSize: 12, fontWeight: 700,
            }}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function WorkoutSession({ title, exercises, onClose, onComplete }: WorkoutSessionProps) {
  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [weight, setWeight] = useState('60');
  const [reps, setReps] = useState('');
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [setsLogged, setSetsLogged] = useState<{ weight: number; reps: number }[][]>(
    () => exercises.map(() => [])
  );
  const [showTips, setShowTips] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ex = exercises[exIdx];

  useEffect(() => {
    setReps(ex.reps.split('-')[0].replace(/\D/g, '') || '10');
  }, [exIdx, ex.reps]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isResting) {
      intervalRef.current = setInterval(() => {
        setRestSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setIsResting(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (timerRunning) {
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isResting, timerRunning]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const logSet = () => {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    const updated = setsLogged.map((arr, i) =>
      i === exIdx ? [...arr, { weight: w, reps: r }] : arr
    );
    setSetsLogged(updated);
    const newSetIdx = setIdx + 1;
    if (newSetIdx >= ex.sets) {
      // Move to next exercise or finish
      if (exIdx + 1 >= exercises.length) {
        setDone(true);
      } else {
        startRest(ex.restSeconds);
        setTimeout(() => {
          setExIdx(exIdx + 1);
          setSetIdx(0);
        }, ex.restSeconds * 1000 + 100);
      }
    } else {
      setSetIdx(newSetIdx);
      startRest(ex.restSeconds);
    }
  };

  const startRest = (seconds: number) => {
    setRestSeconds(seconds);
    setIsResting(true);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestSeconds(0);
  };

  const goNext = () => {
    if (exIdx + 1 >= exercises.length) { setDone(true); return; }
    setExIdx(exIdx + 1);
    setSetIdx(0);
    setIsResting(false);
  };

  const goPrev = () => {
    if (exIdx === 0) return;
    setExIdx(exIdx - 1);
    setSetIdx(0);
    setIsResting(false);
  };

  if (done) {
    const totalSets = setsLogged.reduce((a, arr) => a + arr.length, 0);
    const totalReps = setsLogged.reduce((a, arr) => a + arr.reduce((b, s) => b + s.reps, 0), 0);
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'linear-gradient(135deg,#6366f1,#4338ca)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 24, color: 'white', textAlign: 'center',
      }}>
        <div style={{ fontSize: 72 }}>🏆</div>
        <div style={{ fontSize: 28, fontWeight: 900, marginTop: 16 }}>Workout Complete!</div>
        <div style={{ fontSize: 16, opacity: 0.85, marginTop: 8 }}>{title}</div>
        <div style={{ display: 'flex', gap: 24, marginTop: 28 }}>
          {[
            { label: 'Exercises', value: exercises.length },
            { label: 'Sets Done', value: totalSets },
            { label: 'Total Reps', value: totalReps },
            { label: 'Time', value: fmt(elapsed) },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '14px 18px' }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onComplete}
          style={{
            marginTop: 36, padding: '16px 40px', borderRadius: 18, border: 'none',
            background: 'white', color: '#6366f1', fontWeight: 800, fontSize: 18, cursor: 'pointer',
          }}
        >
          Finish 🎉
        </button>
      </div>
    );
  }

  const progress = ((exIdx) / exercises.length) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0f172a', zIndex: 1000,
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
    }}>
      {/* Top bar */}
      <div style={{ padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: 'white' }}>
          <X size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>{title}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>Exercise {exIdx + 1} of {exercises.length}</div>
        </div>
        <div style={{ color: '#94a3b8', fontSize: 13 }}>{fmt(elapsed)}</div>
        <button onClick={() => setTimerRunning(t => !t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
          {timerRunning ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      {/* Overall progress bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', margin: '0 20px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#6366f1', borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>

      {isResting ? (
        /* Rest screen */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ fontSize: 16, color: '#94a3b8', marginBottom: 12 }}>Rest Time</div>
          <div style={{
            width: 160, height: 160, borderRadius: '50%',
            border: '6px solid #6366f1',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(99,102,241,0.4)',
          }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: 'white' }}>{restSeconds}</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>seconds</div>
          </div>
          <div style={{ fontSize: 14, color: '#64748b', marginTop: 20, textAlign: 'center' }}>
            Up next: {exIdx + 1 < exercises.length && setIdx + 1 >= ex.sets
              ? exercises[exIdx + 1]?.name
              : `Set ${setIdx + 1} of ${ex.name}`}
          </div>
          <button
            onClick={skipRest}
            style={{
              marginTop: 28, display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 14, padding: '12px 24px', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}
          >
            <SkipForward size={16} /> Skip Rest
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, padding: '16px 20px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Exercise header */}
          <div style={{ background: 'rgba(99,102,241,0.15)', borderRadius: 20, padding: '20px', border: '1px solid rgba(99,102,241,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'white', lineHeight: 1.1 }}>{ex.name}</div>
                <div style={{ fontSize: 13, color: '#818cf8', marginTop: 4, fontWeight: 600 }}>{ex.muscle}</div>
              </div>
              <div style={{ background: '#6366f1', borderRadius: 12, padding: '6px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>{ex.sets}×{ex.reps}</div>
              </div>
            </div>
            {/* Set progress */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {Array.from({ length: ex.sets }).map((_, i) => {
                const logged = setsLogged[exIdx];
                const isDone = i < (logged?.length ?? 0);
                const isCurrent = i === setIdx;
                return (
                  <div key={i} style={{
                    flex: 1, height: 6, borderRadius: 3,
                    background: isDone ? '#10b981' : isCurrent ? '#6366f1' : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.3s',
                  }} />
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
              Set {setIdx + 1} of {ex.sets}
            </div>
          </div>

          {/* Body diagram */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: '16px 8px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <BodyDiagram muscle={ex.muscle} />
          </div>

          {/* Form tips */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setShowTips(t => !t)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '13px 16px', background: 'none',
                border: 'none', color: '#e2e8f0', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <span>📋 Form Tips</span>
              <span style={{ fontSize: 11, color: '#64748b' }}>{showTips ? '▲ Hide' : '▼ Show'}</span>
            </button>
            {showTips && (
              <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ex.formTips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#6366f1', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white', marginTop: 1 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input section */}
          {ex.hasWeight ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Weight (kg)</div>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  style={{
                    width: '100%', background: 'none', border: 'none', outline: 'none',
                    fontSize: 32, fontWeight: 900, color: 'white', textAlign: 'center',
                  }}
                />
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reps</div>
                <input
                  type="number"
                  value={reps}
                  onChange={e => setReps(e.target.value)}
                  style={{
                    width: '100%', background: 'none', border: 'none', outline: 'none',
                    fontSize: 32, fontWeight: 900, color: 'white', textAlign: 'center',
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reps / Duration</div>
              <input
                type="number"
                value={reps}
                onChange={e => setReps(e.target.value)}
                style={{
                  width: '100%', background: 'none', border: 'none', outline: 'none',
                  fontSize: 40, fontWeight: 900, color: 'white', textAlign: 'center',
                }}
              />
            </div>
          )}

          {/* Logged sets */}
          {setsLogged[exIdx]?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {setsLogged[exIdx].map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '8px 14px',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  <span style={{ fontSize: 13, color: '#6ee7b7', fontWeight: 600 }}>Set {i + 1}</span>
                  <span style={{ fontSize: 13, color: 'white', fontWeight: 700 }}>
                    {ex.hasWeight ? `${s.weight}kg × ${s.reps} reps` : `${s.reps} reps`}
                  </span>
                  <CheckCircle size={16} color="#10b981" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom action bar */}
      {!isResting && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '16px 20px 36px',
          background: 'linear-gradient(to top, #0f172a 70%, transparent)',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <button
            onClick={goPrev}
            disabled={exIdx === 0}
            style={{
              width: 48, height: 52, borderRadius: 14, border: 'none',
              background: exIdx === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              color: exIdx === 0 ? '#334155' : 'white', cursor: exIdx === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={logSet}
            style={{
              flex: 1, padding: '16px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4338ca)',
              color: 'white', fontWeight: 800, fontSize: 17, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
            }}
          >
            {setIdx + 1 >= ex.sets && exIdx + 1 >= exercises.length ? 'Finish' : `Log Set ${setIdx + 1}`}
          </button>

          <button
            onClick={goNext}
            style={{
              width: 48, height: 52, borderRadius: 14, border: 'none',
              background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
