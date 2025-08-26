import axios from "axios";

export const api = {
  fetchProducts: async () => {
    const response = await axios.get("http://192.168.1.103:3000/products/list");
    if (response.status !== 200) throw new Error("Falha na requisição");
    return response.data;
  },

  fetchOrders: async () => {
    const response = await axios.get("http://192.168.1.103:3000/orders/list");
    if (response.status !== 200) throw new Error("Falha na requisição");
    return response.data;
  },

  async createOrder(order: { items: { productId: number; quantity: number; price: number }[] }) {
    const res = await axios.post("http://192.168.1.103:3000/orders/create", order);
    return res.data;
  },

  async deleteOrder(id: number) {
    const res = await axios.delete(`http://192.168.1.103:3000/orders/${id}`);
    return res.data;
  }

};
