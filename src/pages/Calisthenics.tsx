import { useState } from 'react';
import { ChevronRight, ChevronUp, CheckCircle, Lock, Star, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import { calisthenicSkills } from '../data/calisthenics';
import { WorkoutSession } from '../components/WorkoutSession';
import type { SkillCategory, SessionExercise } from '../types';

const categories: { id: SkillCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'push', label: '💪 Push' },
  { id: 'pull', label: '🏋️ Pull' },
  { id: 'core', label: '🎯 Core' },
  { id: 'legs', label: '🦵 Legs' },
  { id: 'handstand', label: '🤸 HS' },
];

const catColors: Record<string, { bg: string; color: string; border: string }> = {
  push: { bg: '#fdf2f8', color: '#db2777', border: '#fbcfe8' },
  pull: { bg: '#eef2ff', color: '#4f46e5', border: '#c7d2fe' },
  core: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  legs: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  handstand: { bg: '#fefce8', color: '#ca8a04', border: '#fde68a' },
};

const categoryMuscle: Record<string, string> = {
  push: 'Chest',
  pull: 'Back',
  core: 'Core',
  legs: 'Quads',
  handstand: 'Shoulders',
};

const formTipsByCat: Record<string, string[]> = {
  push: ['Keep body in a straight plank line', 'Lower chest all the way to target', 'Elbows at ~45° from body', 'Exhale on the push, inhale on the way down'],
  pull: ['Start from a dead hang — full arm extension', 'Lead with your chest, not your chin', 'Squeeze shoulder blades together at top', 'Control the descent — 2-3 seconds down'],
  core: ['Posterior pelvic tilt — flatten your lower back', 'Never hold your breath', 'Quality over quantity — no compensation', 'Brace your entire core, not just abs'],
  legs: ['Knees track over toes at all times', 'Full depth before adding difficulty', 'Drive through the floor on the way up', 'Keep chest tall, core braced'],
  handstand: ['Find your kick-up consistently first', 'Hollow body position — squeeze glutes and abs', 'Point fingers forward, push the floor away', 'Look slightly forward, not directly down'],
};

