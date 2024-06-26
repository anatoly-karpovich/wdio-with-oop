import { SignInApiService } from "../../../api/services/signIn.service.js";
import { ADMIN_PASSWORD, ADMIN_USERNAME, TESTS } from "../../../config/environment.js";
import { ICredentials } from "../../../types/request/requestTypes.js";
import { logStep } from "../../../utils/reporter/decorators.js";
import homePage from "../../../ui/pages/home.page.js";
import signInPage from "../../../ui/pages/signIn/signIn.page.js";

export class SignInService {
  static instance: SignInService;
  private signInPage = signInPage;
  private homePage = homePage;

  private token: string | null = null;

  constructor(token?: string, private service: SignInApiService = new SignInApiService()) {
    if (SignInService.instance) {
      return SignInService.instance;
    }
    if (token) this.token = token;
    SignInService.instance = this;
  }

  async getToken(): Promise<string> {
    if (this.token) return this.transformToken();

    const token = TESTS === "ui" ? await this.getTokenFromBrowser() : await this.getAdminToken();
    if (!token) throw new Error("Failed to get token: no token");
    return this.transformToken();
  }

  private async getTokenFromBrowser() {
    await browser.waitUntil(
      async () => {
        return (await browser.getCookies("Authorization"))[0]?.value;
      },
      { timeout: 5000, timeoutMsg: `No authorization token in cookies` }
    );
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

  @logStep("Sign in via UI")
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

  @logStep("Open Sales Portal")
  async openSalesPortal() {
    await this.signInPage.openPage("https://anatoly-karpovich.github.io/aqa-course-project/#");
  }

  transformToken() {
    return `Bearer ${this.token}`;
  }

  @logStep("Sign Out")
  async signOut() {
    if (TESTS === "ui") {
      await this.homePage.signOut();
    }
  }
}
