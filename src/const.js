// constant variables that define how the overall app functionality

// defines how often steps per minute is recalculated in milliseconds
export const spmUpdateInterval = 5000;

// this times spmUpdateInterval is how long the app must run before
// taking an average of the steps per minute for choosing the next song
export const numCalibrationIntervals = 3;

// the allowed percent difference between SPM and BPM
export const tempoAdjustmentTolerance = 0.1;
