import api from "./api";

export const moderatorActionService = {
  // --- STUDENTI ---
  getAllStudents: async () => {
    const response = await api.get("api/moderator/materials/students");
    return response.data;
  },
  
  toggleStudentStatus: async (id, noviStatus) => {
    const response = await api.put(`api/moderator/materials/students/${id}/status`, { aktivan: noviStatus });
    return response.data;
  },

  // NOVE METODE ZA BRISANJE STUDENATA
  deleteStudent: async (studentId) => {
    try {
      const response = await api.delete(`api/moderator/materials/students/${studentId}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  // --- MATERIJALI (Lijeva kolona) ---
  getPendingMaterials: async () => {
    const response = await api.get("api/moderator/materials");
    return Array.isArray(response.data) ? response.data : [];
  },
  
  reviewMaterial: async (materialId, isApproved) => {
    const response = await api.post("api/moderator/materials/review", { materialId, approved: isApproved });
    return response.data;
  },
  
  getMaterialUrl: async (id) => {
    try {
      const response = await api.get(`api/moderator/materials/${id}/url`);
      return response.data;
    } catch (err) {
      console.error("Neuspješno dobavljanje URL-a materijala");
      return null;
    }
  },

  // --- PRIJAVE/MODERACIJA (Desna kolona) ---
  // 1. Komentari na materijale
  getPendingComments: async () => {
    const response = await api.get("api/moderator/materials/comments");
    return Array.isArray(response.data) ? response.data : [];
  },
  
  reviewComment: async (commentId, isApproved) => {
    const response = await api.post("api/moderator/materials/comments/review", { commentId, approved: isApproved });
    return response.data;
  },

  // 2. Postovi
  getPendingPosts: async () => {
    const response = await api.get("api/moderator/materials/posts");
    return Array.isArray(response.data) ? response.data : [];
  },
  
  reviewPost: async (adviceId, isApproved) => {
    const response = await api.post("api/moderator/materials/posts/review", { adviceId, approved: isApproved });
    return response.data;
  },

  // 3. Komentari na postove
  getPendingPostComments: async () => {
    const response = await api.get("api/moderator/materials/post-comments");
    return Array.isArray(response.data) ? response.data : [];
  },
  
  reviewPostComment: async (adviceId, isApproved) => {
    const response = await api.post("api/moderator/materials/post-comments/review", { adviceId, approved: isApproved });
    return response.data;
  },
};