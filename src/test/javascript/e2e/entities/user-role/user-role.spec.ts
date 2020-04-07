import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UserRoleComponentsPage, UserRoleDeleteDialog, UserRoleUpdatePage } from './user-role.page-object';

const expect = chai.expect;

describe('UserRole e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let userRoleComponentsPage: UserRoleComponentsPage;
  let userRoleUpdatePage: UserRoleUpdatePage;
  let userRoleDeleteDialog: UserRoleDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load UserRoles', async () => {
    await navBarPage.goToEntity('user-role');
    userRoleComponentsPage = new UserRoleComponentsPage();
    await browser.wait(ec.visibilityOf(userRoleComponentsPage.title), 5000);
    expect(await userRoleComponentsPage.getTitle()).to.eq('instantHelpFinderApp.userRole.home.title');
    await browser.wait(ec.or(ec.visibilityOf(userRoleComponentsPage.entities), ec.visibilityOf(userRoleComponentsPage.noResult)), 1000);
  });

  it('should load create UserRole page', async () => {
    await userRoleComponentsPage.clickOnCreateButton();
    userRoleUpdatePage = new UserRoleUpdatePage();
    expect(await userRoleUpdatePage.getPageTitle()).to.eq('instantHelpFinderApp.userRole.home.createOrEditLabel');
    await userRoleUpdatePage.cancel();
  });

  it('should create and save UserRoles', async () => {
    const nbButtonsBeforeCreate = await userRoleComponentsPage.countDeleteButtons();

    await userRoleComponentsPage.clickOnCreateButton();

    await promise.all([userRoleUpdatePage.pushSubscrioptionSelectLastOption()]);

    await userRoleUpdatePage.save();
    expect(await userRoleUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await userRoleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last UserRole', async () => {
    const nbButtonsBeforeDelete = await userRoleComponentsPage.countDeleteButtons();
    await userRoleComponentsPage.clickOnLastDeleteButton();

    userRoleDeleteDialog = new UserRoleDeleteDialog();
    expect(await userRoleDeleteDialog.getDialogTitle()).to.eq('instantHelpFinderApp.userRole.delete.question');
    await userRoleDeleteDialog.clickOnConfirmButton();

    expect(await userRoleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
