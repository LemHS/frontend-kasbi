import api from "./api";

export const adminService = {
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append("file", file);

    // Matches router prefix="/v1/admin"
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
};