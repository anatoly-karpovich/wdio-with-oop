import { BasePage } from "./base.page.js";

export class SalesPortalPage extends BasePage {
  readonly spinner = ".spinner-border";

  readonly "Notification message" = `.toast-body`;
  readonly "Close Notification button" = `#toast button`;
  readonly "User Dropdown" = `#dropdownUser1`;
  readonly "SignOut button" = `a#signOut`;

  async waitForSpinnerToHide() {
    await this.waitForElement(this.spinner, false, 10000);
  }

  async waitForPageIsLoaded() {
    await this.waitForSpinnerToHide();
  }

  async validateNotification(message: string) {
    await this.waitForElement(this["Notification message"]);
    const actualMessage = await this.getText(this["Notification message"]);
    expect(actualMessage).toBe(message);
    await this.click(this["Close Notification button"]);
    await this.waitForElement(this["Notification message"], false);
  }

  async signOut() {
    await this.click(this["User Dropdown"]);
    await this.click(this["SignOut button"]);
  }
}
