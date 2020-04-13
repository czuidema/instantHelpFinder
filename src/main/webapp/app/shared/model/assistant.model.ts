import { ITurningEvent } from 'app/shared/model/turning-event.model';

export interface IAssistant {
  id?: number;
  turningEvents?: ITurningEvent[];
}

export class Assistant implements IAssistant {
  constructor(public id?: number, public turningEvents?: ITurningEvent[]) {}
}
