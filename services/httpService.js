import axios from 'axios'

export const httpService = axios.create({
  headers: {
    'Cache-Control': 'no-cache',
    Expires: '-1',
    Pragma: 'no-cache',
  },
  baseURL: 'http://localhost:8009',
  timeout: 60 * 4 * 1000,
})
