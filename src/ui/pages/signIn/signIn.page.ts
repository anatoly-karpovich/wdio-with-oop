import { IUserCredentials } from "../../../types/user/user.types.js";
import { SalesPortalPage } from "../base/salesPortal.page.js";

class SignInPage extends SalesPortalPage {
  readonly "Email input" = "#emailinput";

  readonly "Password input" = "#passwordinput";

  readonly "Login button" = "button.btn-primary";

  async fillCredentialsInputs(credentials: IUserCredentials) {
    await this.setValue(this["Email input"], credentials.username);
    await this.setValue(this["Password input"], credentials.password, { isSecretValue: true });
  }

  async clickSubmitButton() {
    await this.click(this["Login button"]);
  }
}

export default new SignInPage();
