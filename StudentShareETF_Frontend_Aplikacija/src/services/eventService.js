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

export const getComments = async (eventId) => {
  const res = await api.get(`/api/events/${eventId}/comments/moderator`);
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

export const createEvent = async (eventData) => {
  try{
    const formData = new FormData();

    formData.append("title", eventData.title);
    formData.append("location", eventData.location);
    formData.append("date", eventData.date);
    formData.append("time", eventData.time);
    formData.append("description", eventData.description);

    if (eventData.image) {
      formData.append("image", eventData.image);
    }

    const res = await api.post("/api/events/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }catch(err){
    throw err;
  }
};

export const deleteEventComment = async (commentId) => {
  try {
    const response = await api.delete(`api/events/${commentId}/comments`);
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const reportEventComment = async (commentId) => {
  try {
    const response = await api.post(`api/events/${commentId}/report-comment`);
    return response.data; 
  } catch (err) {
    throw err;
  }
}

export const getEventAvgRating = async (eventId) => {
  try {
    const response = await api.get(`api/events/${eventId}/reviews-average`);
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const deleteEventReview = async (eventId) => {
  try {
    const response = await api.delete(`/api/events/${eventId}/reviews`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteEventCommentById = async (commentId) => {
  const response = await api.delete(`/api/moderator/events/comments/${commentId}`);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/api/moderator/events/${eventId}`);
  return response.data;
};

