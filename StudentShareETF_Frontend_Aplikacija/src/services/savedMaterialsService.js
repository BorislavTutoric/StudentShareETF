import api from './api';

export const getSubjectsWithSavedMaterials = async (year) => {
  try {
    const res = await api.get("api/saved-materials/subjects", { params: { year } }); 
    return res.data; 
  } catch (err) {
    throw err;
  }
};

export const getFilteredSubjectsWithSavedMaterials = async (year) => {
  try {
    const res = await api.get("api/saved-materials/filtered-subjects", { params: { year } }); 
    return res.data; 
  } catch (err) {
    throw err;
  }
};

export const getSavedMaterials = async (name) => {
  try {
    const response = await api.get("api/saved-materials", { params: { subjectName: name} });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const removeSavedMaterial = async (materialId) => {
  try {
    const response = await api.delete(`api/saved-materials/${materialId}/remove`)
    return response.data;
  } catch (error) {
    throw error;
  }
};
