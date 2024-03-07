import axios from 'axios'

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1", //后端地址
  headers: {
    'Content-type': 'application/json',
  },
})

export default apiClient
