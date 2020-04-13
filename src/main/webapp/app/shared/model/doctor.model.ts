import {IUserRole, UserRole} from "app/shared/model/user-role.model";
import {IPushSubscription} from "app/shared/model/push-subscription.model";

export interface IDoctor {
  isPreferredDoctor?: boolean;
}

export class Doctor extends UserRole implements IDoctor {
  constructor(public id?: number, public isPreferredDoctor?: boolean, public pushSubscription?: IPushSubscription) {
    super(id, isPreferredDoctor, pushSubscription);
    this.isPreferredDoctor = this.isPreferredDoctor || false;
  }
}
