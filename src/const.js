// constant variables that define how the overall app functionality

// defines how often steps per minute is recalculated in milliseconds
export const spmUpdateInterval = 5000;

export const playerStateUpdateInterval = 5000;

// this is how many recent data points are used in the
// rolling average calculation of SPM
export const numCalibrationIntervals = 10;

// the minimum number of step counts needed to calculate an SPM
export const minDataPoints = 4;

// the allowed percent difference between SPM and BPM
export const tempoAdjustmentTolerance = 0.1;

// stores only this many recent workouts in storage
export const maxRecordStorage = 20;

// utility to convert steps to miles
export const stepsToMiles = (steps) => {
  const avgStepsPerMi = 2250;
  const totalMi = steps / avgStepsPerMi;
  return parseFloat(totalMi.toFixed(2));
};

// utility to convert seconds to user friendly string

export const secondsToString = (seconds) => {
  seconds = Math.floor(seconds);
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const formattedSeconds = remainingSeconds % 60;

  // Format the result
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${formattedSeconds.toString().padStart(2, "0")}`;

  return formattedTime;
};
