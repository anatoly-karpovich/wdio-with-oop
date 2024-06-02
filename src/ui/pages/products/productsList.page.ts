import { SalesPortalPage } from "../base/salesPortal.page.js";

class ProductsListPage extends SalesPortalPage {
  readonly "Add new product button": string = "button.page-title-header";
  readonly "Table row selector" = (productName: string) => `//tr[./td[text()="${productName}"]]`;
  readonly "Name by product name" = (productName: string) => `${this["Table row selector"](productName)}/td[1]`;
  readonly "Price by product name" = (productName: string) => `${this["Table row selector"](productName)}/td[2]`;
  readonly "Manufacturer by product name" = (productName: string) => `${this["Table row selector"](productName)}/td[3]`;
  readonly "Created by product name" = (productName: string) => `${this["Table row selector"](productName)}/td[4]`;
  readonly "Actions by product name" = (productName: string) => `${this["Table row selector"](productName)}/td[5]`;
  readonly "Details button by product name" = (productName: string) => `${this["Actions by product name"](productName)}/button[@title="Details"]`;
  readonly "Edit button by product name" = (productName: string) => `${this["Actions by product name"](productName)}/button[@title="Edit"]`;
  readonly "Delete button by product name" = (productName: string) => `${this["Actions by product name"](productName)}/button[@title="Delete"]`;

  async clickOnAddNewProductButton() {
    await this.click(this["Add new product button"]);
  }

  async openProductDetails(productName: string) {
    await this.click(this["Details button by product name"](productName));
  }
}

export default new ProductsListPage();
