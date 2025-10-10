import axios from "axios";
import { getContentSecurity, AUTH, getCookie } from "./utils";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_PREFIX + "/api/v1";
axios.defaults.headers.common["mid"] = "4b15e314-803e-4335-bac5-f62050dca1f2";
axios.defaults.headers.common["client"] = "webapp";
axios.defaults.headers.common["cversion"] = "20000";

axios.interceptors.request.use(
  (config) => {
    const { method, url, data, params, headers } = config;

    const contentSecurity = getContentSecurity({
      method: method?.toUpperCase() ?? "GET",
      path: "/api/v1" + url,
      query: params ? new URLSearchParams(params).toString() : "",
      body: data ? JSON.stringify(data) : "",
    });
    headers.set("X-Content-Security", contentSecurity);

    // Add auth token if available
    const token = getCookie(AUTH);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axios;
