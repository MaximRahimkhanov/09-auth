import axios from 'axios';

export const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

// export const api = axios.create({
//   baseURL: baseURL,
//   withCredentials: true,
// });
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});
