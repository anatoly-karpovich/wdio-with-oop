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
    // const signInResponse = await fetch("https://aqa-course-project.app//api/login/", {
    //   method: "post",
    //   body: JSON.stringify({ username: "aqacourse@gmail.com", password: "password" }),
    //   headers: { "Content-Type": "application/json" },
    // });
    // const sn = await signInResponse.json();
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

    const productResponse = await fetch("https://aqa-course-project.app//api/products/", {
      method: "post",
      body: JSON.stringify(productData),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    const productResponseBody = await productResponse.json();

    console.log(productResponseBody);
  });

  // afterEach(async () => {
  //   await productService.delete(id, token);
  // });
});
