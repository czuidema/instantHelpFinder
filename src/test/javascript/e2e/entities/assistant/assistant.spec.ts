import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AssistantComponentsPage, AssistantDeleteDialog, AssistantUpdatePage } from './assistant.page-object';

const expect = chai.expect;

describe('Assistant e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let assistantComponentsPage: AssistantComponentsPage;
  let assistantUpdatePage: AssistantUpdatePage;
  let assistantDeleteDialog: AssistantDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Assistants', async () => {
    await navBarPage.goToEntity('assistant');
    assistantComponentsPage = new AssistantComponentsPage();
    await browser.wait(ec.visibilityOf(assistantComponentsPage.title), 5000);
    expect(await assistantComponentsPage.getTitle()).to.eq('instantHelpFinderApp.assistant.home.title');
    await browser.wait(ec.or(ec.visibilityOf(assistantComponentsPage.entities), ec.visibilityOf(assistantComponentsPage.noResult)), 1000);
  });

  it('should load create Assistant page', async () => {
    await assistantComponentsPage.clickOnCreateButton();
    assistantUpdatePage = new AssistantUpdatePage();
    expect(await assistantUpdatePage.getPageTitle()).to.eq('instantHelpFinderApp.assistant.home.createOrEditLabel');
    await assistantUpdatePage.cancel();
  });

  it('should create and save Assistants', async () => {
    const nbButtonsBeforeCreate = await assistantComponentsPage.countDeleteButtons();

    await assistantComponentsPage.clickOnCreateButton();

    await promise.all([]);

    await assistantUpdatePage.save();
    expect(await assistantUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await assistantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Assistant', async () => {
    const nbButtonsBeforeDelete = await assistantComponentsPage.countDeleteButtons();
    await assistantComponentsPage.clickOnLastDeleteButton();

    assistantDeleteDialog = new AssistantDeleteDialog();
    expect(await assistantDeleteDialog.getDialogTitle()).to.eq('instantHelpFinderApp.assistant.delete.question');
    await assistantDeleteDialog.clickOnConfirmButton();

    expect(await assistantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
