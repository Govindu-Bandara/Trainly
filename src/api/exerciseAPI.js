import axios from 'axios';

const API_KEY = 'kTW8PL523ZHeNV6TEHCnHg==rlXCTmz8fNKK3FLo';
const BASE_URL = 'https://api.api-ninjas.com/v1/exercises';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
  timeout: 10000,
});

export const exerciseAPI = {
  getExercisesByEquipment: async (muscle, difficulty, equipmentType) => {
    try {
      console.log(`Creating workout sets for ${muscle}, ${difficulty}, ${equipmentType}`);
      
      const exercises = getExercisesForWorkout(muscle, difficulty, equipmentType);
      
      console.log(`Found ${exercises.length} exercises for ${muscle} ${difficulty} ${equipmentType}`);
      
      return createMultipleWorkoutSets(exercises, difficulty, equipmentType, muscle);
    } catch (error) {
      console.error('Error creating workout sets:', error);
      const fallbackExercises = getExercisesForWorkout(muscle, difficulty, equipmentType);
      return createMultipleWorkoutSets(fallbackExercises, difficulty, equipmentType, muscle);
    }
  },

  getTopPicks: async () => {
    try {
      const allExercises = getAllExercises();
      
      // Create diverse workout sets for top picks
      const workoutSets = [];
      const timestamp = Date.now(); // Single timestamp for all top picks
      
      // Full Body Workout
      const fullBodyExercises = allExercises
        .filter(ex => ['chest', 'legs', 'core'].includes(ex.muscle))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
      if (fullBodyExercises.length >= 3) {
        const fullBodyWorkout = {
          id: `top-pick-full-${timestamp}-1`,
          exercises: fullBodyExercises.map((ex, index) => createWorkoutExercise(ex, getSetsConfig('beginner'), true, index + 1, timestamp + 1)),
          totalExercises: fullBodyExercises.length,
          estimatedTime: calculateRealEstimatedTime(fullBodyExercises.map((ex, index) => createWorkoutExercise(ex, getSetsConfig('beginner'), true, index + 1, timestamp + 1)), true, getSetsConfig('beginner')),
          isBodyweight: true,
          muscle: 'full',
          difficulty: 'beginner',
          equipmentType: 'without',
          setName: 'Full Body Energizer',
          setDescription: 'Perfect starter workout for all fitness levels',
          setFocus: 'balanced',
          isTopPick: true
        };
        workoutSets.push(fullBodyWorkout);
      }
      
      // Upper Body Workout
      const upperBodyExercises = allExercises
        .filter(ex => ['chest', 'back', 'shoulders', 'arms'].includes(ex.muscle))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
      if (upperBodyExercises.length >= 3) {
        const upperBodyWorkout = {
          id: `top-pick-upper-${timestamp}-2`,
          exercises: upperBodyExercises.map((ex, index) => createWorkoutExercise(ex, getSetsConfig('intermediate'), true, index + 1, timestamp + 2)),
          totalExercises: upperBodyExercises.length,
          estimatedTime: calculateRealEstimatedTime(upperBodyExercises.map((ex, index) => createWorkoutExercise(ex, getSetsConfig('intermediate'), true, index + 1, timestamp + 2)), true, getSetsConfig('intermediate')),
          isBodyweight: true,
          muscle: 'upper',
          difficulty: 'intermediate',
          equipmentType: 'without',
          setName: 'Upper Body Strength',
          setDescription: 'Build upper body power with bodyweight exercises',
          setFocus: 'strength',
          isTopPick: true
        };
        workoutSets.push(upperBodyWorkout);
      }
      
      // Core Workout
      const coreExercises = allExercises
        .filter(ex => ex.muscle === 'core')
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
      if (coreExercises.length >= 3) {
        const coreWorkout = {
          id: `top-pick-core-${timestamp}-3`,
          exercises: coreExercises.map((ex, index) => createWorkoutExercise(ex, getSetsConfig('intermediate'), true, index + 1, timestamp + 3)),
          totalExercises: coreExercises.length,
          estimatedTime: calculateRealEstimatedTime(coreExercises.map((ex, index) => createWorkoutExercise(ex, getSetsConfig('intermediate'), true, index + 1, timestamp + 3)), true, getSetsConfig('intermediate')),
          isBodyweight: true,
          muscle: 'core',
          difficulty: 'intermediate',
          equipmentType: 'without',
          setName: 'Core Crusher',
          setDescription: 'Strengthen your core with targeted exercises',
          setFocus: 'endurance',
          isTopPick: true
        };
        workoutSets.push(coreWorkout);
      }
      
      return workoutSets;
    } catch (error) {
      console.error('Error getting top picks:', error);
      return getFallbackTopPicks();
    }
  }
};

