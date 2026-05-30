export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Goal = 'loseWeight' | 'buildMuscle' | 'maintain' | 'improveSkills';
export type WorkoutType = 'calisthenics' | 'gym' | 'both';
export type SkillCategory = 'push' | 'pull' | 'core' | 'legs' | 'handstand';

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  workoutType: WorkoutType;
}

export interface SkillLevel {
  level: number;
  name: string;
  description: string;
  criteria: string;
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface CalisthenicSkill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string;
  levels: SkillLevel[];
}

export interface GymSet {
  reps: number;
  weight: number;
}

export interface GymExercise {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  repsTarget: number;
  weightIncrement: number;
}

export interface GymProgram {
  id: string;
  name: string;
  days: GymDay[];
}

export interface GymDay {
  name: string;
  focus: string;
  exercises: GymExercise[];
}

export interface WorkoutLogEntry {
  date: string;
  type: 'calisthenics' | 'gym';
  completed: boolean;
}

export interface GymProgress {
  [exerciseId: string]: GymSet[];
}

export interface CalisthenicProgress {
  [skillId: string]: number; // current level index
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface FoodItem {
  name: string;
  portion: string;
  cal: number;
  p: number; // protein g
  c: number; // carbs g
  f: number; // fat g
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  icon: string;
  foods: FoodItem[];
}

export interface LoggedFoodItem extends FoodItem {
  id: string;
  mealId: string;
  timestamp: string;
}

export interface SessionExercise {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  hasWeight: boolean;
  formTips: string[];
}
