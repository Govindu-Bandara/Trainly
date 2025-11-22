export const calculateCaloriesBurned = (activity, duration, weight = 70, distance = 0) => {
  // Enhanced MET values for different activities
  const metValues = {
    'running': 8,
    'walking': 3.5,
    'cycling': 7.5,
    'indoor_running': 6, // Treadmill running is slightly less intense
  };

  const met = metValues[activity] || 5;
  
  // Calories = MET * weight in kg * time in hours
  const calories = met * weight * (duration / 3600);
  
  return Math.round(calories);
};

export const calculatePace = (distance, duration) => {
  if (distance === 0 || duration === 0) return '0:00';
  const paceInSeconds = duration / distance;
  const minutes = Math.floor(paceInSeconds / 60);
  const seconds = Math.round(paceInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')} min/km`;
};