const getFallbackTopPicks = () => {
  const timestamp = Date.now();
  return [
    {
      id: `top-pick-1-${timestamp}`,
      setName: 'Full Body Blast',
      exercises: [
        { 
          id: `fb-1-${timestamp}`, 
          name: 'Push-ups', 
          type: 'strength', 
          muscle: 'chest', 
          equipment: 'bodyweight', 
          difficulty: 'beginner',
          sets: 3, 
          reps: '12-15',
          rest: '60s',
          duration: null,
          isBodyweight: true,
          instructions: 'Start in plank position, lower body until chest nearly touches floor, then push back up.'
        },
        { 
          id: `fb-2-${timestamp}`, 
          name: 'Bodyweight Squats', 
          type: 'strength', 
          muscle: 'legs', 
          equipment: 'bodyweight', 
          difficulty: 'beginner',
          sets: 3, 
          reps: '15-20',
          rest: '60s',
          duration: null,
          isBodyweight: true,
          instructions: 'Stand with feet shoulder-width apart, lower as if sitting in a chair, then return to standing.'
        },
        { 
          id: `fb-3-${timestamp}`, 
          name: 'Plank', 
          type: 'strength', 
          muscle: 'core', 
          equipment: 'bodyweight', 
          difficulty: 'beginner',
          sets: 3, 
          reps: '30s',
          rest: '45s',
          duration: 30,
          isBodyweight: true,
          instructions: 'Hold body in straight line from head to heels, engaging core muscles.'
        },
        { 
          id: `fb-4-${timestamp}`, 
          name: 'Lunges', 
          type: 'strength', 
          muscle: 'legs', 
          equipment: 'bodyweight', 
          difficulty: 'beginner',
          sets: 3, 
          reps: '10-12',
          rest: '60s',
          duration: null,
          isBodyweight: true,
          instructions: 'Step forward with one leg, lower until both knees are bent at 90 degrees, then return.'
        }
      ],
      totalExercises: 4,
      estimatedTime: 20,
      isBodyweight: true,
      muscle: 'full',
      difficulty: 'beginner',
      equipmentType: 'without',
      setDescription: 'Perfect starter workout for all fitness levels',
      setFocus: 'balanced',
      isTopPick: true
    },
    {
      id: `top-pick-2-${timestamp + 1}`,
      setName: 'Upper Body Strength',
      exercises: [
        { 
          id: `ub-1-${timestamp + 1}`, 
          name: 'Push-ups', 
          type: 'strength', 
          muscle: 'chest', 
          equipment: 'bodyweight', 
          difficulty: 'intermediate',
          sets: 4, 
          reps: '8-12',
          rest: '75s',
          duration: null,
          isBodyweight: true,
          instructions: 'Start in plank position, lower body until chest nearly touches floor, then push back up.'
        },
        { 
          id: `ub-2-${timestamp + 1}`, 
          name: 'Tricep Dips', 
          type: 'strength', 
          muscle: 'arms', 
          equipment: 'bodyweight', 
          difficulty: 'intermediate',
          sets: 3, 
          reps: '10-15',
          rest: '75s',
          duration: null,
          isBodyweight: true,
          instructions: 'Use parallel bars or chair, lower body by bending elbows, then push back up.'
        },
        { 
          id: `ub-3-${timestamp + 1}`, 
          name: 'Plank', 
          type: 'strength', 
          muscle: 'core', 
          equipment: 'bodyweight', 
          difficulty: 'intermediate',
          sets: 3, 
          reps: '45s',
          rest: '60s',
          duration: 45,
          isBodyweight: true,
          instructions: 'Hold body in straight line from head to heels, engaging core muscles.'
        },
        { 
          id: `ub-4-${timestamp + 1}`, 
          name: 'Shoulder Taps', 
          type: 'strength', 
          muscle: 'shoulders', 
          equipment: 'bodyweight', 
          difficulty: 'intermediate',
          sets: 3, 
          reps: '20',
          rest: '60s',
          duration: null,
          isBodyweight: true,
          instructions: 'In plank position, tap opposite shoulder with hand while maintaining stability.'
        }
      ],
      totalExercises: 4,
      estimatedTime: 25,
      isBodyweight: true,
      muscle: 'upper',
      difficulty: 'intermediate',
      equipmentType: 'without',
      setDescription: 'Build upper body power with bodyweight exercises',
      setFocus: 'strength',
      isTopPick: true
    },
    {
      id: `top-pick-3-${timestamp + 2}`,
      setName: 'Core Crusher',
      exercises: [
        { 
          id: `core-1-${timestamp + 2}`, 
          name: 'Plank', 
          type: 'strength', 
          muscle: 'core', 
          equipment: 'bodyweight', 
          difficulty: 'intermediate',
          sets: 3, 
          reps: '45s',
          rest: '60s',
          duration: 45,
          isBodyweight: true,
          instructions: 'Hold body in straight line from head to heels, engaging core muscles.'
        },
        { 
          id: `core-2-${timestamp + 2}`, 
          name: 'Russian Twists', 
          type: 'strength', 
          muscle: 'core', 
          equipment: 'bodyweight', 
          difficulty: 'intermediate',
          sets: 3, 
          reps: '20',
          rest: '60s',
          duration: null,
          isBodyweight: true,
          instructions: 'Sit with knees bent, lean back slightly, twist torso from side to side.'
        },
        { 
          id: `core-3-${timestamp + 2}`, 
          name: 'Leg Raises', 
          type: 'strength', 
          muscle: 'core', 
          equipment: 'bodyweight', 
          difficulty: 'intermediate',
          sets: 3, 
          reps: '15',
          rest: '60s',
          duration: null,
          isBodyweight: true,
          instructions: 'Lie on back, raise legs to vertical position, then lower with control.'
        },
        { 
          id: `core-4-${timestamp + 2}`, 
          name: 'Mountain Climbers', 
          type: 'strength', 
          muscle: 'core', 
          equipment: 'bodyweight', 
          difficulty: 'intermediate',
          sets: 3, 
          reps: '30s',
          rest: '60s',
          duration: 30,
          isBodyweight: true,
          instructions: 'In plank position, bring knees to chest in running motion.'
        }
      ],
      totalExercises: 4,
      estimatedTime: 18,
      isBodyweight: true,
      muscle: 'core',
      difficulty: 'intermediate',
      equipmentType: 'without',
      setDescription: 'Strengthen your core with targeted exercises',
      setFocus: 'endurance',
      isTopPick: true
    }
  ];
};

