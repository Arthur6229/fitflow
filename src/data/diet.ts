import type { Meal } from '../types';

const loseMeals: Meal[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    time: '7:30 AM',
    icon: '🍳',
    foods: [
      { name: 'Egg whites (5)', portion: '170g', cal: 89, p: 19, c: 1, f: 0 },
      { name: 'Whole egg (1)', portion: '50g', cal: 72, p: 6, c: 0, f: 5 },
      { name: 'Oatmeal (dry)', portion: '40g', cal: 148, p: 5, c: 27, f: 3 },
      { name: 'Blueberries', portion: '80g', cal: 46, p: 1, c: 11, f: 0 },
    ],
  },
  {
    id: 'lunch',
    name: 'Lunch',
    time: '12:30 PM',
    icon: '🥗',
    foods: [
      { name: 'Chicken breast', portion: '180g', cal: 297, p: 56, c: 0, f: 6 },
      { name: 'Brown rice (cooked)', portion: '150g', cal: 165, p: 4, c: 34, f: 1 },
      { name: 'Mixed greens', portion: '100g', cal: 20, p: 2, c: 3, f: 0 },
      { name: 'Olive oil (1 tsp)', portion: '5ml', cal: 40, p: 0, c: 0, f: 5 },
    ],
  },
  {
    id: 'snack',
    name: 'Snack',
    time: '4:00 PM',
    icon: '🍎',
    foods: [
      { name: 'Greek yogurt (0%)', portion: '170g', cal: 90, p: 17, c: 6, f: 0 },
      { name: 'Apple', portion: '150g', cal: 78, p: 0, c: 21, f: 0 },
    ],
  },
  {
    id: 'dinner',
    name: 'Dinner',
    time: '7:30 PM',
    icon: '🍽️',
    foods: [
      { name: 'Salmon fillet', portion: '150g', cal: 280, p: 39, c: 0, f: 13 },
      { name: 'Sweet potato', portion: '150g', cal: 129, p: 2, c: 30, f: 0 },
      { name: 'Broccoli (steamed)', portion: '150g', cal: 52, p: 4, c: 10, f: 1 },
    ],
  },
];

const buildMeals: Meal[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    time: '7:30 AM',
    icon: '🍳',
    foods: [
      { name: 'Whole eggs (3)', portion: '150g', cal: 216, p: 18, c: 2, f: 15 },
      { name: 'Oatmeal (dry)', portion: '80g', cal: 296, p: 10, c: 53, f: 5 },
      { name: 'Banana', portion: '120g', cal: 107, p: 1, c: 28, f: 0 },
      { name: 'Whole milk (250ml)', portion: '250ml', cal: 150, p: 8, c: 12, f: 8 },
    ],
  },
  {
    id: 'lunch',
    name: 'Lunch',
    time: '12:30 PM',
    icon: '🥗',
    foods: [
      { name: 'Chicken thigh (grilled)', portion: '200g', cal: 294, p: 42, c: 0, f: 13 },
      { name: 'White rice (cooked)', portion: '250g', cal: 325, p: 6, c: 72, f: 1 },
      { name: 'Avocado (½)', portion: '75g', cal: 120, p: 1, c: 6, f: 11 },
    ],
  },
  {
    id: 'preworkout',
    name: 'Pre-Workout',
    time: '4:00 PM',
    icon: '⚡',
    foods: [
      { name: 'Whey protein', portion: '30g', cal: 120, p: 24, c: 4, f: 2 },
      { name: 'Banana', portion: '120g', cal: 107, p: 1, c: 28, f: 0 },
      { name: 'Rice cakes (2)', portion: '18g', cal: 70, p: 1, c: 15, f: 0 },
    ],
  },
  {
    id: 'dinner',
    name: 'Dinner',
    time: '7:30 PM',
    icon: '🍽️',
    foods: [
      { name: 'Lean beef mince', portion: '200g', cal: 360, p: 44, c: 0, f: 20 },
      { name: 'Pasta (dry)', portion: '100g', cal: 350, p: 13, c: 71, f: 2 },
      { name: 'Tomato sauce', portion: '100g', cal: 35, p: 1, c: 8, f: 0 },
    ],
  },
];

const maintainMeals: Meal[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    time: '8:00 AM',
    icon: '🍳',
    foods: [
      { name: 'Scrambled eggs (3)', portion: '150g', cal: 230, p: 18, c: 2, f: 16 },
      { name: 'Whole grain toast (2)', portion: '56g', cal: 140, p: 7, c: 24, f: 2 },
      { name: 'Orange juice', portion: '200ml', cal: 88, p: 1, c: 21, f: 0 },
    ],
  },
  {
    id: 'lunch',
    name: 'Lunch',
    time: '1:00 PM',
    icon: '🥗',
    foods: [
      { name: 'Turkey sandwich', portion: '200g', cal: 350, p: 28, c: 35, f: 10 },
      { name: 'Mixed salad', portion: '100g', cal: 30, p: 2, c: 5, f: 1 },
      { name: 'Apple', portion: '150g', cal: 78, p: 0, c: 21, f: 0 },
    ],
  },
  {
    id: 'snack',
    name: 'Snack',
    time: '4:00 PM',
    icon: '🍎',
    foods: [
      { name: 'Mixed nuts (30g)', portion: '30g', cal: 185, p: 5, c: 6, f: 16 },
      { name: 'Cottage cheese', portion: '100g', cal: 84, p: 11, c: 3, f: 4 },
    ],
  },
  {
    id: 'dinner',
    name: 'Dinner',
    time: '7:00 PM',
    icon: '🍽️',
    foods: [
      { name: 'Grilled chicken', portion: '150g', cal: 247, p: 47, c: 0, f: 5 },
      { name: 'Roasted vegetables', portion: '200g', cal: 110, p: 4, c: 20, f: 3 },
      { name: 'Quinoa (cooked)', portion: '150g', cal: 174, p: 6, c: 30, f: 3 },
    ],
  },
];

export function getMealPlanForGoal(goal: string): Meal[] {
  if (goal === 'loseWeight') return loseMeals;
  if (goal === 'buildMuscle') return buildMeals;
  return maintainMeals;
}
