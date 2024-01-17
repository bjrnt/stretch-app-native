import Stretch from './Stretch'

export default class Routine {
  private _stretchIndex: number = 0

  constructor(readonly stretches: Stretch[]) {}

  public start() {
    this._stretchIndex = 0
  }

  public hasNextStretch(): boolean {
    return this._stretchIndex + 1 < this.stretches.length
  }

  public goToNextStretch() {
    this._stretchIndex += 1
  }

  public currentStretch(): Stretch | undefined {
    if (
      this._stretchIndex === -1 ||
      this._stretchIndex >= this.stretches.length
    ) {
      return undefined
    }

    return this.stretches[this._stretchIndex]
  }

  public nextStretch(): Stretch | undefined {
    if (this._stretchIndex + 1 >= this.stretches.length) {
      return undefined
    }

    return this.stretches[this._stretchIndex + 1]
  }

  public remainingStretches(): Stretch[] {
    return this.stretches.slice(this._stretchIndex + 1)
  }
}
