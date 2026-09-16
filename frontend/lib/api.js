import axios from 'axios';
 const TOKEN_KEY = 'sh_token';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return data;
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function applyPromo(code, subtotal) {
  const { data } = await api.post('/promo/apply', {
    code,
    subtotal,
  });

  return data;
}

export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data;
}

export async function submitContactForm(payload) {
  const { data } = await api.post('/contact', payload);
  return data;
}

// Track an order using the customer's Order ID.
export async function trackOrder(orderId) {
  const { data } = await api.get(
    `/orders/track/${orderId}`
  );

  return data.order;
}
export const fetchProducts = getProducts;
export const fetchProductById = getProduct;
