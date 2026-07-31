import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue: Array<(success: boolean) => void> = [];

function resolveQueue(success: boolean) {
  pendingQueue.forEach((cb) => cb(success));
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((success) => {
          if (success) resolve(apiClient(originalRequest));
          else reject(error);
        });
      });
    }

    isRefreshing = true;
    try {
      await axios.post(
        "/api/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      resolveQueue(true);
      return apiClient(originalRequest);
    } catch (refreshError) {
      resolveQueue(false);
      const { useAuthStore } = await import("./auth-store");
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);