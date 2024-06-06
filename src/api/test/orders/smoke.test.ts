import { Customer } from "../../../data/customers/customer.js";
import { Order } from "../../../data/orders/order.js";
import { Product } from "../../../data/products/product.js";

describe("[Orders] [Smoke]", () => {
  let order: Order | null;
  it("Should create order in DRAFT status", async () => {
    const product1 = await Product.create();
    const product2 = await Product.create();
    const product3 = await Product.create();
    const customer = await Customer.create();
    order = await Order.create({ customer, products: [product1, product2, product3] });
  });

  it("Should create order from existing", async () => {
    const order = await Order.createFromExisting("666233c3c9ea708a58f0a05b");
    await order.addDelivery();
  });

  it("Should create order in IN PROCESS status", async () => {
    const product1 = await Product.create();
    const product2 = await Product.create();
    const product3 = await Product.create();
    const customer = await Customer.create();
    order = await Order.create({ customer, products: [product1, product2, product3] });
    await order.addDelivery();
    await order.processOrder();
  });

  afterEach(async () => {
    if (order) {
      await order.delete();
      order = null;
    }
  });
});
