import { Customer } from "../../../data/customers/customer.js";
import { generateNewCustomer } from "../../../data/customers/customerGeneration.js";

describe("[Customers] [Smoke]", () => {
  let customer: Customer | null;

  it("Should create customer", async () => {
    const customerData = generateNewCustomer();
    customer = await Customer.create(customerData);
    expect(customer.getCustomerFieldsFromSettings()).toMatchObject({ ...customerData });
  });

  it("Should update customer", async () => {
    const customerData = generateNewCustomer();
    customer = await Customer.create(customerData);
    await customer.edit({ ...customerData, _id: customer.getSettings()._id });
    expect(customer.getCustomerFieldsFromSettings()).toMatchObject({ ...customerData });
  });

  afterEach(async () => {
    if (customer) {
      await customer.delete();
    }
    customer = null;
  });
});
