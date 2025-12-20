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

export const deleteModeratorAccount = async (moderatorId) => {
  try{
    const res = await api.get(`api/admin/accounts/moderator/${moderatorId}/delete`);
    return res.data;
  }catch (err){
    throw err;
  }
};

export const deleteStudentAccount = async (studentId) => {
  try{
    const res = await api.get(`api/admin/accounts/student/${studentId}/delete`);
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