const getExercisesForWorkout = (muscle, difficulty, equipmentType) => {
  const isBodyweight = equipmentType === 'without';
  
  const muscleMap = {
    'chest': 'chest',
    'back': 'back', 
    'legs': 'legs',
    'shoulders': 'shoulders',
    'biceps': 'arms',
    'triceps': 'arms',
    'arms': 'arms',
    'core': 'core',
    'abdominals': 'core',
    'abs': 'core'
  };
  
  const targetMuscle = muscleMap[muscle] || muscle;
  
  let exercises = getAllExercises().filter(ex => 
    ex.muscle.toLowerCase() === targetMuscle.toLowerCase()
  );
  
  if (isBodyweight) {
    exercises = exercises.filter(ex => isBodyweightExercise(ex.equipment));
  } else {
    exercises = exercises.filter(ex => !isBodyweightExercise(ex.equipment));
  }
  
  if (exercises.length < 8) {
    const complementaryExercises = getComplementaryExercises(targetMuscle, isBodyweight);
    exercises = [...exercises, ...complementaryExercises];
    
    exercises = exercises.filter((ex, index, self) => 
      index === self.findIndex(e => e.name === ex.name)
    );
  }
  
  return exercises;
};

const getComplementaryExercises = (muscle, isBodyweight) => {
  const complementaryMap = {
    'chest': ['shoulders', 'arms'],
    'back': ['shoulders', 'arms'], 
    'legs': ['core'],
    'shoulders': ['chest', 'arms'],
    'arms': ['chest', 'shoulders'],
    'core': ['legs']
  };
  
  const complementaryMuscles = complementaryMap[muscle] || ['chest', 'back'];
  let complementaryExercises = [];
  
  complementaryMuscles.forEach(compMuscle => {
    const exercises = getAllExercises().filter(ex => 
      ex.muscle.toLowerCase() === compMuscle.toLowerCase() &&
      (isBodyweight ? isBodyweightExercise(ex.equipment) : !isBodyweightExercise(ex.equipment))
    );
    complementaryExercises.push(...exercises.slice(0, 3));
  });
  
  return complementaryExercises;
};

