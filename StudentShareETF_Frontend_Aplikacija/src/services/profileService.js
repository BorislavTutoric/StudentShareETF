import { use } from "react";
import api from "./api"

export const getProfileDetails = async () => {
    const res = await api.get("/api/profile");
    return res.data;
};

export const updateStudentPersonalInfo = (data) => {
  return api.put("/api/student-update", data);
};


export const emailChange = (newEmail) => {
  return api.put("/api/email-change", { newEmail });
};


export const passwordChange = (newPassword) => {
  return api.put("/api/password-change", { newPassword });
};

export const updatePersonalInfo = async (username, firstName, lastName) => {
  try {
    const response = await api.post("api/profile/update", { username, firstName, lastName });
    localStorage.setItem("jwtToken", response.data);
  } catch (err) {
    throw err;
  }
};

export const checkPassword = async (password) => {
  try {
    const response = await api.post("api/profile/check-password", { password });
    return response.data; 
  } catch (err) {
    throw err;
  }
};
