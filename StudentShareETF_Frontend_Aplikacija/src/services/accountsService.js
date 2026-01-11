import api from "./api";

export const getModeratorAccounts = async () => {
  try{
    const res = await api.get("api/admin/accounts/moderator");
    return res.data;
  }catch (err){
    throw err;
  }
};

export const getStudentAccounts = async () => {
  try{
    const res = await api.get("api/admin/accounts/student");
    return res.data;
  }catch (err){
    throw err;
  }
};

export const deactivateUserAccountApi = async (userId) => {
  try{
    const res = await api.post(`api/admin/accounts/${userId}/deactivate`);
    return res.data;
  }catch (err){
    throw err;
  }
};

export const activateUserAccountApi = async (userId) => {
  try{
    const res = await api.post(`api/admin/accounts/${userId}/activate`);
    return res.data;
  }catch (err){
    throw err;
  }
};

export const createModeratorAccount = async (firstName, lastName, username, password, role) => {
  try{
    const res = await api.post("api/admin/accounts/moderator/create", {
        firstName,
        lastName,
        username,
        password,
        role
    });
    return res.data;
  }catch (err){
    throw err;
  }
};

export const changeModeratorPasswordApi = async (username, newPassword) => {
  try{
    const res = await api.post("api/admin/accounts/moderator/password-change", {
      username, 
      newPassword
    });
    return res.data;
  }catch (err){
    throw err;
  }
};