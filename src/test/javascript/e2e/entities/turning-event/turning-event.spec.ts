import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TurningEventComponentsPage, TurningEventDeleteDialog, TurningEventUpdatePage } from './turning-event.page-object';

const expect = chai.expect;

describe('TurningEvent e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let turningEventComponentsPage: TurningEventComponentsPage;
  let turningEventUpdatePage: TurningEventUpdatePage;
  let turningEventDeleteDialog: TurningEventDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load TurningEvents', async () => {
    await navBarPage.goToEntity('turning-event');
    turningEventComponentsPage = new TurningEventComponentsPage();
    await browser.wait(ec.visibilityOf(turningEventComponentsPage.title), 5000);
    expect(await turningEventComponentsPage.getTitle()).to.eq('instantHelpFinderApp.turningEvent.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(turningEventComponentsPage.entities), ec.visibilityOf(turningEventComponentsPage.noResult)),
      1000
    );
  });

  it('should load create TurningEvent page', async () => {
    await turningEventComponentsPage.clickOnCreateButton();
    turningEventUpdatePage = new TurningEventUpdatePage();
    expect(await turningEventUpdatePage.getPageTitle()).to.eq('instantHelpFinderApp.turningEvent.home.createOrEditLabel');
    await turningEventUpdatePage.cancel();
  });

  it('should create and save TurningEvents', async () => {
    const nbButtonsBeforeCreate = await turningEventComponentsPage.countDeleteButtons();

    await turningEventComponentsPage.clickOnCreateButton();

    await promise.all([
      turningEventUpdatePage.setPatientNameInput('patientName'),
      turningEventUpdatePage.setPatientDataInput('patientData'),
      turningEventUpdatePage.setWardInput('ward'),
      turningEventUpdatePage.setRoomNrInput('roomNr'),
      turningEventUpdatePage.prioritySelectLastOption(),
      turningEventUpdatePage.doctorSelectLastOption(),
      turningEventUpdatePage.icuNurseSelectLastOption()
      // turningEventUpdatePage.assistantsSelectLastOption(),
    ]);

    expect(await turningEventUpdatePage.getPatientNameInput()).to.eq(
      'patientName',
      'Expected PatientName value to be equals to patientName'
    );
    expect(await turningEventUpdatePage.getPatientDataInput()).to.eq(
      'patientData',
      'Expected PatientData value to be equals to patientData'
    );
    expect(await turningEventUpdatePage.getWardInput()).to.eq('ward', 'Expected Ward value to be equals to ward');
    expect(await turningEventUpdatePage.getRoomNrInput()).to.eq('roomNr', 'Expected RoomNr value to be equals to roomNr');

    await turningEventUpdatePage.save();
    expect(await turningEventUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await turningEventComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last TurningEvent', async () => {
    const nbButtonsBeforeDelete = await turningEventComponentsPage.countDeleteButtons();
    await turningEventComponentsPage.clickOnLastDeleteButton();

    turningEventDeleteDialog = new TurningEventDeleteDialog();
    expect(await turningEventDeleteDialog.getDialogTitle()).to.eq('instantHelpFinderApp.turningEvent.delete.question');
    await turningEventDeleteDialog.clickOnConfirmButton();

    expect(await turningEventComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
