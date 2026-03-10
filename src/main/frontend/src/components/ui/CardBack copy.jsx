import { useNavigate } from "react-router-dom";
import { hortlistByCpSn } from "../../services/cohortService";
import styles from "../../styles/cardBack.module.css";
import { useState, useEffect } from "react";
import { formatTime } from "../../utils/dateformat";
import cn from "classnames";

function CardBack({ effectiveSn }) {
  const [hortlist, setHortList] = useState([]);
  const [cohort, setCohort] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 어떤 항목의 상세를 펼쳤는지 기억
  const [openRow, setOpenRow] = useState(null);
  const [openItem, setOpenItem] = useState(null);

  const recruitState = {
    RECRUITING: "모집중",
    ONGOING: "모집종료",
    CANCLED: "모집종료",
    COMPLETED: "모집종료"

  };

  useEffect(() => {
    (async () => {
      try {
        const res = await hortlistByCpSn(effectiveSn);
        const payload = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.list)
          ? payload.list
          : payload
          ? [payload]
          : [];
        setHortList(list);
        setCohort(list.cohorts);
      } catch (e) {
        setError(e?.message ?? "failed to load");
        setHortList([]);
      }
    })();
  }, [effectiveSn]);

  if (error) return <div className={styles.cardContainer}>불러오기 오류: {error}</div>;

  // 상세 영역에서 사용할 "선택된 아이템" 계산
  const getSelectedItem = () => {
    if (openRow == null) return null;
    const row = hortlist[openRow];
    if (!row) return null;

    const arr = Array.isArray(row?.cohorts) && row.cohorts.length ? row.cohorts : [row];
    const item = openItem != null ? arr[openItem] : arr[0];
    return { row, item };
  };

  const selected = getSelectedItem();

  // 유연한 키 접근 (Dt / Ymd 둘 다 지원)
  const pick = (obj, keys) => keys.map(k => obj?.[k]).find(v => v != null);

  return (
    <div className={styles.cardContainer}>
      <h4>교육 목록</h4>

      {!hortlist?.length ? (
        <div className={styles.empty}>목록이 없습니다.</div>
      ) : (
        <ul>
          {hortlist.map((v, idx) => {
            const items = Array.isArray(v?.cohorts) && v.cohorts.length ? v.cohorts : [v];

            return (
              <li
                key={`hort-${idx}`}
                className={cn(styles.liContainer, {
                  [styles.detailOpen]: openRow === idx
                })}
              >
                {items.map((item, i) => (
                  <div
                    key={`item-${i}`}
                    className={styles.absoluteLi}
                    onClick={(e) => {
                      e.stopPropagation();
                      // 같은 행·아이템 누르면 토글, 다른 걸 누르면 해당 항목으로 열기
                      if (openRow === idx && openItem === i) {
                        setOpenRow(null);
                        setOpenItem(null);
                      } else {
                        setOpenRow(idx);
                        setOpenItem(i);
                      }
                    }}
                  >
                    <div className={v?.stts === "RECRUITING" ? styles.sttsCellOn : styles.sttsCellOff}>
                      {recruitState[v?.stts] ?? "-"}
                    </div>

                    <div className={styles.crclmCell}>{item?.crclmNm ?? v?.crclmNm ?? "-"}</div>
                        <div className={styles.crclmCell}>
                      <button
                        className={v?.stts === "RECRUITING" ? styles.applyBtnOn : styles.applyBtnOff}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("applyRecruitPoster");
                        }}
                      >
                        신청
                      </button>
                    </div>
                  </div>
                ))}

                {/* 상세 영역 */}
                <div className={styles.can}></div>
                {openRow === idx && (
                  <div className={styles.detailWrapper}>
                    {(() => {
                      const row = v;
                      const item =
                        openItem != null && items[openItem] ? items[openItem] : items[0] ?? {};

                      const recruitStart =
                        pick(item, ["recruitBgngYmd", "recruitBgngDt"]) ??
                        pick(row, ["recruitBgngYmd", "recruitBgngDt"]);
                      const recruitEnd =
                        pick(item, ["recruitEndYmd", "recruitEndDt"]) ??
                        pick(row, ["recruitEndYmd", "recruitEndDt"]);

                      const crclmStart =
                        pick(item, ["crclmBgngYmd", "crclmBgngDt"]) ??
                        pick(row, ["crclmBgngYmd", "crclmBgngDt"]);
                      const crclmEnd =
                        pick(item, ["crclmEndYmd", "crclmEndDt"]) ??
                        pick(row, ["crclmEndYmd", "crclmEndDt"]);

                      const attendStart = item?.attendStartTm ?? row?.attendStartTm;
                      const attendEnd = item?.attendEndTm ?? row?.attendEndTm;
                      const place = item?.cohortPl ?? row?.cohortPl;

                      return (
                        <>
                          <div className={styles.detailInfo}>
                            <span className={styles.labelInfo}>모집 기간</span>
                            {`${recruitStart ?? "-"} - ${recruitEnd ?? "-"}`}
                          </div>
                          <div className={styles.detailInfo}>
                          <span className={styles.labelInfo}>교육 기간</span>

                            {`${crclmStart ?? "-"} - ${crclmEnd ?? "-"}`}
                          </div>
                          <div className={styles.detailInfo}>
                          <span className={styles.labelInfo}>수업 시간</span>

                            {`${
                              attendStart ? formatTime(attendStart) : "-"
                            } ~ ${attendEnd ? formatTime(attendEnd) : "-"}`}
                          </div>
                          <div className={styles.detailInfo}>
                          <span className={styles.labelInfo}>장 소</span>
                          {`${place ?? "-"}`}</div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CardBack;