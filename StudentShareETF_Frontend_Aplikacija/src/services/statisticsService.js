import api from "./api";

export const getTimePerModuleApi = async (od, doDatuma) => {
  const params = {};
  if (od) params.od = od;
  if (doDatuma) params["do"] = doDatuma;
  const res = await api.get("api/admin/statistics/time-per-module", { params });
  return res.data;
};

export const getUsageApi = async (godina) => {
  const res = await api.get("api/admin/statistics/usage", { params: { godina } });
  return res.data;
};