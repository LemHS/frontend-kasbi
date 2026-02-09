import api from "./api";

export const chatService = {
  /**
   * Send a message to the chatbot.
   * @param {string} query - The user's message.
   * @param {string|number|null} threadId - The current conversation ID.
   */
  async sendMessage(query, threadId = null) {
    const payload = {
      query: query,
      thread_id: threadId ? parseInt(threadId) : null,
    };
    // Matches router prefix="/v1/chatbot"
    const response = await api.post("/v1/chatbot/query", payload);
    return response.data;
  },

  /**
   * Get list of threads (if needed in future).
   */
  async getThreads() {
    const response = await api.get("/v1/chatbot/threads");
    return response.data;
  },

  /**
   * Get chat history for a specific thread.
   * @param {string|number} threadId 
   */
  async getHistory(threadId) {
    const response = await api.get("/v1/chatbot/history", {
      params: { thread_id: threadId },
    });
    return response.data;
  },
};