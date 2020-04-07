import { element, by, ElementFinder } from 'protractor';

export class PushSubscriptionComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-push-subscription div table .btn-danger'));
  title = element.all(by.css('jhi-push-subscription div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class PushSubscriptionUpdatePage {
  pageTitle = element(by.id('jhi-push-subscription-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  endpointInput = element(by.id('field_endpoint'));
  authInput = element(by.id('field_auth'));
  p256dhInput = element(by.id('field_p256dh'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setEndpointInput(endpoint: string): Promise<void> {
    await this.endpointInput.sendKeys(endpoint);
  }

  async getEndpointInput(): Promise<string> {
    return await this.endpointInput.getAttribute('value');
  }

  async setAuthInput(auth: string): Promise<void> {
    await this.authInput.sendKeys(auth);
  }

  async getAuthInput(): Promise<string> {
    return await this.authInput.getAttribute('value');
  }

  async setP256dhInput(p256dh: string): Promise<void> {
    await this.p256dhInput.sendKeys(p256dh);
  }

  async getP256dhInput(): Promise<string> {
    return await this.p256dhInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class PushSubscriptionDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-pushSubscription-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-pushSubscription'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
