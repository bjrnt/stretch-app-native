import Stretch, { StretchConfig } from './Stretch'

export default class RoutineBuilder {
  private _stretches: StretchConfig[] = []
  private _sets: number = 1
  private _defaultLength?: number
  private _overrideLength?: number

  public withStretches(stretches: StretchConfig[]): RoutineBuilder {
    this._stretches = stretches
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

  public withOverridenLength(length: number): RoutineBuilder {
    this._overrideLength = length
    return this
  }

  public build(): Stretch[] {
    const stretches = Array.from({ length: this._sets }, (_, i) =>
      this._stretches.map((stretch) => {
        if (this._sets > 1) {
          return { ...stretch, set: i + 1 }
        }
        return stretch
      })
    )
      .flat()
      .flatMap((stretchConfig) => {
        if (stretchConfig.eachSide) {
          const left = {
            ...stretchConfig,
            name: stretchConfig.name + ' (Left Side)',
          }
          const right = {
            ...stretchConfig,
            name: stretchConfig.name + ' (Right Side)',
          }
          delete left.eachSide
          delete right.eachSide
          return [left, right]
        }
        return stretchConfig
      })
      .map((stretchConfig) => {
        const duration =
          this._overrideLength || this._defaultLength || stretchConfig.duration
        return { ...stretchConfig, duration }
      })
      .map((stretchConfig) => {
        return stretchConfig as Stretch
      })
    return stretches
  }
}
