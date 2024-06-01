import { SalesPortalPage } from "./salesPortal.page.js";

class HomePage extends SalesPortalPage {
  get ["Products button"]() {
    return "#products-from-home";
  }
}

export default new HomePage();
