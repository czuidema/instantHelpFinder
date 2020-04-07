import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PushSubscriptionComponentsPage, PushSubscriptionDeleteDialog, PushSubscriptionUpdatePage } from './push-subscription.page-object';

const expect = chai.expect;

describe('PushSubscription e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pushSubscriptionComponentsPage: PushSubscriptionComponentsPage;
  let pushSubscriptionUpdatePage: PushSubscriptionUpdatePage;
  let pushSubscriptionDeleteDialog: PushSubscriptionDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load PushSubscriptions', async () => {
    await navBarPage.goToEntity('push-subscription');
    pushSubscriptionComponentsPage = new PushSubscriptionComponentsPage();
    await browser.wait(ec.visibilityOf(pushSubscriptionComponentsPage.title), 5000);
    expect(await pushSubscriptionComponentsPage.getTitle()).to.eq('instantHelpFinderApp.pushSubscription.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(pushSubscriptionComponentsPage.entities), ec.visibilityOf(pushSubscriptionComponentsPage.noResult)),
      1000
    );
  });

  it('should load create PushSubscription page', async () => {
    await pushSubscriptionComponentsPage.clickOnCreateButton();
    pushSubscriptionUpdatePage = new PushSubscriptionUpdatePage();
    expect(await pushSubscriptionUpdatePage.getPageTitle()).to.eq('instantHelpFinderApp.pushSubscription.home.createOrEditLabel');
    await pushSubscriptionUpdatePage.cancel();
  });

  it('should create and save PushSubscriptions', async () => {
    const nbButtonsBeforeCreate = await pushSubscriptionComponentsPage.countDeleteButtons();

    await pushSubscriptionComponentsPage.clickOnCreateButton();

    await promise.all([
      pushSubscriptionUpdatePage.setEndpointInput('endpoint'),
      pushSubscriptionUpdatePage.setAuthInput('auth'),
      pushSubscriptionUpdatePage.setP256dhInput('p256dh')
    ]);

    expect(await pushSubscriptionUpdatePage.getEndpointInput()).to.eq('endpoint', 'Expected Endpoint value to be equals to endpoint');
    expect(await pushSubscriptionUpdatePage.getAuthInput()).to.eq('auth', 'Expected Auth value to be equals to auth');
    expect(await pushSubscriptionUpdatePage.getP256dhInput()).to.eq('p256dh', 'Expected P256dh value to be equals to p256dh');

    await pushSubscriptionUpdatePage.save();
    expect(await pushSubscriptionUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await pushSubscriptionComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last PushSubscription', async () => {
    const nbButtonsBeforeDelete = await pushSubscriptionComponentsPage.countDeleteButtons();
    await pushSubscriptionComponentsPage.clickOnLastDeleteButton();

    pushSubscriptionDeleteDialog = new PushSubscriptionDeleteDialog();
    expect(await pushSubscriptionDeleteDialog.getDialogTitle()).to.eq('instantHelpFinderApp.pushSubscription.delete.question');
    await pushSubscriptionDeleteDialog.clickOnConfirmButton();

    expect(await pushSubscriptionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
