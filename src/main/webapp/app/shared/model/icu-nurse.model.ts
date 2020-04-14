import {UserRole} from "app/shared/model/user-role.model";
import {IPushSubscription} from "app/shared/model/push-subscription.model";
import {ITurningEvent} from "app/shared/model/turning-event.model";

export interface IICUNurse {
  isPreferredICUNurse?: boolean,
  turningEvents?: ITurningEvent[];
}

export class ICUNurse extends UserRole implements IICUNurse {
  constructor(
    id?: number,
    isAvailable?: boolean,
    pushSubscription?: IPushSubscription,
    public isPreferredICUNurse?: boolean,
  ) {
    super(id, isAvailable, pushSubscription);
    this.isPreferredICUNurse = isPreferredICUNurse || false;
  }
}
