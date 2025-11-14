import api from "./api"; 

export const login = async (username, password) => {
  try {
    const res = await api.post("all/auth/login", { username, password }); 
    return res.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri prijavi";
  }
};
