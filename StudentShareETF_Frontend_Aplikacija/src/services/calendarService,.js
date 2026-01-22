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

export const uploadAcademicCalendar = async (fd) => {
  try {
      const response = await api.post("api/admin/academic-calendar/upload", fd);
      return response.data;
  } catch (err) {
      throw err;
  }
};

export const setExamSchedule = async (fd) => {
  try {
      const response = await api.post("api/admin/exam-schedule/set", fd);
      return response.data;
  } catch (err) {
      throw err;
  }
};

export const deleteExams = async (month, year) => {
  try {
      const response = await api.delete("api/admin/exams/delete", { data: {month, year} });
      return response.data;
  } catch (err) {
      throw err;
  }
};

