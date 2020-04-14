import {IUserRole, UserRole} from "app/shared/model/user-role.model";
import {IPushSubscription} from "app/shared/model/push-subscription.model";
import {ITurningEvent} from "app/shared/model/turning-event.model";

export interface IDoctor {
  isPreferredDoctor?: boolean;
  turningEvents?: ITurningEvent[];
}

export class Doctor extends UserRole implements IDoctor {
  constructor(
    id?: number,
    isAvailable?: boolean,
    pushSubscription?: IPushSubscription,
    public isPreferredDoctor?: boolean
  ) {
    super(id, isAvailable, pushSubscription);
    this.isPreferredDoctor = isPreferredDoctor || false;
  }
}
