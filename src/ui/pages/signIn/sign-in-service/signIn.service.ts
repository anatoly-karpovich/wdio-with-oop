import { SignInApiService } from "../../../../api/services/signIn.service.js";
import { ADMIN_PASSWORD, ADMIN_USERNAME, TESTS } from "../../../../config/environment.js";
import { ICredentials } from "../../../../types/request/requestTypes.js";
import signInPage from "../signIn.page.js";

export class SignInService {
  private signInPage = signInPage;
  private service: SignInApiService;

  private token: string | null = null;

  constructor(token?: string) {
    if (token) this.token = token;
    this.service = new SignInApiService();
  }

  async getToken(): Promise<string> {
    const token = TESTS === "ui" ? await this.getTokenFromBrowser() : await this.getAdminToken();
    if (!token) throw new Error("Failed to get token: no token");
    return `Bearer ${token}`;
  }

  private async getTokenFromBrowser() {
    this.token = (await browser.getCookies("Authorization"))[0]?.value;
    return this.token;
  }

  private async getAdminToken() {
    if (!this.token) {
      await this.signInAsAdminAPI();
    }
    return this.token;
  }

  async setToken(token: string) {
    this.token = token;
  }

  async signInUI(credentials: ICredentials) {
    await this.signInPage.fillCredentialsInputs(credentials);
    await this.signInPage.clickSubmitButton();
    await this.signInPage.waitForPageIsLoaded();
    this.token = await this.getTokenFromBrowser();
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
    return await this.getToken();
  }

  async signInAsAdminAPI() {
    return await this.signInAPI({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
  }

  async openSalesPortal() {
    await this.signInPage.openPage("https://anatoly-karpovich.github.io/aqa-course-project/#");
  }
}
