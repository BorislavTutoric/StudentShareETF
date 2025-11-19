import api from "./api"; 

export const getSubjects = async (year) => {
  try {
    const res = await api.get("all/subjects", { params: { year } }); 
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
    return response.data; // ovde je tvoj presigned URL
  } catch (err) {
    throw err.response?.data?.error || "Greška pri učitavanju";
  }
};