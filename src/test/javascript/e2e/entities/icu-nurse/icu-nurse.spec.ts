import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ICUNurseComponentsPage, ICUNurseDeleteDialog, ICUNurseUpdatePage } from './icu-nurse.page-object';

const expect = chai.expect;

describe('ICUNurse e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let iCUNurseComponentsPage: ICUNurseComponentsPage;
  let iCUNurseUpdatePage: ICUNurseUpdatePage;
  let iCUNurseDeleteDialog: ICUNurseDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ICUNurses', async () => {
    await navBarPage.goToEntity('icu-nurse');
    iCUNurseComponentsPage = new ICUNurseComponentsPage();
    await browser.wait(ec.visibilityOf(iCUNurseComponentsPage.title), 5000);
    expect(await iCUNurseComponentsPage.getTitle()).to.eq('instantHelpFinderApp.iCUNurse.home.title');
    await browser.wait(ec.or(ec.visibilityOf(iCUNurseComponentsPage.entities), ec.visibilityOf(iCUNurseComponentsPage.noResult)), 1000);
  });

  it('should load create ICUNurse page', async () => {
    await iCUNurseComponentsPage.clickOnCreateButton();
    iCUNurseUpdatePage = new ICUNurseUpdatePage();
    expect(await iCUNurseUpdatePage.getPageTitle()).to.eq('instantHelpFinderApp.iCUNurse.home.createOrEditLabel');
    await iCUNurseUpdatePage.cancel();
  });

  it('should create and save ICUNurses', async () => {
    const nbButtonsBeforeCreate = await iCUNurseComponentsPage.countDeleteButtons();

    await iCUNurseComponentsPage.clickOnCreateButton();

    await promise.all([]);

    await iCUNurseUpdatePage.save();
    expect(await iCUNurseUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await iCUNurseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ICUNurse', async () => {
    const nbButtonsBeforeDelete = await iCUNurseComponentsPage.countDeleteButtons();
    await iCUNurseComponentsPage.clickOnLastDeleteButton();

    iCUNurseDeleteDialog = new ICUNurseDeleteDialog();
    expect(await iCUNurseDeleteDialog.getDialogTitle()).to.eq('instantHelpFinderApp.iCUNurse.delete.question');
    await iCUNurseDeleteDialog.clickOnConfirmButton();

    expect(await iCUNurseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
