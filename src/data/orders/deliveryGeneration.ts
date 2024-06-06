import { DELIVERY_CONDITIONS, IDelivery } from "../../types/orders/order.types.js";
import moment from "moment";

export function generateDelivery(deliveryCondition: DELIVERY_CONDITIONS = DELIVERY_CONDITIONS.DELIVERY) {
  const delivery: IDelivery = {
    condition: deliveryCondition,
    finalDate: moment().add(5, "days").format("YYYY/MM/DD"),
    address: {
      city: "Vitebsk",
      country: "Belarus",
      flat: 20,
      house: 22,
      street: "Frunze",
    },
  };
  return delivery;
}
