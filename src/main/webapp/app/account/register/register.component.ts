import { Component, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared/constants/error.constants';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { RegisterService } from './register.service';
import { IUserRole } from 'app/shared/model/user-role.model';
import { Doctor } from 'app/shared/model/doctor.model';
import { ICUNurse } from 'app/shared/model/icu-nurse.model';
import { Assistant } from 'app/shared/model/assistant.model';
import { PushSubscription } from 'app/shared/model/push-subscription.model';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false }) login?: ElementRef;

  @ViewChild('enableNotificationsCheckbox', { static: false }) enableNotificationsCheckbox?: ElementRef;
  @ViewChild('deviceName', { static: false }) deviceName?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;
  userRoleNames = ['Doctor', 'ICUNurse', 'Assistant'];
  newSubString = { endpoint: '', auth: '', p256dh: '' };
  notificationsAllowed: boolean = false;
  notificationsRejected: boolean = false;

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@A-Za-z0-9-]*$')]],
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@A-Za-z0-9-]*$')]],
    login: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@A-Za-z0-9-]*$')]],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    userRoleName: ['', [Validators.required]],
    enablePushNotifications: [''],
    deviceName: ['']
  });

  constructor(
    private renderer: Renderer2,
    private languageService: JhiLanguageService,
    private loginModalService: LoginModalService,
    private registerService: RegisterService,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  register(): void {
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const password = this.registerForm.get(['password'])!.value;
    if (password !== this.registerForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      const login = this.registerForm.get(['login'])!.value;
      const email = this.registerForm.get(['email'])!.value;
      const userRoleIndex = +this.registerForm.get(['userRoleName'])!.value;
      let userRole: IUserRole;
      let pushSubscription: PushSubscription;
      switch (userRoleIndex) {
        case 0:
          userRole = new Doctor(undefined, true);
          break;
        case 1:
          userRole = new ICUNurse(undefined, true);
          break;
        case 2:
          userRole = new Assistant(undefined, true);
          break;
        default:
          userRole = new Assistant();
      }

      if (this.notificationsAllowed) {
        this.configurePushSub();
        pushSubscription = new PushSubscription(
          undefined,
          this.newSubString.endpoint,
          this.newSubString.auth,
          this.newSubString.p256dh,
          userRole
        );
        console.log('You registered with endpoint:' + this.newSubString.endpoint);
        userRole.pushSubscription = pushSubscription;
      }

      this.registerService.save({ userRole, login, email, password, langKey: this.languageService.getCurrentLanguage() }).subscribe(
        () => (this.success = true),
        response => this.processError(response)
      );
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
          console.log('We have a subscription already.');
          return;
        }
      })
      .then(newSub => {
        if (newSub !== undefined) {
          // some hack to get auth: ArrayBuffer to auth: String (same for p256)
          let newSubAsString = JSON.parse(JSON.stringify(newSub));

          this.newSubString.endpoint = newSub.endpoint;
          this.newSubString.auth = newSubAsString['keys']['auth'];
          this.newSubString.p256dh = newSubAsString['keys']['p256dh'];

          console.log(JSON.stringify(newSub));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  askForNotificationPermission(event: any): void {
    Notification.requestPermission(result => {
      console.log('User Choice', result);
      if (result !== 'granted') {
        // TODO: Using renderer to transform elements of a reactive component is bad practice.
        this.renderer.setAttribute(this.deviceName?.nativeElement, 'disabled', 'true');
        this.renderer.setProperty(this.enableNotificationsCheckbox?.nativeElement, 'checked', '');
        this.notificationsRejected = true;
        this.notificationsAllowed = false;
      } else {
        // Maybe hide button
        this.notificationsRejected = false;
        this.notificationsAllowed = !this.notificationsAllowed;
        if (this.notificationsAllowed) {
          // TODO: Using renderer to transform elements of a reactive component is bad practice.
          this.renderer.removeAttribute(this.deviceName?.nativeElement, 'disabled');
          this.renderer.setProperty(this.enableNotificationsCheckbox?.nativeElement, 'checked', 'true');
        } else {
          // TODO: Using renderer to transform elements of a reactive component is bad practice.
          this.renderer.setAttribute(this.deviceName?.nativeElement, 'disabled', 'true');
          this.renderer.setProperty(this.enableNotificationsCheckbox?.nativeElement, 'checked', '');
        }
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

  openLogin(): void {
    this.loginModalService.open();
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
