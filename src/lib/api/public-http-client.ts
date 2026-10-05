import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) throw new Error("Falta configurar VITE_API_URL");

/**
 * Cliente HTTP para los endpoints públicos del backend
 */
export const publicHttpClient = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});
