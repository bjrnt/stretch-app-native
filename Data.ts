type TaskType = "Stretch" | "Exercise";

interface Task {
  description?: string;
  name: string;
  pauseAfter?: boolean;
  set?: number;
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
