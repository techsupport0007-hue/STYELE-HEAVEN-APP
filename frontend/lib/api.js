import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sh_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchProducts({ page = 1, limit = 12, category, filter, q, sort } = {}) {
  const { data } = await api.get('/products', {
    params: { page, limit, category, filter, q, sort },
  });
  return data; // { products, total, page, pages }
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
}

export async function applyPromo(code, subtotal) {
  const { data } = await api.post('/promo/apply', { code, subtotal });
  return data; // { valid, discount, message }
}

export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data; // { order }
}

export async function submitContactForm(payload) {
  const { data } = await api.post('/contact', payload);
  return data;
}

export async function trackOrder(trackingId) {
  const { data } = await api.get(`/orders/track/${trackingId}`);
  return data.order;
}
