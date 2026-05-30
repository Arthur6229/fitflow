import type { UserProfile } from '../types';

export function calcBMI(weight: number, height: number): number {
  const h = height / 100;
  return Math.round((weight / (h * h)) * 10) / 10;
}

export function bmiCategory(bmi: number): { label: string; color: string; bg: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', bg: '#eff6ff' };
  if (bmi < 25)   return { label: 'Normal', color: '#10b981', bg: '#ecfdf5' };
  if (bmi < 30)   return { label: 'Overweight', color: '#f59e0b', bg: '#fffbeb' };
  return              { label: 'Obese', color: '#ef4444', bg: '#fef2f2' };
}

export function calcBMR(p: UserProfile): number {
  // Mifflin-St Jeor
  const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
  return p.gender === 'male' ? base + 5 : base - 161;
}

const activityMult: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export function calcTDEE(p: UserProfile): number {
  return Math.round(calcBMR(p) * activityMult[p.activityLevel]);
}

export function calcTargetCalories(p: UserProfile): number {
  const tdee = calcTDEE(p);
  if (p.goal === 'loseWeight') return tdee - 500;
  if (p.goal === 'buildMuscle') return tdee + 300;
  return tdee;
}

export function calcMacros(calories: number, goal: string): { protein: number; carbs: number; fat: number } {
  // protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g
  const splits: Record<string, [number, number, number]> = {
    loseWeight:     [0.40, 0.30, 0.30],
    buildMuscle:    [0.30, 0.45, 0.25],
    maintain:       [0.30, 0.40, 0.30],
    improveSkills:  [0.35, 0.40, 0.25],
  };
  const [pp, pc, pf] = splits[goal] || splits.maintain;
  return {
    protein: Math.round((calories * pp) / 4),
    carbs:   Math.round((calories * pc) / 4),
    fat:     Math.round((calories * pf) / 9),
  };
}

export function bmiProgressPct(bmi: number): number {
  // Maps BMI 10-40 to 0-100%
  return Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100));
}

export function goalLabel(goal: string): string {
  return {
    loseWeight: 'Lose Weight',
    buildMuscle: 'Build Muscle',
    maintain: 'Maintain Weight',
    improveSkills: 'Improve Skills',
  }[goal] ?? goal;
}

export function activityLabel(level: string): string {
  return {
    sedentary: 'Sedentary',
    light: 'Lightly Active',
    moderate: 'Moderately Active',
    active: 'Very Active',
    veryActive: 'Extremely Active',
  }[level] ?? level;
}
