import { SalesPortalPage } from "../salesPortal.page.js";

class ProductsListPage extends SalesPortalPage {
  get ["Add new product button"]() {
    return $("button.page-title-header");
  }

  get ["Table row selector"]() {
    return (productName: string) => `//tr[./td[text()="${productName}"]]`;
  }

  get ["Name by product name"]() {
    return (productName: string) => `${this["Table row selector"](productName)}/td[1]`;
  }

  get ["Price by product name"]() {
    return (productName: string) => `${this["Table row selector"](productName)}/td[2]`;
  }

  get ["Manufacturer by product name"]() {
    return (productName: string) => `${this["Table row selector"](productName)}/td[3]`;
  }

  get ["Created by product name"]() {
    return (productName: string) => `${this["Table row selector"](productName)}/td[4]`;
  }

  get ["Actions by product name"]() {
    return (productName: string) => `${this["Table row selector"](productName)}/td[5]`;
  }

  get ["Details button by product name"]() {
    return (productName: string) => `${this["Actions by product name"](productName)}/button[@title="Details"]`;
  }

  get ["Edit button by product name"]() {
    return (productName: string) => `${this["Actions by product name"](productName)}/button[@title="Edit"]`;
  }

  get ["Delete button by product name"]() {
    return (productName: string) => `${this["Actions by product name"](productName)}/button[@title="Delete"]`;
  }
}

export default new ProductsListPage();
