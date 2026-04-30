import axios from 'axios';

// Cria a instância do Axios apontando para o nosso backend Node.js
const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

// Interceptor: injeta o Token JWT automaticamente em todas as requisições futuras
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('grao_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;