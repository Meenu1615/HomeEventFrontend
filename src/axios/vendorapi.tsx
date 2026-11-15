
import axios from "axios";

// 1. Base URL
const BASE_URL =
  (import.meta as any).env?.VITE_API_URL ||
  "http://localhost:2005/vendor";

// 2. Axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// 3. Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Let Axios/browser set multipart boundary automatically
    if (config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 4. Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "Vendor API error:",
      error.response?.status,
      error.response?.data || error.message
    );

    // Preserve the original Axios error and response
    return Promise.reject(error);
  }
);

// 5. Fetch vendor by email
export const fetchVendorByEmail = (emailid: string) => {
  return apiClient.get("/fetch", {
    params: {
      emailid: emailid.trim(),
    },
  });
};

// 6. Register vendor
export const registerVendor = (payload: FormData) => {
  return apiClient.post("/register", payload);
};

// 7. Update vendor
export const updateVendor = (payload: FormData) => {
  return apiClient.put("/update", payload);
};

export default apiClient;