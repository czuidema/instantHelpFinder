import { Injectable } from '@angular/core';
import has = Reflect.has;

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

  // TODO: this function is supposed to return true if subscription exists false otherwise. The else if part it broken.
  hasSubscription(): boolean {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications!');
      return false;
    } else if (Notification.permission === 'granted') {
      let hasSub: boolean = true;
      navigator.serviceWorker.ready.then(swreg => {
        swreg.pushManager.getSubscription().then(sub => {
          if (sub === undefined) {
            hasSub = false;
          } else {
            hasSub = sub !== null;
          }
        });
      });
      return hasSub;
    } else {
      console.log('This browser has no permission to send push notifications!');
      return false;
    }
  }
}
