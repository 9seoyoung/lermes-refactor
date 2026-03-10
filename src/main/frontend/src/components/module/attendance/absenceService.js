import api from "../../../auth/api";


export const countNewAbsenceExcuses = (effectiveSn) => api.get("attend/absence-requests/count", {
  headers: {
    "X-Effective-Sn": effectiveSn
  }
});
