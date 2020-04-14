import { IPushSubscription } from 'app/shared/model/push-subscription.model';

export interface IUserRole {
  id?: number;
  availability?: boolean;
  pushSubscription?: IPushSubscription;
}

export class UserRole implements IUserRole {
  constructor(
    public id?: number,
    public availability?: boolean,
    public pushSubscription?: IPushSubscription
  ) {
    this.availability = availability || false;
  }
}
