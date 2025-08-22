type TaskType = 'Stretch' | 'Exercise'

interface Task {
  description?: string
  name: string
  set?: number
  type: TaskType
}
export interface Stretch extends Task {
  duration: number
  type: 'Stretch'
}

export interface Exercise extends Task {
  repetitions: number
  type: 'Exercise'
}

interface CommonConfig {
  eachSide?: boolean
}

export interface StretchConfig extends CommonConfig, Partial<Stretch> {}

export interface ExerciseConfig extends CommonConfig, Partial<Exercise> {}
