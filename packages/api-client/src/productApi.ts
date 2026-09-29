import axios from "axios";

export class ProductApiClient {
  constructor(private baseUrl: string) {}

  async getProducts(params?: Record<string, unknown>) {
    const res = await axios.get(`${this.baseUrl}/products`, { params });
    return res.data;
  }

  async getProductById(id: string) {
    const res = await axios.get(`${this.baseUrl}/products/${id}`);
    return res.data;
  }
}
