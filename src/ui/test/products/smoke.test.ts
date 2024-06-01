import { SignInService } from "../../pages/signIn/sign-in-service/signIn.service.js";

const signInService = new SignInService();

describe("Products smoke test", () => {
  beforeEach(async () => {});
  it("Should create smoke product", async () => {
    await signInService.openSalesPortal();
    await signInService.signInAsAdminUI();
  });
});
