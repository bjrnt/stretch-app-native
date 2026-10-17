type TaskType = "Stretch" | "Exercise";
export type Side = "Left" | "Right";

interface Task {
  description?: string;
  name: string;
  pauseAfter?: boolean;
  // Set number out of `sets`, when the task is repeated
  set?: number;
  sets?: number;
  side?: Side;
  type: TaskType;
}
export interface Stretch extends Task {
  duration: number;
  type: "Stretch";
}

export interface Exercise extends Task {
  // A number renders as "Complete N repetitions."; a string as "Complete <string>."
  repetitions: number | string;
  type: "Exercise";
}

interface CommonConfig {
  eachSide?: boolean;
}

export interface StretchConfig extends CommonConfig, Partial<Stretch> {}

export interface ExerciseConfig extends CommonConfig, Partial<Exercise> {}
