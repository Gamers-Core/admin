import { isClient } from '@/helpers';
import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

export const gamersCore = axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, withCredentials: true });

export const gamersCoreAdmin = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`,
  withCredentials: true,
});

const hydrateReq = async (config: InternalAxiosRequestConfig) => {
  const headers = AxiosHeaders.from(config.headers);

  if (!isClient()) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
    headers.set('Cookie', cookieHeader);
  }

  config.headers = headers;
  return config;
};

gamersCore.interceptors.request.use(hydrateReq);
gamersCoreAdmin.interceptors.request.use(hydrateReq);