const createMultipleWorkoutSets = (allExercises, difficulty, equipmentType, muscle) => {
  const isBodyweight = equipmentType === 'without';
  const config = getSetsConfig(difficulty);

  const workoutSets = [];
  
  let availableExercises = [...allExercises];
  if (availableExercises.length < 8) {
    const genericExercises = getGenericExercises(isBodyweight);
    availableExercises = [...availableExercises, ...genericExercises];
    
    availableExercises = availableExercises.filter((ex, index, self) => 
      index === self.findIndex(e => e.name === ex.name)
    );
  }
  
  const setTypes = [
    { name: 'Strength Focus', focus: 'strength', description: 'Focus on heavy weights and lower reps' },
    { name: 'Endurance Builder', focus: 'endurance', description: 'Higher reps for muscular endurance' },
    { name: 'Power Development', focus: 'power', description: 'Explosive movements for power' }
  ];

  // Create a unique timestamp for this batch of workout sets
  const batchTimestamp = Date.now();

  for (let i = 0; i < 3; i++) {
    const workoutExercises = [];
    const setType = setTypes[i];
    
    // Create a unique set of exercises for each workout
    const usedExerciseNames = new Set();
    
    // Always include primary muscle exercises first
    const primaryExercises = availableExercises.filter(ex => 
      (ex.muscle.toLowerCase() === muscle.toLowerCase() ||
       ex.muscle.toLowerCase() === mapMuscleGroup(muscle)) &&
      !usedExerciseNames.has(ex.name)
    );
    
    // Take 2-3 primary exercises
    const primaryCount = Math.min(primaryExercises.length, 3);
    for (let p = 0; p < primaryCount; p++) {
      const primaryEx = primaryExercises[p];
      if (primaryEx) {
        workoutExercises.push(createWorkoutExercise(primaryEx, config, isBodyweight, workoutExercises.length + 1, batchTimestamp + i));
        usedExerciseNames.add(primaryEx.name);
      }
    }
    
    // Fill remaining slots with complementary exercises
    let exerciseNumber = workoutExercises.length + 1;
    for (let j = 0; j < availableExercises.length && workoutExercises.length < 5; j++) {
      const exIndex = (i * 4 + j) % availableExercises.length;
      const ex = availableExercises[exIndex];
      
      if (ex && !usedExerciseNames.has(ex.name)) {
        workoutExercises.push(createWorkoutExercise(ex, config, isBodyweight, exerciseNumber, batchTimestamp + i + j));
        usedExerciseNames.add(ex.name);
        exerciseNumber++;
      }
    }
    
    // Ensure minimum of 3 exercises
    while (workoutExercises.length < 3) {
      const fallbackEx = getFallbackExercise(muscle, isBodyweight, workoutExercises.length + 1, batchTimestamp + i + workoutExercises.length);
      if (fallbackEx && !usedExerciseNames.has(fallbackEx.name)) {
        workoutExercises.push(createWorkoutExercise(fallbackEx, config, isBodyweight, workoutExercises.length + 1, batchTimestamp + i + workoutExercises.length));
        usedExerciseNames.add(fallbackEx.name);
      } else {
        break;
      }
    }
    
    if (workoutExercises.length >= 3) {
      // Create unique ID with timestamp and index
      const uniqueId = `workout-${muscle}-${difficulty}-${equipmentType}-${i}-${batchTimestamp}`;
      
      workoutSets.push({
        id: uniqueId,
        exercises: workoutExercises,
        totalExercises: workoutExercises.length,
        estimatedTime: calculateRealEstimatedTime(workoutExercises, isBodyweight, config),
        isBodyweight: isBodyweight,
        muscle: muscle,
        difficulty: difficulty,
        equipmentType: equipmentType,
        config: config,
        setName: setType.name,
        setDescription: setType.description,
        setFocus: setType.focus,
        createdAt: new Date().toISOString()
      });
    }
  }
  
  return workoutSets;
};

