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
    const res = await api.get("all/auth/check-username", { params: { username } }); 
    return res.data; 
  } catch (err) {
    throw err.response || "Greška pri provjeri";
  }
};

export const checkEmail = async (email) => {
  try{
    const res = await api.get("all/auth/check-email", { params: { email } });
    return res.data;
  }catch (err)
  {
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

export const mailVerification = async (token) => {
  try {
    const res = await api.post("all/auth/verify", { token }); 
    return res.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri verifikaciji";
  }
};

export const loginCheck = async () => {
  try {
    const res = await api.get("api/auth-check"); 
    return res.data; 
  } catch (err) {
    throw err;
  }
};

export const forgottenPasswordRequest = async (email) => {
  try {
    const res = await api.post("all/auth/forgotten-password-request", { email }); 
    return res.data; 
  } catch (err) {
    throw err;
  }
};

export const forgottenPasswordChange = async (token, password) => {
  try {
    const res = await api.post("all/auth/forgotten-password-change", { token, password }); 
    return res.data; 
  } catch (err) {
    throw err;
  }
};


