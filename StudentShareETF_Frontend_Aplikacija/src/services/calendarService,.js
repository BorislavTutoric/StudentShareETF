import api from "./api";

export const openAcademicCalendar = async (id) => {
  try {
    const response = await api.get(`api/academic-calendar/${id}/url`);
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const getAcademicCalendarApi = async () => {
  try {
    const response = await api.get("api/academic-calendar");
    return response.data; 
  } catch (err) {
    throw err;
  }
};


