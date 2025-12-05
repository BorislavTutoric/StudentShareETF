import api from "./api";

export const openAcademicCalendar = async (id) => {
  try {
    const response = await api.get(`api/academic-calendar/${id}/url`);
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const getAcademicCalendar = async () => {
  try {
    const response = await api.get("api/academic-calendar");
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const getTasks = async (selectedDate) => {
  try {
    const response = await api.get("api/tasks", { params: { date: selectedDate }});
    return response.data; 
  } catch (err) {
    throw err;
  }
};

