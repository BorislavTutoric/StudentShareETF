import axios from 'axios';
import api from './api';

const API_BASE_URL = 'http://localhost:8080/api';

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

export const saveMaterial = async (materialId) => {
  try {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      throw new Error('Niste prijavljeni');
    }
    
    const response = await axios.post(
      `${API_BASE_URL}/saved-materials/${materialId}`, 
      {}, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; 
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Niste autorizovani');
    } else if (error.response?.status === 400) {
      throw new Error('Materijal je već sačuvan');
    }
    console.error('Greška pri čuvanju materijala:', error);
    throw error;
  }
};