const createWorkoutExercise = (exercise, config, isBodyweight, order, timestamp) => {
  // Create unique exercise ID with timestamp to prevent duplicates
  const uniqueId = `${exercise.id || exercise.name}-${order}-${timestamp}`;
  
  return {
    ...exercise,
    id: uniqueId,
    sets: config.sets,
    reps: isBodyweight ? `${config.exerciseDuration}s` : config.reps,
    rest: `${config.rest}s`,
    duration: isBodyweight ? config.exerciseDuration : null,
    isBodyweight: isBodyweight,
    restBetweenExercises: config.restBetweenExercises,
    estimatedTimePerSet: isBodyweight ? config.exerciseDuration : 45,
    order: order,
    instructions: exercise.instructions || getDefaultInstructions(exercise.name, exercise.muscle)
  };
};

const getSetsConfig = (difficulty) => {
  const configs = {
    beginner: { 
      sets: 3, 
      reps: '10-12', 
      rest: 60,
      exerciseDuration: 30,
      restBetweenExercises: 45
    },
    intermediate: { 
      sets: 4, 
      reps: '8-10', 
      rest: 75,
      exerciseDuration: 45,
      restBetweenExercises: 60
    },
    advanced: { 
      sets: 4, 
      reps: '6-8', 
      rest: 90,
      exerciseDuration: 60,
      restBetweenExercises: 75
    }
  };
  return configs[difficulty] || configs.beginner;
};

const calculateRealEstimatedTime = (exercises, isBodyweight, config) => {
  if (!exercises || exercises.length === 0) return 20;
  
  let totalSeconds = 0;
  
  exercises.forEach(exercise => {
    const sets = exercise.sets || config.sets;
    const restTime = parseInt(exercise.rest) || config.rest;
    
    if (isBodyweight) {
      const exerciseDuration = exercise.duration || config.exerciseDuration;
      totalSeconds += (exerciseDuration + restTime) * sets;
    } else {
      const timePerSet = exercise.estimatedTimePerSet || 45;
      totalSeconds += (timePerSet + restTime) * sets;
    }
  });
  
  if (exercises.length > 1) {
    totalSeconds += exercises.slice(0, -1).reduce((total, ex) => 
      total + (ex.restBetweenExercises || config.restBetweenExercises), 0
    );
  }
  
  return Math.max(Math.ceil(totalSeconds / 60), 15);
};