export function Calisthenics() {
  const { calisthenicsProgress, upgradeSkillLevel, setSkillLevel, logWorkout } = useStore();
  const [filter, setFilter] = useState<SkillCategory | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<SessionExercise[] | null>(null);
  const [sessionTitle, setSessionTitle] = useState('');

  const filtered = filter === 'all' ? calisthenicSkills : calisthenicSkills.filter(s => s.category === filter);

  const startSkillSession = (skillId: string) => {
    const skill = calisthenicSkills.find(s => s.id === skillId);
    if (!skill) return;
    const levelIdx = calisthenicsProgress[skillId] ?? 0;
    const lv = skill.levels[levelIdx];
    const tips = formTipsByCat[skill.category] ?? ['Focus on form', 'Full range of motion', 'Control the movement'];

    const exercises: SessionExercise[] = Array.from({ length: lv.sets }).map((_, i) => ({
      id: `${skillId}-set-${i}`,
      name: lv.name,
      muscle: categoryMuscle[skill.category] ?? 'Core',
      sets: 1,
      reps: lv.reps,
      restSeconds: lv.restSeconds,
      hasWeight: false,
      formTips: tips,
    }));

    setSessionTitle(`${skill.name} · ${lv.name}`);
    setActiveSession(exercises);
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
  };

  if (activeSession) {
    return (
      <WorkoutSession
        title={sessionTitle}
        exercises={activeSession}
        onClose={() => setActiveSession(null)}
        onComplete={() => {
          setActiveSession(null);
          logWorkout();
        }}
      />
    );
  }

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        padding: '56px 20px 24px',
        borderRadius: '0 0 28px 28px',
        color: 'white',
      }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Calisthenics</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>Skill progressions · Bodyweight mastery</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 14px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{calisthenicSkills.length}</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Skill Tracks</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 14px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {calisthenicSkills.reduce((acc, s) => acc + (calisthenicsProgress[s.id] ?? 0), 0)}
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Levels Unlocked</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 14px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {calisthenicSkills.reduce((acc, s) => acc + s.levels.length, 0)}
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Total Levels</div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ padding: '16px 16px 0', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap',
                background: filter === c.id ? '#ec4899' : 'white',
                color: filter === c.id ? 'white' : '#64748b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'all 0.15s',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(skill => {
          const currentLevelIdx = calisthenicsProgress[skill.id] ?? 0;
          const currentLevel = skill.levels[currentLevelIdx];
          const nextLevel = skill.levels[currentLevelIdx + 1];
          const pct = ((currentLevelIdx) / (skill.levels.length - 1)) * 100;
          const isExpanded = expanded === skill.id;
          const col = catColors[skill.category];

          return (
            <div key={skill.id} style={cardStyle}>
              {/* Skill header */}
              <div
                style={{ padding: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                onClick={() => setExpanded(isExpanded ? null : skill.id)}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: col.bg, border: `1px solid ${col.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
                }}>
                  {skill.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 2 }}>{skill.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Level {currentLevelIdx + 1}/{skill.levels.length} · {currentLevel.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: col.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: col.color }}>{Math.round(pct)}%</span>
                  </div>
                </div>
                <div style={{ color: '#94a3b8', flexShrink: 0 }}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>

              {/* Expanded workout plan */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #f8fafc', padding: '0 18px 18px' }}>
                  {/* Current exercise */}
                  <div style={{ background: col.bg, borderRadius: 14, padding: '14px', marginTop: 14, marginBottom: 12, border: `1px solid ${col.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Star size={14} color={col.color} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Exercise</span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{currentLevel.name}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>{currentLevel.description}</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {[
                        { label: 'Sets', value: currentLevel.sets },
                        { label: 'Reps', value: currentLevel.reps },
                        { label: 'Rest', value: `${currentLevel.restSeconds}s` },
                      ].map(stat => (
                        <div key={stat.label} style={{
                          flex: 1, background: 'white', borderRadius: 10, padding: '10px 6px', textAlign: 'center',
                          border: '1px solid rgba(0,0,0,0.06)',
                        }}>
                          <div style={{ fontWeight: 800, fontSize: 18, color: col.color }}>{stat.value}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: 8, fontSize: 12, color: '#374151' }}>
                      <strong>Progression criteria:</strong> {currentLevel.criteria}
                    </div>

                    {/* Start Session button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); startSkillSession(skill.id); }}
                      style={{
                        marginTop: 12, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px', borderRadius: 12, border: 'none',
                        background: col.color, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        boxShadow: `0 4px 14px ${col.color}44`,
                      }}
                    >
                      <Play size={16} fill="white" />
                      Start Session
                    </button>
                  </div>

                  {/* Next level preview */}
                  {nextLevel && (
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', marginBottom: 14, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Lock size={12} color="#94a3b8" />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Level</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{nextLevel.name}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Unlock by meeting: {currentLevel.criteria}</div>
                    </div>
                  )}

                  {/* All levels mini-list */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>All Levels</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {skill.levels.map((lv, i) => {
                        const done = i < currentLevelIdx;
                        const active = i === currentLevelIdx;
                        return (
                          <div
                            key={i}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10,
                              background: active ? col.bg : done ? '#f0fdf4' : '#fafafa',
                              border: `1px solid ${active ? col.border : done ? '#bbf7d0' : '#f1f5f9'}`,
                            }}
                          >
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                              background: done ? '#10b981' : active ? col.color : '#e2e8f0',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {done
                                ? <CheckCircle size={14} color="white" />
                                : <span style={{ fontSize: 10, fontWeight: 700, color: active ? 'white' : '#94a3b8' }}>{i + 1}</span>
                              }
                            </div>
                            <span style={{ fontSize: 13, color: active ? col.color : done ? '#16a34a' : '#94a3b8', fontWeight: active ? 700 : 500, flex: 1 }}>
                              {lv.name}
                            </span>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{lv.sets}×{lv.reps}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Level controls */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      disabled={currentLevelIdx === 0}
                      onClick={() => setSkillLevel(skill.id, currentLevelIdx - 1)}
                      style={{
                        flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0',
                        background: 'white', cursor: currentLevelIdx === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 600, color: currentLevelIdx === 0 ? '#cbd5e1' : '#64748b', fontSize: 13,
                      }}
                    >
                      ← Level Down
                    </button>
                    <button
                      disabled={currentLevelIdx >= skill.levels.length - 1}
                      onClick={() => upgradeSkillLevel(skill.id)}
                      style={{
                        flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                        background: currentLevelIdx >= skill.levels.length - 1 ? '#e2e8f0' : col.color,
                        cursor: currentLevelIdx >= skill.levels.length - 1 ? 'not-allowed' : 'pointer',
                        fontWeight: 700, color: currentLevelIdx >= skill.levels.length - 1 ? '#94a3b8' : 'white', fontSize: 13,
                      }}
                    >
                      Level Up ✨
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
