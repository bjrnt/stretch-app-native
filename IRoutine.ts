import { Stretch, Exercise } from './Data'

export default interface IRoutine {
  name: string
  description: string
  tasks: (Stretch | Exercise)[]
}
