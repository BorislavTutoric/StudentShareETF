import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getSavedMaterials = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get(`${API_BASE_URL}/saved-materials`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Greška pri učitavanju sačuvanih materijala:', error);
    throw error;
  }
};

export const removeSavedMaterial = async (materialId) => {
  try {
    const token = localStorage.getItem('jwtToken');
    await axios.delete(`${API_BASE_URL}/saved-materials/${materialId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return true;
  } catch (error) {
    console.error('Greška pri uklanjanju materijala:', error);
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