import { IProduct } from "../../../types/products/product.types.js";
import { SalesPortalPage } from "../base/salesPortal.page.js";

export class SubmitProductPage extends SalesPortalPage {
  readonly "Name input" = "#inputName";
  readonly "Price input" = "#inputPrice";
  readonly "Amount input" = "#inputAmount";
  readonly "Manufacturer input" = "#inputManufacturer";
  readonly "Manufacturer options" = `${this["Manufacturer input"]} option`;
  readonly "Notes input" = "#textareaNotes";
  readonly "Back button" = "#back-to-products-page";

  async fillProductInputs(product: IProduct) {
    await this.setValue(this["Name input"], product.name);
    await this.selectDropdownValue(this["Manufacturer input"], this["Manufacturer options"], product.manufacturer);
    await this.setValue(this["Price input"], `${product.price}`);
    await this.setValue(this["Amount input"], `${product.amount}`);

    if (product.notes) {
      await this.setValue(this["Notes input"], product.notes);
    }
    await browser.pause(200);
  }
}
