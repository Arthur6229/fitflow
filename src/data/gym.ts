import type { GymProgram } from '../types';

export const gymPrograms: GymProgram[] = [
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    days: [
      {
        name: 'Push Day',
        focus: 'Chest · Shoulders · Triceps',
        exercises: [
          { id: 'bench', name: 'Bench Press', muscle: 'Chest', sets: 4, repsTarget: 8, weightIncrement: 2.5 },
          { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders', sets: 4, repsTarget: 8, weightIncrement: 2.5 },
          { id: 'incline', name: 'Incline DB Press', muscle: 'Upper Chest', sets: 3, repsTarget: 10, weightIncrement: 2 },
          { id: 'lateral', name: 'Lateral Raise', muscle: 'Delts', sets: 3, repsTarget: 15, weightIncrement: 1 },
          { id: 'tricep-pd', name: 'Tricep Pushdown', muscle: 'Triceps', sets: 3, repsTarget: 12, weightIncrement: 2.5 },
          { id: 'overhead-ext', name: 'Overhead Extension', muscle: 'Triceps', sets: 3, repsTarget: 12, weightIncrement: 2.5 },
        ],
      },
      {
        name: 'Pull Day',
        focus: 'Back · Biceps · Rear Delts',
        exercises: [
          { id: 'deadlift', name: 'Deadlift', muscle: 'Back', sets: 4, repsTarget: 5, weightIncrement: 5 },
          { id: 'barbell-row', name: 'Barbell Row', muscle: 'Back', sets: 4, repsTarget: 8, weightIncrement: 2.5 },
          { id: 'lat-pd', name: 'Lat Pulldown', muscle: 'Lats', sets: 3, repsTarget: 10, weightIncrement: 2.5 },
          { id: 'face-pull', name: 'Face Pull', muscle: 'Rear Delts', sets: 3, repsTarget: 15, weightIncrement: 2.5 },
          { id: 'bicep-curl', name: 'Barbell Curl', muscle: 'Biceps', sets: 3, repsTarget: 10, weightIncrement: 2.5 },
          { id: 'hammer-curl', name: 'Hammer Curl', muscle: 'Brachialis', sets: 3, repsTarget: 12, weightIncrement: 2 },
        ],
      },
      {
        name: 'Legs Day',
        focus: 'Quads · Hamstrings · Glutes · Calves',
        exercises: [
          { id: 'squat', name: 'Back Squat', muscle: 'Quads', sets: 4, repsTarget: 6, weightIncrement: 2.5 },
          { id: 'leg-press', name: 'Leg Press', muscle: 'Quads', sets: 4, repsTarget: 10, weightIncrement: 5 },
          { id: 'rdl', name: 'Romanian Deadlift', muscle: 'Hamstrings', sets: 3, repsTarget: 10, weightIncrement: 2.5 },
          { id: 'leg-curl', name: 'Leg Curl', muscle: 'Hamstrings', sets: 3, repsTarget: 12, weightIncrement: 2.5 },
          { id: 'hip-thrust', name: 'Hip Thrust', muscle: 'Glutes', sets: 3, repsTarget: 12, weightIncrement: 5 },
          { id: 'calf-raise', name: 'Standing Calf Raise', muscle: 'Calves', sets: 4, repsTarget: 15, weightIncrement: 2.5 },
        ],
      },
    ],
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower Split',
    days: [
      {
        name: 'Upper A',
        focus: 'Chest · Back · Shoulders (Strength)',
        exercises: [
          { id: 'bench-a', name: 'Bench Press', muscle: 'Chest', sets: 4, repsTarget: 5, weightIncrement: 2.5 },
          { id: 'pendlay-row', name: 'Pendlay Row', muscle: 'Back', sets: 4, repsTarget: 5, weightIncrement: 2.5 },
          { id: 'ohp-a', name: 'Overhead Press', muscle: 'Shoulders', sets: 3, repsTarget: 8, weightIncrement: 2.5 },
          { id: 'pullup-a', name: 'Pull-up / Lat Pulldown', muscle: 'Lats', sets: 3, repsTarget: 8, weightIncrement: 2.5 },
          { id: 'curl-a', name: 'EZ Bar Curl', muscle: 'Biceps', sets: 2, repsTarget: 12, weightIncrement: 2.5 },
          { id: 'skullcrusher', name: 'Skull Crusher', muscle: 'Triceps', sets: 2, repsTarget: 12, weightIncrement: 2.5 },
        ],
      },
      {
        name: 'Lower A',
        focus: 'Quads · Posterior Chain (Strength)',
        exercises: [
          { id: 'squat-a', name: 'Back Squat', muscle: 'Quads', sets: 4, repsTarget: 5, weightIncrement: 2.5 },
          { id: 'rdl-a', name: 'Romanian Deadlift', muscle: 'Hamstrings', sets: 3, repsTarget: 8, weightIncrement: 2.5 },
          { id: 'leg-press-a', name: 'Leg Press', muscle: 'Quads', sets: 3, repsTarget: 10, weightIncrement: 5 },
          { id: 'leg-curl-a', name: 'Seated Leg Curl', muscle: 'Hamstrings', sets: 3, repsTarget: 12, weightIncrement: 2.5 },
          { id: 'calf-a', name: 'Calf Raise', muscle: 'Calves', sets: 4, repsTarget: 15, weightIncrement: 2.5 },
        ],
      },
      {
        name: 'Upper B',
        focus: 'Chest · Back · Shoulders (Hypertrophy)',
        exercises: [
          { id: 'incline-b', name: 'Incline Bench Press', muscle: 'Chest', sets: 4, repsTarget: 10, weightIncrement: 2.5 },
          { id: 'db-row-b', name: 'DB Row', muscle: 'Back', sets: 4, repsTarget: 10, weightIncrement: 2 },
          { id: 'lat-raise-b', name: 'Lateral Raise', muscle: 'Delts', sets: 3, repsTarget: 15, weightIncrement: 1 },
          { id: 'cable-fly-b', name: 'Cable Fly', muscle: 'Chest', sets: 3, repsTarget: 15, weightIncrement: 2.5 },
          { id: 'face-pull-b', name: 'Face Pull', muscle: 'Rear Delts', sets: 3, repsTarget: 20, weightIncrement: 2.5 },
          { id: 'hammer-b', name: 'Hammer Curl', muscle: 'Biceps', sets: 3, repsTarget: 12, weightIncrement: 2 },
        ],
      },
      {
        name: 'Lower B',
        focus: 'Quads · Glutes (Hypertrophy)',
        exercises: [
          { id: 'front-squat-b', name: 'Front Squat', muscle: 'Quads', sets: 4, repsTarget: 8, weightIncrement: 2.5 },
          { id: 'hip-thrust-b', name: 'Hip Thrust', muscle: 'Glutes', sets: 4, repsTarget: 12, weightIncrement: 5 },
          { id: 'lunges-b', name: 'Walking Lunges', muscle: 'Quads/Glutes', sets: 3, repsTarget: 12, weightIncrement: 2 },
          { id: 'leg-ext-b', name: 'Leg Extension', muscle: 'Quads', sets: 3, repsTarget: 15, weightIncrement: 2.5 },
          { id: 'leg-curl-b', name: 'Lying Leg Curl', muscle: 'Hamstrings', sets: 3, repsTarget: 12, weightIncrement: 2.5 },
        ],
      },
    ],
  },
  {
    id: 'fullbody',
    name: 'Full Body 3×/Week',
    days: [
      {
        name: 'Full Body A',
        focus: 'Strength Focus',
        exercises: [
          { id: 'squat-fb', name: 'Back Squat', muscle: 'Quads', sets: 3, repsTarget: 5, weightIncrement: 2.5 },
          { id: 'bench-fb', name: 'Bench Press', muscle: 'Chest', sets: 3, repsTarget: 5, weightIncrement: 2.5 },
          { id: 'row-fb', name: 'Barbell Row', muscle: 'Back', sets: 3, repsTarget: 5, weightIncrement: 2.5 },
          { id: 'ohp-fb', name: 'Overhead Press', muscle: 'Shoulders', sets: 2, repsTarget: 8, weightIncrement: 2.5 },
          { id: 'deadlift-fb', name: 'Deadlift', muscle: 'Back', sets: 1, repsTarget: 5, weightIncrement: 5 },
        ],
      },
      {
        name: 'Full Body B',
        focus: 'Hypertrophy Focus',
        exercises: [
          { id: 'front-squat-fb', name: 'Front Squat', muscle: 'Quads', sets: 3, repsTarget: 8, weightIncrement: 2.5 },
          { id: 'incline-fb', name: 'Incline Press', muscle: 'Chest', sets: 3, repsTarget: 10, weightIncrement: 2.5 },
          { id: 'lat-pd-fb', name: 'Lat Pulldown', muscle: 'Back', sets: 3, repsTarget: 10, weightIncrement: 2.5 },
          { id: 'lateral-fb', name: 'Lateral Raise', muscle: 'Delts', sets: 3, repsTarget: 15, weightIncrement: 1 },
          { id: 'rdl-fb', name: 'Romanian Deadlift', muscle: 'Hamstrings', sets: 3, repsTarget: 10, weightIncrement: 2.5 },
        ],
      },
    ],
  },
];
