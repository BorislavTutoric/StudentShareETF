import api from "./api";

// Prazni filteri se ne šalju, da ih server ne bi tumačio kao prazan string.
const ocisti = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""));

// GET /api/admin/audit-log
// filteri: { korisnik, uloga, tip, modul, od, do } (od/do: YYYY-MM-DD, oba uključivo)
// Odgovor: { content: [...], page, size, totalElements, totalPages, hasNext }
export const getAuditLogApi = async (filteri, page = 0, size = 20) => {
  const response = await api.get("api/admin/audit-log", { params: ocisti({ ...filteri, page, size }) });
  return response.data;
};

// GET /api/audit/me — lična istorija prijavljenog korisnika (za Dio 3)
export const getMyAuditLogApi = async ({ modul, od, do: doDatuma } = {}, page = 0, size = 20) => {
  const response = await api.get("api/audit/me", { params: ocisti({ modul, od, do: doDatuma, page, size }) });
  return response.data;
};
