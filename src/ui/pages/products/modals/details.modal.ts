import { SalesPortalPage } from "../../base/salesPortal.page.js";

export class DetailsModal extends SalesPortalPage {
  readonly "Row Value by Key" = (key: string) => `//div[./strong[contains(text(), "${key}")]]/div`;
  readonly "Edit button" = `.modal-footer button:first-child`;
  readonly "Cancel button" = `.modal-footer button:last-child`;
}
