export const createdProductSchema = {
  type: "object",
  properties: {
    Product: {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        amount: { type: "integer" },
        price: { type: "integer" },
        manufacturer: { type: "string" },
        createdOn: { type: "string" },
        notes: { type: "string" },
      },
      required: ["_id", "name", "amount", "price", "manufacturer", "createdOn"],
    },
    IsSuccess: { type: "boolean" },
    ErrorMessage: { type: "null" },
  },
  required: ["Product", "IsSuccess", "ErrorMessage"],
};

export const productWithErrorSchema = {
  type: "object",
  properties: {
    IsSuccess: { type: "boolean" },
    ErrorMessage: { type: "string" },
  },
  required: ["IsSuccess", "ErrorMessage"],
};
