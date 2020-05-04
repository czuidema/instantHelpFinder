import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
  notificationBrowserSupport: boolean = false;
  notificationPermissionStatus: boolean = false;
  notificationSubscriptionStatus: boolean = false;

  hasNotificationBrowserSupport(): boolean {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications!');
      return false;
    } else {
      return true;
    }
  }

  hasNotificationPermission(): boolean {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications!');
      return false;
    } else if (Notification.permission === 'granted') {
      return true;
    } else {
      console.log('This browser has no permission to send push notifications!');
      return false;
    }
  }

  /* hasSubscription(): boolean {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications!');
      return false;
    } else if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then( swreg => {
        swreg.pushManager.getSubscription()
          .then( sub => {
            if (sub === undefined) {
              return false;
            } else {
              return sub !== null;
            }
          })
      })
    } else {
      console.log('This browser has no permission to send push notifications!');
      return false;
    }
  }*/
}
