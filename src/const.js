// constant variables that define how the overall app functionality

// defines how often steps per minute is recalculated in milliseconds
export const spmUpdateInterval = 5000;

// this is how many recent data points are used in the
// rolling average calculation of SPM
export const numCalibrationIntervals = 10;

// the minimum number of step counts needed to calculate an SPM
export const minDataPoints = 4;

// the allowed percent difference between SPM and BPM
export const tempoAdjustmentTolerance = 0.1;
