import { IResponseFields } from "../../types/api/apiClient.types.js";

export interface IProduct {
  name: string;
  price: number;
  amount: number;
  notes?: string;
  manufacturer: string;
}

export interface IProductFromResponse extends IProduct {
  _id: string;
  createdOn: string;
}

export interface IProductResponse extends IResponseFields {
  Product: IProductFromResponse;
}

export interface IProductsResponse extends IResponseFields {
  Product: IProductFromResponse[];
}

export const manufacturerNames = ["Apple", "Samsung", "Google", "Microsoft", "Sony", "Xiaomi", "Amazon", "Tesla"] as const;
