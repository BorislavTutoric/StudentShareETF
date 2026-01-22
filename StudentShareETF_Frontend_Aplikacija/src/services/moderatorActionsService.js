import api from "./api";

export const getAllModeratorActionsApi = async () => {
  try {
    const response = await api.get("api/admin/moderator-actions");
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const moderatorActionService = {
  getAllStudents: async () => {
    const response = await api.get("api/moderator/materials/students");
    return response.data;
  },
  
  toggleStudentStatus: async (id, noviStatus) => {
    const response = await api.put(`api/moderator/materials/students/${id}/status`, { aktivan: noviStatus });
    return response.data;
  },

  checkStudentSuspension: async (studentId) => {
    const response = await api.get(
      `/api/moderator/materials/students/${studentId}/suspension-status`
    );
    return response.data; 
  },

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

  getPendingComments: async () => {
    const response = await api.get("api/moderator/materials/comments");
    return Array.isArray(response.data) ? response.data : [];
  },
  
  reviewComment: async (commentId, isApproved) => {
    const response = await api.post("api/moderator/materials/comments/review", { commentId, approved: isApproved });
    return response.data;
  },

  getPendingPosts: async () => {
    const response = await api.get("api/moderator/materials/posts");
    return Array.isArray(response.data) ? response.data : [];
  },
  
  reviewPost: async (adviceId, isApproved) => {
    const response = await api.post("api/moderator/materials/posts/review", { adviceId, approved: isApproved });
    return response.data;
  },

  getPendingPostComments: async () => {
    const response = await api.get("api/moderator/materials/post-comments");
    return Array.isArray(response.data) ? response.data : [];
  },
  
  reviewPostComment: async (adviceId, isApproved) => {
    const response = await api.post("api/moderator/materials/post-comments/review", { adviceId, approved: isApproved });
    return response.data;
  },

    getPendingEventsForModerator: async () => {
    const response = await api.get("/api/moderator/events");
    return response.data;
  },

  reviewEvent: async (dogadjajId, approved) => {
    const response = await api.post("/api/moderator/events/review", {
      dogadjajId,
      approved
    });
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/api/moderator/events/${eventId}`);
    return response.data;
  },

  getPendingEventCommentsForModerator: async () => {
    const response = await api.get("/api/moderator/events/comments");
    return response.data;
  },

  reviewEventComment: async (commentId, approved) => {
    const response = await api.post("/api/moderator/events/comments/review", {
      commentId,
      approved
    });
    return response.data;
  },

 
  deleteEventComment: async (commentId) => {
    const response = await api.delete(
      `/api/moderator/events/comments/${commentId}`
    );
    return response.data;
  }

};

export default moderatorActionService;
