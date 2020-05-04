import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { LANGUAGES } from 'app/core/language/language.constants';
import { PushSubscriptionService } from 'app/entities/push-subscription/push-subscription.service';
import { collectAllDependants } from 'ts-loader/dist/utils';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  @ViewChild('enableNotificationsCheckbox', { static: false }) enableNotificationsCheckbox?: ElementRef;

  account!: Account;
  success = false;
  languages = LANGUAGES;

  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    langKey: [undefined],
    enablePushNotifications: ['']
  });

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private languageService: JhiLanguageService,
    private pushSubscriptionService: PushSubscriptionService,
    private renderer: Renderer2,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          langKey: account.langKey
        });

        this.account = account;
      }
    });
    this.alertService.notificationBrowserSupport = this.alertService.hasNotificationBrowserSupport();
    this.alertService.notificationPermissionStatus = this.alertService.hasNotificationPermission();
  }

  displayConfirmNotification(): void {
    if ('serviceWorker' in navigator) {
      console.log('Has serviceWorker');
      const options = {
        body: 'You successfully subscribed to our Notification service!',
        tag: 'confirm-notification'
      };
      // Notification through Service Worker
      navigator.serviceWorker.ready.then(swreg => {
        swreg.showNotification('Successfully subscribed (with SW)', options);
      });
      // Notification without Service Worker
      // new Notification('Successfully subscribed');
    }
  }

  configurePushSub(): void {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    let reg: ServiceWorkerRegistration;
    navigator.serviceWorker.ready
      .then(swreg => {
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then(sub => {
        if (sub === null) {
          // Create new subscription
          const VAPID_PUBLIC_KEY = 'BPZALa9BQDUe9o0wHgWN4-ahHH-tnRJRrSvMOMUqyNA-EQYfEVojN0JMK6HL8_4_orR5qdzlvIUO7XZX_CYF5EE';
          const CONV_VAPID_PUBLIC_KEY = this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: CONV_VAPID_PUBLIC_KEY
          });
        } else {
          // We have a subscription
          return;
        }
      })
      .then(newSub => {
        console.log('Send subscription to Backend-Server');
      });
  }

  askForNotificationPermission(event: any): void {
    Notification.requestPermission(result => {
      console.log('User Choice', result);
      if (result !== 'granted') {
        this.renderer.setProperty(this.enableNotificationsCheckbox?.nativeElement, 'checked', '');
        this.alertService.notificationPermissionStatus = false;
      } else {
        // Maybe hide button
        this.alertService.notificationPermissionStatus = true;
        this.renderer.setProperty(this.enableNotificationsCheckbox?.nativeElement, 'checked', 'true');
      }
    });
  }

  // Web-Push
  // Public base64 to Uint
  urlBase64ToUint8Array(base64String: string): any {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    let rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  save(): void {
    this.success = false;

    this.account.firstName = this.settingsForm.get('firstName')!.value;
    this.account.lastName = this.settingsForm.get('lastName')!.value;
    this.account.email = this.settingsForm.get('email')!.value;
    this.account.langKey = this.settingsForm.get('langKey')!.value;

    this.accountService.save(this.account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(this.account);

      if (this.account.langKey !== this.languageService.getCurrentLanguage()) {
        this.languageService.changeLanguage(this.account.langKey);
      }
    });
  }
}
