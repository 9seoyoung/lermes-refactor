import { useState, useEffect } from "react";
import { applierListByCpSn } from "../../services/cohortService";
import Dropdown from "./Dropdown";
import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";
import styles from "../../styles/fontStyle.module.css";
import { pullAllAccount } from "../../services/accountService";

export default function Applier({ handleChange, formData, setCohortSn }) {
  const { effectiveSn } = useSelectedCompany();
  const [applierList, setApplierList] = useState([]);
  const [groupFilter, setGroupFilter] = useState(null);
  const [applierSn, setApplierSn] = useState(null);

  // 🔹 applierSn이 변경되면 부모의 formData.authorSn을 갱신
  useEffect(() => {
    if (applierSn != null) {
      handleChange({
        target: { name: "authorSn", value: applierSn, type: "text" }
      });
    }
  }, [applierSn]);

  useEffect(() => {
    (async () => {
      try {
        // 응답 스키마 안전 분기
        const { data: res4 } = await pullAllAccount({ ogdpCoSn: effectiveSn, userAuthrtSn: 4 });
        const { data: res5 } = await pullAllAccount({ ogdpCoSn: effectiveSn, userAuthrtSn: 5 });

        const list4 = res4?.list ?? res4 ?? [];
        const list5 = res5?.list ?? res5 ?? [];
        const merged = [...list4, ...list5];

        setApplierList(merged);
        console.log(res4);
        // 🔹 여기서 바로 초기값 설정 (applierList 참조하지 말고 merged 사용)
        if (merged.length > 0) {
          setGroupFilter(merged[0].userNm);
          setApplierSn(merged[0].userSn);
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [effectiveSn]);

  return (
    <div className="dropSet" style={{ minWidth: "100px", maxWidth: "100px", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
      <Dropdown className="dropset_dd" label={groupFilter || applierList[0]?.userNm || "선택"}>
        {applierList?.map((applier) => (
          <p
            className="subMenuList"
            key={applier.userSn} // 🔹 key 안정화
            onClick={() => {
              setGroupFilter(applier.userNm);
              setApplierSn(applier.userSn);
              setCohortSn(applier.ogdpCohortSn);

            }}
          >
            {applier.userNm}
          </p>
        ))}
      </Dropdown>

      {/* 🔹 hidden input은 값만 바인딩. onChange 제거 */}
      <input type="hidden" name="applierSn" value={applierSn ?? ""} />
    </div>
  );
}