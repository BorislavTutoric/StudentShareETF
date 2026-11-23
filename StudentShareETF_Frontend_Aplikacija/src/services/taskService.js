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

// PUT /api/tasks/{id} — izmjena obaveze; vraća izmijenjenu obavezu (TaskResponse)
export const updateTaskApi = async (taskId, { naslov, opis, datum, vrijeme }) => {
  const response = await api.put(`api/tasks/${taskId}`, { naslov, opis, datum, vrijeme });
  return response.data;
};

// PATCH /api/tasks/{id}/done — označavanje obaveze kao (ne)obavljene
export const setTaskDoneApi = async (taskId, obavljena) => {
  const response = await api.patch(`api/tasks/${taskId}/done`, { obavljena });
  return response.data;
};

// GET /api/tasks/stats?od=&do= — { ukupno, obavljene, propustene, naCekanju, procenatUspjesnosti, poMjesecima }
export const getTaskStatsApi = async (od, doDatuma) => {
  const params = {};
  if (od) params.od = od;
  if (doDatuma) params["do"] = doDatuma;
  const response = await api.get("api/tasks/stats", { params });
  return response.data;
};

// Obaveza bez vremena (00:00 ili prazno) traje do kraja dana — isto pravilo kao na serveru.
export const rokObaveze = (task) => {
  const [g, m, d] = task.date.split("-").map(Number);
  const vrijeme = task.time && task.time !== "00:00" ? task.time : null;
  if (!vrijeme) return new Date(g, m - 1, d, 23, 59, 59, 999);
  const [h, min] = vrijeme.split(":").map(Number);
  return new Date(g, m - 1, d, h, min);
};

// "obavljena" | "propustena" | "na_cekanju"
export const statusObaveze = (task) => {
  if (task.obavljena) return "obavljena";
  return rokObaveze(task) < new Date() ? "propustena" : "na_cekanju";
};
