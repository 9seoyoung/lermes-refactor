// SelectedCompanyProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccount } from "../auth/AuthContext";

const KEY = "fixedSn";
const Ctx = createContext(null);

export function SelectedCompanyProvider({ children }) {
  const { user, loading: userLoading } = useAccount();

  const [fixedSn, setFixedSn] = useState(() => {
    const raw = sessionStorage.getItem(KEY);
    const n = raw == null ? null : Number(raw);
    return Number.isFinite(n) ? n : null; // NaN 방어
  });

  // 세션 동기화
  useEffect(() => {
    if (fixedSn == null) sessionStorage.removeItem(KEY);
    else sessionStorage.setItem(KEY, String(fixedSn));
  }, [fixedSn]);

  // ✅ 실제 사용값: fixedSn > user.USER_OGDP_CO_SN > 0
  // 단, user가 아직 로딩 중이면 "준비 안됨(null)"로 반환
  const effectiveSn = useMemo(() => {
    if (fixedSn != null) return fixedSn;
    if (userLoading) return null;                 // 아직 모름
    return (user?.USER_OGDP_CO_SN ?? 0);         // 로딩 끝난 후 기본값
  }, [fixedSn, userLoading, user?.USER_OGDP_CO_SN]);

  // consumer가 분기 쉽게 쓰라고 ready 플래그 제공
  const ready = useMemo(() => effectiveSn != null, [effectiveSn]);

  // 선택: 잘못된 값 방지용 세터
  const setFixedSnSafe = (v) => {
    if (v == null) return setFixedSn(null);
    const n = Number(v);
    if (Number.isFinite(n)) setFixedSn(n);
  };

  const clearFixedSn = () => setFixedSn(null);

  return (
    <Ctx.Provider
      value={{ fixedSn, setFixedSn: setFixedSnSafe, clearFixedSn, effectiveSn, ready }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSelectedCompany() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSelectedCompany must be used within SelectedCompanyProvider");
  return ctx;
}

// 값만 필요하면 이 훅으로: { value, ready } 형태
export function useEffectiveCompanySn() {
  const { effectiveSn, ready } = useSelectedCompany();
  return { value: effectiveSn, ready };
}
