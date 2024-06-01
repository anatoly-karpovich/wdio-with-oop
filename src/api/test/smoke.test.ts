import { ApiClientFactory } from "../apiClients/apiClient.js";
import type { IRequestOptions } from "../../types/api/apiClient.types.js";
import { ILoginResponse } from "../../types/user/user.types.js";

const apiClient = ApiClientFactory.getClient();

describe("Product Api tests", () => {
  // beforeEach(async () => {
  //   token = (await signInService.login({ email: "aqacourse@gmail.com", password: "password" })).data.token;
  // });

  it("Should create product", async () => {
    const requestData: IRequestOptions = {
      method: "post",
      baseURL: "https://aqa-course-project.app/",
      url: "/api/login/",
      headers: { "Content-Type": "application/json" },
      data: { username: "aqacourse@gmail.com", password: "password" },
    };

    const sn = await apiClient.sendRequest<ILoginResponse>(requestData);
    console.log(sn);
    const token = sn.data.token;

    const productData = {
      name: `A${Date.now()}`,
      price: 100,
      amount: 100,
      notes: "aaa",
      manufacturer: "Apple",
    };

    const productRequestData: IRequestOptions = {
      method: "post",
      baseURL: "https://aqa-course-project.app/",
      url: "/api/products/",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      data: productData,
    };
    const productResponseBody = await apiClient.sendRequest(productRequestData);
    console.log(productResponseBody);
  });
});
