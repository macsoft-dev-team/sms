import { apiClient } from "./apiClient";

export const apiService = {
  get: (url, config) => apiClient.get(url, config).then((res) => res.data),
  post: (url, data, config) => apiClient.post(url, data, config).then((res) => res.data),
  put: (url, data, config) => apiClient.put(url, data, config).then((res) => res.data),
  patch: (url, data, config) => apiClient.patch(url, data, config).then((res) => res.data),
  delete: (url, config) => apiClient.delete(url, config).then((res) => res.data),
};

export function getPayload(body) {
  return body?.data ?? body;
}

export function getMeta(body) {
  return body?.meta ?? null;
}
