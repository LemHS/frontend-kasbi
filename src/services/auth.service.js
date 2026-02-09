import api from "./api";

export const authService = {
  async login(credentials) {
    // Matches router prefix="/v1/auth"
    const response = await api.post("/v1/auth/login", credentials);
    return response.data;
  },

  async register(data) {
    const response = await api.post("/v1/auth/register", data);
    return response.data;
  },

  async logout() {
    const response = await api.post("/v1/auth/logout");
    return response.data;
  },
};