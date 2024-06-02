import { SalesPortalPage } from "../base/salesPortal.page.js";

class EditProductPage extends SalesPortalPage {
  readonly "Name input" = "#inputName";
  readonly "Price input" = "#inputPrice";
  readonly "Amount input" = "#inputAmount";
  readonly "Notes input" = "#textareaNotes";
  readonly "Save New Product button" = "#save-new-product";
}

export default new EditProductPage();
