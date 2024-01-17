export default interface Stretch {
  description?: string
  duration: number
  name: string
  set?: number
}

export interface StretchConfig extends Partial<Stretch> {
  eachSide?: boolean
}
