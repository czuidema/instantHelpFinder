import { element, by, ElementFinder } from 'protractor';

export class TurningEventComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-turning-event div table .btn-danger'));
  title = element.all(by.css('jhi-turning-event div h2#page-heading span')).first();
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

export class TurningEventUpdatePage {
  pageTitle = element(by.id('jhi-turning-event-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  patientNameInput = element(by.id('field_patientName'));
  patientDataInput = element(by.id('field_patientData'));
  wardInput = element(by.id('field_ward'));
  roomNrInput = element(by.id('field_roomNr'));
  prioritySelect = element(by.id('field_priority'));

  doctorSelect = element(by.id('field_doctor'));
  icuNurseSelect = element(by.id('field_icuNurse'));
  assistantsSelect = element(by.id('field_assistants'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setPatientNameInput(patientName: string): Promise<void> {
    await this.patientNameInput.sendKeys(patientName);
  }

  async getPatientNameInput(): Promise<string> {
    return await this.patientNameInput.getAttribute('value');
  }

  async setPatientDataInput(patientData: string): Promise<void> {
    await this.patientDataInput.sendKeys(patientData);
  }

  async getPatientDataInput(): Promise<string> {
    return await this.patientDataInput.getAttribute('value');
  }

  async setWardInput(ward: string): Promise<void> {
    await this.wardInput.sendKeys(ward);
  }

  async getWardInput(): Promise<string> {
    return await this.wardInput.getAttribute('value');
  }

  async setRoomNrInput(roomNr: string): Promise<void> {
    await this.roomNrInput.sendKeys(roomNr);
  }

  async getRoomNrInput(): Promise<string> {
    return await this.roomNrInput.getAttribute('value');
  }

  async setPrioritySelect(priority: string): Promise<void> {
    await this.prioritySelect.sendKeys(priority);
  }

  async getPrioritySelect(): Promise<string> {
    return await this.prioritySelect.element(by.css('option:checked')).getText();
  }

  async prioritySelectLastOption(): Promise<void> {
    await this.prioritySelect
      .all(by.tagName('option'))
      .last()
      .click();
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

export class TurningEventDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-turningEvent-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-turningEvent'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
