import {api} from "../auth/api"


// 회사 시리얼 넘버로 과정(기수) 반환 TB_COHORT 행 다 겟
// @cpSn 회사시리얼 넘버 = TB_USER. OGDP_CO_SN (= TB_COHORT. CO_SN)
export const hortlistByCpSn = (coSn) =>  api.get(`/cohorts/company/${coSn}`, {coSn});
