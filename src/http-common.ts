import { computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store';

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1", //后端地址
  headers: {
    'Content-type': 'application/json',
    // 'Authorization': `Bearer ${token.value}`
  },
})

apiClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  const authStore = useAuthStore();
  const token = computed(() => authStore.token).value
  if (token) {
    config.headers.Authorization  = `Bearer ${token}`
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export default apiClient
