import api from "./api";

export const getAllModeratorActionsApi = async () => {
  try {
    const response = await api.get("api/admin/moderator-actions");
    return response.data; 
  } catch (err) {
    throw err;
  }
};