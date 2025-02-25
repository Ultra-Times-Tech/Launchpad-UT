import axios from 'axios';

const apiUrl: string = import.meta.env.VITE_APP_API_URL || ''

export const apiRequestor = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})