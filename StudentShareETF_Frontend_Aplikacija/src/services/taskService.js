import api from "./api";

export const getMyMonthTasksApi = async (month, year) => {
  try {
    const response = await api.get("api/tasks/my-tasks", { params: { month, year }});
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`api/tasks/delete/${taskId}`);
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const addTaskApi = async (naslov, opis, datum, vrijeme, nacin) => {
  try {
    const response = await api.post("api/tasks/add", { naslov, opis, datum, vrijeme, nacin });
    return response.data; 
  } catch (err) {
    throw err;
  }
};

export const getFacultyMonthTasksApi = async (month, year) => {
  try {
    const response = await api.get("api/tasks/faculty-tasks", { params: { month, year } });
    return response.data; 
  } catch (err) {
    throw err;
  }
};