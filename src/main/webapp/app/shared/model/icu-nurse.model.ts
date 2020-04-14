import {IUserRole} from "app/shared/model/user-role.model";
import {IPushSubscription} from "app/shared/model/push-subscription.model";
import {ITurningEvent} from "app/shared/model/turning-event.model";

export interface IICUNurse extends IUserRole{
  isPreferredICUNurse?: boolean,
  turningEvents?: ITurningEvent[];
}

export class ICUNurse implements IICUNurse {
  constructor(
    public id?: number,
    public isAvailable?: boolean,
    public pushSubscription?: IPushSubscription,
    public isPreferredICUNurse?: boolean,
  ) {
    this.id = id;
    this.isAvailable = isAvailable;
    this.isPreferredICUNurse = isPreferredICUNurse || false;
  }
}
