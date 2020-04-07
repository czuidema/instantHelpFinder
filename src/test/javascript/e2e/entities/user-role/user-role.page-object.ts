import { element, by, ElementFinder } from 'protractor';

export class UserRoleComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-user-role div table .btn-danger'));
  title = element.all(by.css('jhi-user-role div h2#page-heading span')).first();
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

export class UserRoleUpdatePage {
  pageTitle = element(by.id('jhi-user-role-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  pushSubscrioptionSelect = element(by.id('field_pushSubscrioption'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async pushSubscrioptionSelectLastOption(): Promise<void> {
    await this.pushSubscrioptionSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async pushSubscrioptionSelectOption(option: string): Promise<void> {
    await this.pushSubscrioptionSelect.sendKeys(option);
  }

  getPushSubscrioptionSelect(): ElementFinder {
    return this.pushSubscrioptionSelect;
  }

  async getPushSubscrioptionSelectedOption(): Promise<string> {
    return await this.pushSubscrioptionSelect.element(by.css('option:checked')).getText();
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

export class UserRoleDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-userRole-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-userRole'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
