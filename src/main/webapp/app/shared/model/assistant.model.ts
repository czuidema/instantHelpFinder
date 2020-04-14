import { ITurningEvent } from 'app/shared/model/turning-event.model';
import {UserRole} from "app/shared/model/user-role.model";

export interface IAssistant {
  turningEvents?: ITurningEvent[];
}

export class Assistant extends UserRole implements IAssistant {
  constructor(
    id?: number,
    isAvailable?: boolean,
    public turningEvents?: ITurningEvent[]
  ) {
    super(id, isAvailable);
    this.turningEvents = turningEvents || [];
  }
}
