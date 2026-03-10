import React, { Children, isValidElement, cloneElement, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "../../../auth/AuthContext";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LmsHeader({ loc, navToggle, setNavToggle, children }) {
  const { clearFixedSn, effectiveSn } = useSelectedCompany();
  const { user } = useAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navKind = pathname.split("/", 2)[1] || "";

  useEffect(() => {
    if (!user) navigate("/", { replace: true });
  }, [user, navigate]);

  const injected = Children.map(children, (child) =>
    isValidElement(child)
      ? cloneElement(child, {
          navKind,
          effectiveSn,
          user,
        })
      : child
  );

  return (
    <>
      <div className="header_L">
        <button
          className="navBtn"
          type="button"
          onClick={() => setNavToggle(!navToggle)}
        >
          {navToggle ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        <div
          className="logoBox"
          onClick={() => {
            navigate(`/${navKind}`);
          }}
        >
          <h2>{effectiveSn ?? user?.CO_SN ?? "-"}</h2>
          {(user?.USER_AUTHRT_SN === 1 || user?.USER_AUTHRT_SN === 2) && (
            <button className="tempBtn basicBtn">로고 변경</button>
          )}
        </div>
      </div>

      <>{injected}</>
    </>
  );
}
