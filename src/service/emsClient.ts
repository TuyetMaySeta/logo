import { API_URL } from "@/config/config";
import axios from "axios";
import authStore from "@/stores/authStore";
import { toast } from "sonner";


const toastExcludedEndpoints = [
  "/auth/refresh",       // ví dụ endpoint refresh token
  "/webhooks/receive",   // ví dụ webhook nội bộ
  "/health",             // ví dụ health check
  "/orgs/employees/drafts/me"
];

const emsClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
  timeoutErrorMessage: "Request timed out. Please try again later.",
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

emsClient.interceptors.request.use((config) => {
  const accessToken = authStore.getState().access_token;
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

emsClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 🚦 Nếu đang refresh → đợi xong rồi retry
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(emsClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authStore.getState().refreshToken();
        const newAccessToken = authStore.getState().access_token;
        if (newAccessToken) {
          onRefreshed(newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return emsClient(originalRequest);
        } else {
          return Promise.reject(new Error("Failed to refresh access token"));
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else {
      const errorCode = error.response?.data?.error?.code;
      const errorData = error.response?.data?.error;
      const status = error.response?.status;

      if (status === 422 && errorCode === "VALIDATION_ERROR" && errorData?.details) {
        let messages: string[] = [];
        for (const detail of errorData.details) {
          toast.error(`Validation failed:\n${detail.msg}`);
          messages.push(detail.msg);
        }

        return Promise.reject(new Error(messages.join("\n")));
      }
      const message = error.response?.data?.error?.message || "An error occurred";

      // 🧩 Kiểm tra nếu endpoint không nằm trong danh sách loại trừ
      const shouldToast = !toastExcludedEndpoints.some((endpoint) =>
        originalRequest.url.includes(endpoint)
      );

      if (shouldToast) {
        toast.error(message);
      }

      return Promise.reject(new Error(message));
    }
  }
);

export default emsClient;
