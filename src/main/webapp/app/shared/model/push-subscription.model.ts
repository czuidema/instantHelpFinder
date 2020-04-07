import { IUserRole } from 'app/shared/model/user-role.model';

export interface IPushSubscription {
  id?: number;
  endpoint?: string;
  auth?: string;
  p256dh?: string;
  userRole?: IUserRole;
}

export class PushSubscription implements IPushSubscription {
  constructor(public id?: number, public endpoint?: string, public auth?: string, public p256dh?: string, public userRole?: IUserRole) {}
}
