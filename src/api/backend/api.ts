import axios from 'axios';

export const gamersCore = axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, withCredentials: true });

export const gamersCoreAdmin = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`,
  withCredentials: true,
});
