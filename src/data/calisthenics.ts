import type { CalisthenicSkill } from '../types';

export const calisthenicSkills: CalisthenicSkill[] = [
  {
    id: 'push',
    name: 'Push Strength',
    category: 'push',
    icon: '💪',
    levels: [
      { level: 1, name: 'Wall Push-up', description: 'Hands on wall, body diagonal', criteria: '3×15 clean reps', sets: 3, reps: '15', restSeconds: 60 },
      { level: 2, name: 'Incline Push-up', description: 'Hands elevated on bench or chair', criteria: '3×15 with control', sets: 3, reps: '15', restSeconds: 60 },
      { level: 3, name: 'Knee Push-up', description: 'Knees on ground, full upper body', criteria: '3×20 smooth reps', sets: 3, reps: '20', restSeconds: 60 },
      { level: 4, name: 'Push-up', description: 'Full bodyweight push-up', criteria: '3×15 chest to floor', sets: 3, reps: '15', restSeconds: 90 },
      { level: 5, name: 'Wide Push-up', description: 'Hands wider than shoulder width', criteria: '3×15 controlled', sets: 3, reps: '15', restSeconds: 90 },
      { level: 6, name: 'Diamond Push-up', description: 'Hands forming diamond shape', criteria: '3×12 full range', sets: 3, reps: '12', restSeconds: 90 },
      { level: 7, name: 'Archer Push-up', description: 'Side-to-side weight shift', criteria: '3×8 each side', sets: 3, reps: '8 each', restSeconds: 120 },
      { level: 8, name: 'Pseudo Planche Push-up', description: 'Fingers pointing back, lean forward', criteria: '3×8 full ROM', sets: 3, reps: '8', restSeconds: 120 },
      { level: 9, name: 'One-arm Push-up Negative', description: 'Slow descent on one arm', criteria: '3×5 each side, 4s down', sets: 3, reps: '5 each', restSeconds: 150 },
      { level: 10, name: 'One-arm Push-up', description: 'Full one arm push-up', criteria: '3×5 each side', sets: 3, reps: '5 each', restSeconds: 180 },
    ],
  },
  {
    id: 'pull',
    name: 'Pull Strength',
    category: 'pull',
    icon: '🏋️',
    levels: [
      { level: 1, name: 'Dead Hang', description: 'Hang from bar with straight arms', criteria: '3×30s', sets: 3, reps: '30s', restSeconds: 60 },
      { level: 2, name: 'Scapular Pull', description: 'Retract shoulder blades while hanging', criteria: '3×10 controlled', sets: 3, reps: '10', restSeconds: 60 },
      { level: 3, name: 'Negative Pull-up', description: 'Jump up, lower slowly over 5 seconds', criteria: '3×8 slow negatives', sets: 3, reps: '8', restSeconds: 90 },
      { level: 4, name: 'Assisted Pull-up', description: 'Band or foot on chair for assistance', criteria: '3×10 full ROM', sets: 3, reps: '10', restSeconds: 90 },
      { level: 5, name: 'Pull-up', description: 'Pronated grip, dead hang to chin over bar', criteria: '3×8 dead hang', sets: 3, reps: '8', restSeconds: 120 },
      { level: 6, name: 'Chin-up', description: 'Supinated (underhand) grip', criteria: '3×10 full ROM', sets: 3, reps: '10', restSeconds: 120 },
      { level: 7, name: 'Commando Pull-up', description: 'Neutral grip, alternate sides', criteria: '3×8 each side', sets: 3, reps: '8', restSeconds: 120 },
      { level: 8, name: 'L-sit Pull-up', description: 'Legs horizontal while pulling', criteria: '3×6 held position', sets: 3, reps: '6', restSeconds: 150 },
      { level: 9, name: 'Chest-to-bar Pull-up', description: 'Sternum touches the bar', criteria: '3×6 explosive', sets: 3, reps: '6', restSeconds: 150 },
      { level: 10, name: 'Muscle-up', description: 'Transition from pull to dip above bar', criteria: '3×5 controlled', sets: 3, reps: '5', restSeconds: 180 },
    ],
  },
  {
    id: 'core',
    name: 'Core Strength',
    category: 'core',
    icon: '🎯',
    levels: [
      { level: 1, name: 'Plank', description: 'Forearm plank, body straight', criteria: '3×30s', sets: 3, reps: '30s', restSeconds: 60 },
      { level: 2, name: 'Plank', description: 'Extended plank hold', criteria: '3×60s', sets: 3, reps: '60s', restSeconds: 60 },
      { level: 3, name: 'Hollow Body Hold', description: 'Lower back pressed to floor, arms and legs raised', criteria: '3×30s', sets: 3, reps: '30s', restSeconds: 60 },
      { level: 4, name: 'Hollow Body Rocks', description: 'Rock back and forth maintaining shape', criteria: '3×15 rocks', sets: 3, reps: '15', restSeconds: 90 },
      { level: 5, name: 'Tuck L-sit', description: 'Knees to chest while supported on hands', criteria: '3×15s', sets: 3, reps: '15s', restSeconds: 90 },
      { level: 6, name: 'L-sit (Floor)', description: 'Legs straight on floor, body elevated', criteria: '3×15s', sets: 3, reps: '15s', restSeconds: 90 },
      { level: 7, name: 'L-sit (Parallettes)', description: 'Full L-sit on parallettes', criteria: '3×20s', sets: 3, reps: '20s', restSeconds: 120 },
      { level: 8, name: 'Dragon Flag Negative', description: 'Slow controlled descent from vertical', criteria: '3×5 slow', sets: 3, reps: '5', restSeconds: 150 },
      { level: 9, name: 'Dragon Flag', description: 'Full dragon flag up and down', criteria: '3×5 full ROM', sets: 3, reps: '5', restSeconds: 180 },
    ],
  },
  {
    id: 'legs',
    name: 'Leg Strength',
    category: 'legs',
    icon: '🦵',
    levels: [
      { level: 1, name: 'Assisted Squat', description: 'Hold support, full depth squat', criteria: '3×15 deep squats', sets: 3, reps: '15', restSeconds: 60 },
      { level: 2, name: 'Bodyweight Squat', description: 'Full depth air squat', criteria: '3×20 ass-to-grass', sets: 3, reps: '20', restSeconds: 60 },
      { level: 3, name: 'Pause Squat', description: 'Hold 3 seconds at bottom', criteria: '3×15 with pause', sets: 3, reps: '15', restSeconds: 90 },
      { level: 4, name: 'Bulgarian Split Squat', description: 'Rear foot elevated, deep lunge', criteria: '3×12 each leg', sets: 3, reps: '12 each', restSeconds: 90 },
      { level: 5, name: 'Shrimp Squat Assisted', description: 'Hold onto support for balance', criteria: '3×8 each leg', sets: 3, reps: '8 each', restSeconds: 120 },
      { level: 6, name: 'Assisted Pistol Squat', description: 'One leg squat with support', criteria: '3×8 each leg', sets: 3, reps: '8 each', restSeconds: 120 },
      { level: 7, name: 'Pistol Squat', description: 'Full unassisted single-leg squat', criteria: '3×8 each leg clean', sets: 3, reps: '8 each', restSeconds: 150 },
    ],
  },
  {
    id: 'handstand',
    name: 'Handstand',
    category: 'handstand',
    icon: '🤸',
    levels: [
      { level: 1, name: 'Wall Handstand (Back)', description: 'Back to wall, kick up and hold', criteria: '3×30s', sets: 3, reps: '30s', restSeconds: 90 },
      { level: 2, name: 'Wall Handstand (Back)', description: 'Back to wall, extended hold', criteria: '3×60s', sets: 3, reps: '60s', restSeconds: 90 },
      { level: 3, name: 'Chest-to-Wall HS', description: 'Face wall, body straight as board', criteria: '3×45s very straight', sets: 3, reps: '45s', restSeconds: 120 },
      { level: 4, name: 'Kick-up Practice', description: 'Practice kicking up away from wall', criteria: '10 kick-up attempts', sets: 5, reps: '10 att.', restSeconds: 60 },
      { level: 5, name: 'Freestanding HS', description: 'Full freestanding handstand balance', criteria: '5s freestanding hold', sets: 5, reps: '5s+', restSeconds: 120 },
    ],
  },
];

export function getSkillById(id: string): CalisthenicSkill | undefined {
  return calisthenicSkills.find(s => s.id === id);
}
