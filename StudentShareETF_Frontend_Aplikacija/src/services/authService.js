import api from "./api"; 

export const login = async (username, password) => {
  try {
    const res = await api.post("all/auth/login", { username, password }); 
    return res.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri prijavi";
  }
};

export const checkUsername = async (username) => {
  try {
    const res = await api.get("all/auth/check-username", { username }); 
    return res.data; 
  } catch (err) {
    throw err.response || "Greška pri provjeri";
  }
};

export const registration = async (name, surname, email, studyProgram, major, username, password) => {
  try {
    const res = await api.post("all/auth/registration", {
      name,
      surname,
      email,
      studyProgram,
      major,
      username,
      password
    });
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || err.message || "Greška pri registraciji";
  }
};

