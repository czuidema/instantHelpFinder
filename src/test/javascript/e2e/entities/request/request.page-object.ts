import { element, by, ElementFinder } from 'protractor';

export class RequestComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-request div table .btn-danger'));
  title = element.all(by.css('jhi-request div h2#page-heading span')).first();
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

export class RequestUpdatePage {
  pageTitle = element(by.id('jhi-request-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  locationInput = element(by.id('field_location'));

  doctorSelect = element(by.id('field_doctor'));
  icuNurseSelect = element(by.id('field_icuNurse'));
  assistantsSelect = element(by.id('field_assistants'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setLocationInput(location: string): Promise<void> {
    await this.locationInput.sendKeys(location);
  }

  async getLocationInput(): Promise<string> {
    return await this.locationInput.getAttribute('value');
  }

  async doctorSelectLastOption(): Promise<void> {
    await this.doctorSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async doctorSelectOption(option: string): Promise<void> {
    await this.doctorSelect.sendKeys(option);
  }

  getDoctorSelect(): ElementFinder {
    return this.doctorSelect;
  }

  async getDoctorSelectedOption(): Promise<string> {
    return await this.doctorSelect.element(by.css('option:checked')).getText();
  }

  async icuNurseSelectLastOption(): Promise<void> {
    await this.icuNurseSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async icuNurseSelectOption(option: string): Promise<void> {
    await this.icuNurseSelect.sendKeys(option);
  }

  getIcuNurseSelect(): ElementFinder {
    return this.icuNurseSelect;
  }

  async getIcuNurseSelectedOption(): Promise<string> {
    return await this.icuNurseSelect.element(by.css('option:checked')).getText();
  }

  async assistantsSelectLastOption(): Promise<void> {
    await this.assistantsSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async assistantsSelectOption(option: string): Promise<void> {
    await this.assistantsSelect.sendKeys(option);
  }

  getAssistantsSelect(): ElementFinder {
    return this.assistantsSelect;
  }

  async getAssistantsSelectedOption(): Promise<string> {
    return await this.assistantsSelect.element(by.css('option:checked')).getText();
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

export class RequestDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-request-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-request'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
