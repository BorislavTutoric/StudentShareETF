import api from "./api";

export const getAllEvents = async () => {
  const res = await api.get("/all/events");
  return res.data;
};