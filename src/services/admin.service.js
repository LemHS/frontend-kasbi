import api from "./api";

export const adminService = {
  // --- DOCUMENT MANAGEMENT ---
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/v1/admin/insertdoc", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getDocuments(offset = 0, limit = 10) {
    const response = await api.get("/v1/admin/documents", {
      params: { offset, limit, descending: true },
    });
    return response.data;
  },

  async deleteDocument(documentId) {
    const response = await api.delete("/v1/admin/deldoc", {
      data: { document_id: documentId },
    });
    return response.data;
  },

  // --- USER MANAGEMENT (ADMINS) ---

  // GET: Available to standard Admins (admin_router)
  async getUsers(offset = 0, limit = 10) {
    const response = await api.get("/v1/admin/users", {
      params: { offset, limit, descending: true },
    });
    return response.data;
  },

  // POST: Create User (super_admin_router)
  async createUser(userData) {
    // userData: { username, email, password }
    const response = await api.post("/v1/superadmin/users", userData);
    return response.data;
  },

  // PUT: Update User (super_admin_router)
  async updateUser(userId, updateData) {
    // updateData: { full_name, password, is_active, username, email }
    const response = await api.put(`/v1/superadmin/users/${userId}`, updateData);
    return response.data;
  },

  // DELETE: Delete User (super_admin_router)
  async deleteUser(userData) {
    // userData: { username, email } - Python API requires body for verification
    const response = await api.delete("/v1/superadmin/users", {
      data: userData,
    });
    return response.data;
  },
};