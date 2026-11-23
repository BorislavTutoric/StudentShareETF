import api from "./api";

// GET /api/activity/me?od=&do= — { ukupnoSekundi, poModulu: [{ modul, sekundi }], poDanu: [{ datum, sekundi }] }
// Bez perioda server vraća zadnjih 30 dana.
export const getMyActivityApi = async (od, doDatuma) => {
  const params = {};
  if (od) params.od = od;
  if (doDatuma) params["do"] = doDatuma;
  const response = await api.get("api/activity/me", { params });
  return response.data;
};
