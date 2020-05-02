import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SwPush } from '@angular/service-worker';
import { JhiLanguageService } from 'ng-jhipster';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { LANGUAGES } from 'app/core/language/language.constants';
import { PushSubscriptionService } from 'app/entities/push-subscription/push-subscription.service';
import { collectAllDependants } from 'ts-loader/dist/utils';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  account!: Account;
  success = false;
  languages = LANGUAGES;
  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    langKey: [undefined]
  });

  readonly VAPID_PUBLIC_KEY = 'BPZALa9BQDUe9o0wHgWN4-ahHH-tnRJRrSvMOMUqyNA-EQYfEVojN0JMK6HL8_4_orR5qdzlvIUO7XZX_CYF5EE';

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private languageService: JhiLanguageService,
    private pushSubscriptionService: PushSubscriptionService
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
  }

  subscribeToNotification(): void {
    console.log('Clicked!');
    /* this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => console.log('We can create a push subscription'))
      .catch(err => console.error("Could not subscribe to notifications", err));*/
  }

  displayConfirmNotification(): void {
    if ('serviceWorker' in navigator) {
      console.log('Has serviceWorker');
      const options = {
        body: 'You successfully subscribed to our Notification service!',
        tag: 'confirm-notification'
      };
      navigator.serviceWorker.ready.then(swreg => {
        swreg.showNotification('Successfully subscribed', options);
        console.log('A serviceWorker is active', swreg.active);
      });
    }
  }

  askForNotificationPermission(): void {
    Notification.requestPermission(result => {
      console.log('User Choice', result);
      if (result !== 'granted') {
        console.log('No notification permission granted!');
      } else {
        // Maybe hide button
        this.displayConfirmNotification();
        console.log('Button clicked while granted.');
      }
    });
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
