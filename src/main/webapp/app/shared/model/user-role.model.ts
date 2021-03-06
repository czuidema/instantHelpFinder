import { IPushSubscription } from 'app/shared/model/push-subscription.model';
import { User } from 'app/core/user/user.model';

export interface IUserRole {
  id?: number;
  availability?: boolean;
  pushSubscription?: IPushSubscription;
  dtype?: string;
  user?: User;
}

export class UserRole implements IUserRole {
  constructor(
    public id?: number,
    public availability?: boolean,
    public pushSubscription?: IPushSubscription,
    public dtype?: string,
    public user?: User
  ) {
    this.availability = availability || false;
  }
}
