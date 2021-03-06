import { IUserRole } from 'app/shared/model/user-role.model';
import { IPushSubscription } from 'app/shared/model/push-subscription.model';
import { ITurningEvent } from 'app/shared/model/turning-event.model';
import { User } from 'app/core/user/user.model';

export interface IDoctor extends IUserRole {
  isPreferredDoctor?: boolean;
  turningEvents?: ITurningEvent[];
}

export class Doctor implements IDoctor {
  constructor(
    public id?: number,
    public isAvailable?: boolean,
    public pushSubscription?: IPushSubscription,
    public isPreferredDoctor?: boolean,
    public dtype?: string,
    public user?: User
  ) {
    this.id = id;
    this.isAvailable = isAvailable;
    this.isPreferredDoctor = isPreferredDoctor || false;
    this.dtype = 'Doctor';
    this.user = user;
  }
}
