export const predefinedPlans = [
  {
    id: '1',
    title: 'Upper Body Beginner',
    difficulty: 'beginner',
    duration: '30 minutes',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 12, rest: '60s' },
      { name: 'Shoulder Taps', sets: 3, reps: 10, rest: '45s' },
      { name: 'Plank', sets: 3, reps: '30 sec', rest: '30s' },
      { name: 'Tricep Dips', sets: 3, reps: 10, rest: '45s' },
    ],
  },
  {
    id: '2',
    title: 'Lower Body Strength',
    difficulty: 'intermediate',
    duration: '45 minutes',
    exercises: [
      { name: 'Squats', sets: 4, reps: 12, rest: '60s' },
      { name: 'Lunges', sets: 3, reps: 10, rest: '45s' },
      { name: 'Glute Bridges', sets: 3, reps: 15, rest: '30s' },
      { name: 'Calf Raises', sets: 3, reps: 20, rest: '30s' },
    ],
  },
  {
    id: '3',
    title: 'Full Body HIIT',
    difficulty: 'advanced',
    duration: '25 minutes',
    exercises: [
      { name: 'Burpees', sets: 4, reps: 10, rest: '30s' },
      { name: 'Mountain Climbers', sets: 4, reps: '30 sec', rest: '20s' },
      { name: 'Jump Squats', sets: 3, reps: 15, rest: '30s' },
      { name: 'Push-ups', sets: 3, reps: 12, rest: '30s' },
    ],
  },
];