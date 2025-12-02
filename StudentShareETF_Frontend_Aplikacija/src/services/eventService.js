import api from "./api";

export const getAllEvents = async () => {
  const res = await api.get("/all/events");
  return res.data;
};

export const getEventComments = async (eventId) => {
  const res = await api.get(`/api/events/${eventId}/comments`);
  return res.data;
};

export const addEventComment = async (eventId, content) => {
  const res = await api.post(`/api/events/${eventId}/comments`, { content: content });
  return res.data;
};

export const getEventReviews = async (eventId) => {
  const res = await api.get(`/api/events/${eventId}/reviews`);
  return res.data;
};

export const addEventReview = async (eventId, rating) => {
  const res = await api.post(`/api/events/${eventId}/reviews`, { rating: rating });
  return res.data;
};

