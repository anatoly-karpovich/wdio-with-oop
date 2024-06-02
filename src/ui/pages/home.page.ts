import { SalesPortalPage } from "./base/salesPortal.page.js";

class HomePage extends SalesPortalPage {
  readonly "Products button" = "#products-from-home";

  async openModulePage(moduleName: "Products" | "Customers" | "Orders") {
    if (moduleName === "Products") {
      await this.click(this["Products button"]);
    }
  }
}

export default new HomePage();
