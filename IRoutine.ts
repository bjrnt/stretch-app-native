import { Stretch, Exercise } from './Data'

export default interface IRoutine {
  description: string
  name: string
  tasks: (Stretch | Exercise)[]
}
