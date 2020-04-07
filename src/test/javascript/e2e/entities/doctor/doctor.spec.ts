import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { DoctorComponentsPage, DoctorDeleteDialog, DoctorUpdatePage } from './doctor.page-object';

const expect = chai.expect;

describe('Doctor e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let doctorComponentsPage: DoctorComponentsPage;
  let doctorUpdatePage: DoctorUpdatePage;
  let doctorDeleteDialog: DoctorDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Doctors', async () => {
    await navBarPage.goToEntity('doctor');
    doctorComponentsPage = new DoctorComponentsPage();
    await browser.wait(ec.visibilityOf(doctorComponentsPage.title), 5000);
    expect(await doctorComponentsPage.getTitle()).to.eq('instantHelpFinderApp.doctor.home.title');
    await browser.wait(ec.or(ec.visibilityOf(doctorComponentsPage.entities), ec.visibilityOf(doctorComponentsPage.noResult)), 1000);
  });

  it('should load create Doctor page', async () => {
    await doctorComponentsPage.clickOnCreateButton();
    doctorUpdatePage = new DoctorUpdatePage();
    expect(await doctorUpdatePage.getPageTitle()).to.eq('instantHelpFinderApp.doctor.home.createOrEditLabel');
    await doctorUpdatePage.cancel();
  });

  it('should create and save Doctors', async () => {
    const nbButtonsBeforeCreate = await doctorComponentsPage.countDeleteButtons();

    await doctorComponentsPage.clickOnCreateButton();

    await promise.all([]);

    await doctorUpdatePage.save();
    expect(await doctorUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await doctorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Doctor', async () => {
    const nbButtonsBeforeDelete = await doctorComponentsPage.countDeleteButtons();
    await doctorComponentsPage.clickOnLastDeleteButton();

    doctorDeleteDialog = new DoctorDeleteDialog();
    expect(await doctorDeleteDialog.getDialogTitle()).to.eq('instantHelpFinderApp.doctor.delete.question');
    await doctorDeleteDialog.clickOnConfirmButton();

    expect(await doctorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
