import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RequestComponentsPage, RequestDeleteDialog, RequestUpdatePage } from './request.page-object';

const expect = chai.expect;

describe('Request e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let requestComponentsPage: RequestComponentsPage;
  let requestUpdatePage: RequestUpdatePage;
  let requestDeleteDialog: RequestDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Requests', async () => {
    await navBarPage.goToEntity('request');
    requestComponentsPage = new RequestComponentsPage();
    await browser.wait(ec.visibilityOf(requestComponentsPage.title), 5000);
    expect(await requestComponentsPage.getTitle()).to.eq('instantHelpFinderApp.request.home.title');
    await browser.wait(ec.or(ec.visibilityOf(requestComponentsPage.entities), ec.visibilityOf(requestComponentsPage.noResult)), 1000);
  });

  it('should load create Request page', async () => {
    await requestComponentsPage.clickOnCreateButton();
    requestUpdatePage = new RequestUpdatePage();
    expect(await requestUpdatePage.getPageTitle()).to.eq('instantHelpFinderApp.request.home.createOrEditLabel');
    await requestUpdatePage.cancel();
  });

  it('should create and save Requests', async () => {
    const nbButtonsBeforeCreate = await requestComponentsPage.countDeleteButtons();

    await requestComponentsPage.clickOnCreateButton();

    await promise.all([
      requestUpdatePage.setLocationInput('location'),
      requestUpdatePage.doctorSelectLastOption(),
      requestUpdatePage.icuNurseSelectLastOption()
      // requestUpdatePage.assistantsSelectLastOption(),
    ]);

    expect(await requestUpdatePage.getLocationInput()).to.eq('location', 'Expected Location value to be equals to location');

    await requestUpdatePage.save();
    expect(await requestUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await requestComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Request', async () => {
    const nbButtonsBeforeDelete = await requestComponentsPage.countDeleteButtons();
    await requestComponentsPage.clickOnLastDeleteButton();

    requestDeleteDialog = new RequestDeleteDialog();
    expect(await requestDeleteDialog.getDialogTitle()).to.eq('instantHelpFinderApp.request.delete.question');
    await requestDeleteDialog.clickOnConfirmButton();

    expect(await requestComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