const getAllExercises = () => {
  return [
    { id: 'c1', name: 'Push-ups', type: 'strength', muscle: 'chest', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'c2', name: 'Wide Push-ups', type: 'strength', muscle: 'chest', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'c3', name: 'Decline Push-ups', type: 'strength', muscle: 'chest', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'c4', name: 'Incline Push-ups', type: 'strength', muscle: 'chest', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'c5', name: 'Plyo Push-ups', type: 'strength', muscle: 'chest', equipment: 'bodyweight', difficulty: 'advanced' },
    { id: 'c6', name: 'Diamond Push-ups', type: 'strength', muscle: 'chest', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'c7', name: 'Bench Press', type: 'strength', muscle: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
    { id: 'c8', name: 'Incline Bench Press', type: 'strength', muscle: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
    { id: 'c9', name: 'Dumbbell Press', type: 'strength', muscle: 'chest', equipment: 'dumbbell', difficulty: 'beginner' },
    { id: 'c10', name: 'Cable Crossovers', type: 'strength', muscle: 'chest', equipment: 'cable', difficulty: 'intermediate' },
    { id: 'c11', name: 'Chest Fly Machine', type: 'strength', muscle: 'chest', equipment: 'machine', difficulty: 'beginner' },
    { id: 'c12', name: 'Pec Deck', type: 'strength', muscle: 'chest', equipment: 'machine', difficulty: 'beginner' },
    { id: 'b1', name: 'Pull-ups', type: 'strength', muscle: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'b2', name: 'Chin-ups', type: 'strength', muscle: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'b3', name: 'Inverted Rows', type: 'strength', muscle: 'back', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'b4', name: 'Superman Holds', type: 'strength', muscle: 'back', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'b5', name: 'Arch Holds', type: 'strength', muscle: 'back', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'b6', name: 'Bent-over Rows', type: 'strength', muscle: 'back', equipment: 'barbell', difficulty: 'intermediate' },
    { id: 'b7', name: 'Lat Pulldowns', type: 'strength', muscle: 'back', equipment: 'cable', difficulty: 'beginner' },
    { id: 'b8', name: 'Seated Rows', type: 'strength', muscle: 'back', equipment: 'cable', difficulty: 'intermediate' },
    { id: 'b9', name: 'T-bar Rows', type: 'strength', muscle: 'back', equipment: 'machine', difficulty: 'intermediate' },
    { id: 'b10', name: 'Single-arm Rows', type: 'strength', muscle: 'back', equipment: 'dumbbell', difficulty: 'beginner' },
    { id: 'l1', name: 'Bodyweight Squats', type: 'strength', muscle: 'legs', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'l2', name: 'Lunges', type: 'strength', muscle: 'legs', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'l3', name: 'Jump Squats', type: 'strength', muscle: 'legs', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'l4', name: 'Glute Bridges', type: 'strength', muscle: 'legs', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'l5', name: 'Calf Raises', type: 'strength', muscle: 'legs', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'l6', name: 'Step-ups', type: 'strength', muscle: 'legs', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'l7', name: 'Barbell Squats', type: 'strength', muscle: 'legs', equipment: 'barbell', difficulty: 'intermediate' },
    { id: 'l8', name: 'Deadlifts', type: 'strength', muscle: 'legs', equipment: 'barbell', difficulty: 'advanced' },
    { id: 'l9', name: 'Leg Press', type: 'strength', muscle: 'legs', equipment: 'machine', difficulty: 'beginner' },
    { id: 'l10', name: 'Leg Extensions', type: 'strength', muscle: 'legs', equipment: 'machine', difficulty: 'beginner' },
    { id: 'l11', name: 'Hamstring Curls', type: 'strength', muscle: 'legs', equipment: 'machine', difficulty: 'beginner' },
    { id: 's1', name: 'Pike Push-ups', type: 'strength', muscle: 'shoulders', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 's2', name: 'Handstand Push-ups', type: 'strength', muscle: 'shoulders', equipment: 'bodyweight', difficulty: 'advanced' },
    { id: 's3', name: 'Shoulder Taps', type: 'strength', muscle: 'shoulders', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 's4', name: 'Wall Walks', type: 'strength', muscle: 'shoulders', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 's5', name: 'Overhead Press', type: 'strength', muscle: 'shoulders', equipment: 'barbell', difficulty: 'intermediate' },
    { id: 's6', name: 'Dumbbell Press', type: 'strength', muscle: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner' },
    { id: 's7', name: 'Lateral Raises', type: 'strength', muscle: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner' },
    { id: 's8', name: 'Front Raises', type: 'strength', muscle: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner' },
    { id: 's9', name: 'Face Pulls', type: 'strength', muscle: 'shoulders', equipment: 'cable', difficulty: 'intermediate' },
    { id: 'a1', name: 'Tricep Dips', type: 'strength', muscle: 'arms', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'a2', name: 'Diamond Push-ups', type: 'strength', muscle: 'arms', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'a3', name: 'Close Grip Push-ups', type: 'strength', muscle: 'arms', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'a4', name: 'Bodyweight Curls', type: 'strength', muscle: 'arms', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'a5', name: 'Barbell Curls', type: 'strength', muscle: 'arms', equipment: 'barbell', difficulty: 'beginner' },
    { id: 'a6', name: 'Hammer Curls', type: 'strength', muscle: 'arms', equipment: 'dumbbell', difficulty: 'beginner' },
    { id: 'a7', name: 'Tricep Extensions', type: 'strength', muscle: 'arms', equipment: 'dumbbell', difficulty: 'beginner' },
    { id: 'a8', name: 'Skull Crushers', type: 'strength', muscle: 'arms', equipment: 'barbell', difficulty: 'intermediate' },
    { id: 'a9', name: 'Preacher Curls', type: 'strength', muscle: 'arms', equipment: 'machine', difficulty: 'intermediate' },
    { id: 'co1', name: 'Plank', type: 'strength', muscle: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'co2', name: 'Russian Twists', type: 'strength', muscle: 'core', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'co3', name: 'Leg Raises', type: 'strength', muscle: 'core', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'co4', name: 'Mountain Climbers', type: 'strength', muscle: 'core', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'co5', name: 'Bicycle Crunches', type: 'strength', muscle: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'co6', name: 'Flutter Kicks', type: 'strength', muscle: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: 'co7', name: 'Cable Crunches', type: 'strength', muscle: 'core', equipment: 'cable', difficulty: 'intermediate' },
    { id: 'co8', name: 'Ab Rollout', type: 'strength', muscle: 'core', equipment: 'wheel', difficulty: 'advanced' },
    { id: 'co9', name: 'Hanging Leg Raises', type: 'strength', muscle: 'core', equipment: 'bodyweight', difficulty: 'advanced' }
  ];
};

const getFallbackExercise = (muscle, isBodyweight, order, timestamp) => {
  const fallbackExercises = {
    chest: [
      { id: `fb-c-${order}-${timestamp}`, name: 'Push-up Variations', type: 'strength', muscle: 'chest', equipment: 'bodyweight', difficulty: 'beginner' },
      { id: `fb-c2-${order}-${timestamp}`, name: 'Chest Press', type: 'strength', muscle: 'chest', equipment: 'dumbbell', difficulty: 'beginner' }
    ],
    back: [
      { id: `fb-b-${order}-${timestamp}`, name: 'Row Variations', type: 'strength', muscle: 'back', equipment: 'bodyweight', difficulty: 'beginner' },
      { id: `fb-b2-${order}-${timestamp}`, name: 'Back Extensions', type: 'strength', muscle: 'back', equipment: 'bodyweight', difficulty: 'beginner' }
    ],
    legs: [
      { id: `fb-l-${order}-${timestamp}`, name: 'Squat Variations', type: 'strength', muscle: 'legs', equipment: 'bodyweight', difficulty: 'beginner' },
      { id: `fb-l2-${order}-${timestamp}`, name: 'Lunge Variations', type: 'strength', muscle: 'legs', equipment: 'bodyweight', difficulty: 'beginner' }
    ]
  };
  
  const exercises = fallbackExercises[muscle] || [
    { id: `fb-g-${order}-${timestamp}`, name: 'Full Body Movement', type: 'strength', muscle: muscle, equipment: 'bodyweight', difficulty: 'beginner' }
  ];
  
  return exercises[order % exercises.length];
};

const getGenericExercises = (isBodyweight) => {
  return [
    { id: 'g1', name: 'Burpees', type: 'strength', muscle: 'full', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'g2', name: 'Mountain Climbers', type: 'strength', muscle: 'core', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: 'g3', name: 'Jumping Jacks', type: 'strength', muscle: 'full', equipment: 'bodyweight', difficulty: 'beginner' }
  ].filter(ex => isBodyweight ? isBodyweightExercise(ex.equipment) : !isBodyweightExercise(ex.equipment));
};

const isBodyweightExercise = (equipment) => {
  if (!equipment) return false;
  const bodyweightKeywords = ['bodyweight', 'body only', 'body_only', 'none', 'no equipment', 'body weight'];
  return bodyweightKeywords.some(keyword => equipment.toLowerCase().includes(keyword.toLowerCase()));
};

const mapMuscleGroup = (muscle) => {
  const muscleMap = {
    'chest': 'chest', 'back': 'back', 'legs': 'legs', 'shoulders': 'shoulders',
    'biceps': 'arms', 'triceps': 'arms', 'arms': 'arms', 'core': 'core',
    'abdominals': 'core', 'abs': 'core'
  };
  return muscleMap[muscle] || muscle;
};

const getDefaultInstructions = (name, muscle) => {
  return `Perform ${name} with proper form and controlled movements. Focus on engaging your ${muscle} throughout the exercise.`;
};

export default exerciseAPI;