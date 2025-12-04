import api from "./api"; 

export const getSubjects = async (year) => {
  try {
    const res = await api.get("all/subjects", { params: { year } }); 
    return res.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri ucitavanju";
  }
};

export const getFilteredSubjects = async (year) => {
  try {
    const res = await api.get("api/materials/filter", { params: { year } }); 
    return res.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri ucitavanju";
  }
};

export const getMaterials = async (name) => {
  try {
    const res = await api.get("all/subject/materials", { params: { name } }); 
    return res.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri ucitavanju";
  }
};

export const getMaterial = async (id) => {
  try {
    const response = await api.get(`all/subject/${id}/url`);
    return response.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri učitavanju";
  }
};

export const uploadMaterial = async (fd) => {
  try {
      const response = await api.post("api/materials/upload", fd);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
};

export const getReviews = async (materialId) => {
  try {
    const response = await api.get(`api/materials/${materialId}/reviews`);
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const addReview = async (materialId, review) => {
  try {
    const response = await api.post(`api/materials/${materialId}/add-review`, null, { params: { review } });
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const deleteReview = async (materialId) => {
  try {
    const response = await api.post(`api/materials/${materialId}/delete-review`);
    return response.data; 
  } catch (err) {
    throw err;
  }
};

