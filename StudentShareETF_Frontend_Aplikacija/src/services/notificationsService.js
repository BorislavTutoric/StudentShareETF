import api from "./api";

export const getNotificationsApi = async () => {
  try {
    const res = await api.get("api/notifications"); 
    return res.data; 
  } catch (err) {
    throw err;
  }
};

export const getNotificationsPageApi = async (size, cursor) => {
  const params = { size };
  if (cursor) {
    params.beforeActiveFrom = cursor.activeFrom;
    params.beforeId = cursor.notificationId;
  }
  const res = await api.get("api/notifications/paged", { params });
  return res.data;
};

export const deleteNotificationApi = async (id) => {
  try {
    const res = await api.delete(`api/notifications/delete/${id}`); 
    return res.data; 
  } catch (err) {
    throw err;
  }
};

export const setReadNotification = async (id) => {
  try {
    const res = await api.post(`api/notifications/read/${id}`); 
    return res.data; 
  } catch (err) {
    throw err;
  }
};

export const getNumOfUnreadNotificationsApi = async () => {
  try {
    const res = await api.get("api/notifications/check-unread"); 
    return res.data; 
  } catch (err) {
    throw err;
  }
};

