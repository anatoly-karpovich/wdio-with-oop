import signInService from "../../../../api/services/signIn.service.js";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../../../config/environment.js";
import { ICredentials } from "../../../../types/request/requestTypes.js";
import signInPage from "../signIn.page.js";

export class SignInService {
  private signInPage = signInPage;
  private service = signInService;

  constructor(private token?: string) {}

  async getToken() {
    return this.token;
  }

  async getAdminToken() {
    return await this.signInAsAdminAPI();
  }

  async setToken(token: string) {
    this.token = token;
  }

  async signInUI(credentials: ICredentials) {
    await this.signInPage.fillCredentialsInputs(credentials);
    await this.signInPage.clickSubmitButton();
    await this.signInPage.waitForPageIsLoaded();
  }

  async signInAsAdminUI() {
    await this.signInUI({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
  }

  async signInAPI(credentials: ICredentials) {
    try {
      const response = await this.service.login(credentials);
      this.token = response.data.token;
    } catch (error) {
      throw new Error(`Failed to sign in via Api. Reason:\n${(error as Error).message}`);
    }

    return this.getToken();
  }

  async signInAsAdminAPI() {
    return await this.signInAPI({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
  }

  async openSalesPortal() {
    await this.signInPage.openPage("https://anatoly-karpovich.github.io/aqa-course-project/#");
  }
}
