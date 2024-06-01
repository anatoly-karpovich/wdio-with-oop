import { BasePage } from "./base.page.js";

export class SalesPortalPage extends BasePage {
  get Spinner() {
    return ".spinner-border";
  }

  async waitForSpinnerToHide() {
    await this.waitForElement(this.Spinner, false, 10000);
  }

  async waitForPageIsLoaded() {
    await this.waitForSpinnerToHide();
  }
}
