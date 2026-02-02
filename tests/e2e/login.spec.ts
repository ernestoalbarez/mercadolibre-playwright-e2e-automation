import { test } from '../../fixtures/testFixtures';

test.describe('MercadoLibre - Login', () => {
  test('should display an error message when an invalid username is submitted', async ({
    homePage,
    loginPage,
  }) => {
    await homePage.openLogin();
    await loginPage.submitUsername('invalid-user@test');
    await loginPage.expectIdentificationError();
  });
});
