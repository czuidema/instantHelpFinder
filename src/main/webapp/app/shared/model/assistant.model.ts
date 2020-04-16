import { ITurningEvent } from 'app/shared/model/turning-event.model';
import { IUserRole } from 'app/shared/model/user-role.model';
import { User } from 'app/core/user/user.model';

export interface IAssistant extends IUserRole {
  turningEvents?: ITurningEvent[];
}

export class Assistant implements IAssistant {
  constructor(
    public id?: number,
    public isAvailable?: boolean,
    public turningEvents?: ITurningEvent[],
    public type?: string,
    public user?: User
  ) {
    this.id = id;
    this.isAvailable = isAvailable;
    this.turningEvents = turningEvents || [];
    this.type = 'Assistant';
    this.user = user;
  }
}
