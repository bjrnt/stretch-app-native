import IRoutine from './IRoutine'
import { Exercise, ExerciseConfig, Stretch, StretchConfig } from './Data'

export default class RoutineBuilder {
  private _tasks: (StretchConfig | ExerciseConfig)[] = []
  private _sets: number = 1
  private _defaultLength?: number

  constructor(private readonly _name: string, private _description: string) {}

  public withDescription(description: string): RoutineBuilder {
    this._description = description
    return this
  }

  public withStretches(
    ...stretches: Omit<StretchConfig, 'type'>[]
  ): RoutineBuilder {
    for (const stretch of stretches) {
      this._tasks.push({ ...stretch, type: 'Stretch' })
    }
    return this
  }

  public withExercises(
    ...exercises: Omit<ExerciseConfig, 'type'>[]
  ): RoutineBuilder {
    for (const exercise of exercises) {
      this._tasks.push({ ...exercise, type: 'Exercise' })
    }
    return this
  }

  public withSets(sets: number): RoutineBuilder {
    this._sets = sets
    return this
  }

  public withDefaultLength(length: number): RoutineBuilder {
    this._defaultLength = length
    return this
  }

  public build(): IRoutine {
    const tasks: (Stretch | Exercise)[] = Array.from(
      { length: this._sets },
      (_, i) =>
        this._tasks.map((stretch) => {
          if (this._sets > 1) {
            return { ...stretch, set: i + 1 }
          }
          return stretch
        })
    )
      .flat()
      .flatMap((config) => {
        if (config.eachSide) {
          const left = {
            ...config,
            name: config.name + ' (Left Side)',
          }
          const right = {
            ...config,
            name: config.name + ' (Right Side)',
          }
          delete left.eachSide
          delete right.eachSide
          return [left, right]
        }
        return config
      })
      .map((config) => {
        if (config.type !== 'Stretch') {
          return config
        }
        const duration =
          (config as StretchConfig).duration ?? this._defaultLength!
        return { ...config, duration }
      })
      .map((config) => {
        if (config.type === 'Stretch') {
          return config as Stretch
        } else if (config.type === 'Exercise') {
          return config as Exercise
        } else {
          throw new Error(
            `unknown task type ${config.type}: ${JSON.stringify(config)}`
          )
        }
      })
    return {
      description: this._description,
      name: this._name,
      tasks,
    }
  }
}
