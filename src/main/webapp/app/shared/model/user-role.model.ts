import { IPushSubscription } from 'app/shared/model/push-subscription.model';

export interface IUserRole {
  id?: number;
  pushSubscrioption?: IPushSubscription;
}

export class UserRole implements IUserRole {
  constructor(public id?: number, public pushSubscrioption?: IPushSubscription) {}
}
