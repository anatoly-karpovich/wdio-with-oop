import { Order } from "../../../data/orders/order.js";

describe("[Orders] [Smoke]", () => {
  it("Should create order in DRAFT status", async () => {
    const order = await Order.create();
    console.log(order.getSettings());
  });
});
