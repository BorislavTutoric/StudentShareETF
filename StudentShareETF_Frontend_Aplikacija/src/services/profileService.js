import api from "./api"

export const getProfileDetails = async () => {
    const res = await api.get("/api/profile");
    return res.data;
};

export const updatePersonalInfo = (data) => {
  return api.put("/api/update", data);
};


export const emailChange = (newEmail) => {
  return api.put("/api/email-change", { newEmail });
};


export const passwordChange = (newPassword) => {
  return api.put("/api/password-change", { newPassword });
};

