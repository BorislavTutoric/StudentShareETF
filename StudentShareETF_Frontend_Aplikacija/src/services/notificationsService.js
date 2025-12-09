import api from "./api";

export const getNotificationsApi = async () => {
  try {
    const res = await api.get("api/notifications"); 
    return res.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri ucitavanju";
  }
};

export const deleteNotificationApi = async (id) => {
  try {
    const res = await api.delete(`api/notifications/delete/${id}`); 
    return res.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri ucitavanju";
  }
};

export const setReadNotification = async (id) => {
  try {
    const res = await api.post(`api/notifications/read/${id}`); 
    return res.data; 
  } catch (err) {
    throw err.response?.data?.error || "Greška pri ucitavanju";
  }
};
