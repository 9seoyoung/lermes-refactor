import { useNavigate, useParams } from 'react-router-dom';
import { hortlistByCpSn } from '../../services/cohortService';
import styles from '../../styles/cardBack.module.css';
import { useState, useEffect } from 'react';
import { formatTime } from '../../utils/dateformat';
import cn from 'classnames';
import { useAccount } from '../../auth/AuthContext';
import { toast } from 'react-toastify';

function CardBack({ effectiveSn }) {
  const { user } = useAccount();
  const [hortlist, setHortList] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openRow, setOpenRow] = useState(null);
  const [openItem, setOpenItem] = useState(null);

  // 로그인/수강중 여부는 "사용자" 기준으로만 상단에서 계산
  const isLoggedIn = !!(user && (user.USER_SN ?? user.userSn));
  const hasCourse = !!user?.OGDP_CO_SN;

  const recruitState = {
    RECRUITING: '모집중',
    ONGOING: '모집종료',
    CANCLED: '모집종료', // 서버에서 이렇게 내려온다면 그대로 둬도 됨 (오타 가능성 체크)
    COMPLETED: '모집종료',
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await hortlistByCpSn(effectiveSn);
        const payload = res?.data?.cohorts;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.list)
          ? payload.list
          : payload
          ? [payload]
          : [];
        setHortList(list);
      } catch (e) {
        setError(e?.message ?? 'failed to load');
        setHortList([]);
      }
    })();
  }, [effectiveSn]);

  if (error)
    return <div className={styles.cardContainer}>불러오기 오류: {error}</div>;

  const pick = (obj, keys) => keys.map((k) => obj?.[k]).find((v) => v != null);

  return (
    <div className={styles.cardContainer}>
      <h4>교육 목록</h4>
      {!hortlist?.length ? (
        <div className={styles.empty}>목록이 없습니다.</div>
      ) : (
        <ul style={{ height: '320px', overflowY: 'scroll' }}>
          {hortlist.map((v, idx) => {
            const items =
              Array.isArray(v?.cohorts) && v.cohorts.length ? v.cohorts : [v];

            return (
              <div className={styles.listContainer} key={`list-${idx}`}>
                <li
                  className={cn(styles.liContainer, {
                    [styles.detailOpen]: openRow === idx,
                  })}
                >
                  {items.map((item, i) => {
                    // ✅ 아이템별 상태를 여기서 계산
                    const itemStatus = String(
                      item?.cohortSttsNm ?? v?.cohortSttsNm ?? ''
                    )
                      .trim()
                      .toUpperCase();
                    const canApply = itemStatus === 'RECRUITING' && !hasCourse;
                    const cohortSn = item?.cohortSn ?? v?.cohortSn; // 실제 키 이름 확인 필요

                    return (
                      <div
                        key={`item-${i}`}
                        className={styles.absoluteLi}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openRow === idx && openItem === i) {
                            setOpenRow(null);
                            setOpenItem(null);
                          } else {
                            setOpenRow(idx);
                            setOpenItem(i);
                          }
                        }}
                      >
                        <div
                          className={
                            itemStatus === 'RECRUITING'
                              ? styles.sttsCellOn
                              : styles.sttsCellOff
                          }
                        >
                          {recruitState[itemStatus] ?? '-'}
                        </div>

                        <div className={styles.crclmCell}>
                          {item?.crclmNm ?? v?.crclmNm ?? '-'}
                        </div>

                        <div className={styles.crclmCell}>
                          { 
                              itemStatus === 'RECRUITING' ?

                              <button
                              className={styles.applyBtnOn}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                
                                if (!isLoggedIn) {
                                  if (
                                    toast.error('로그인이 필요한 작업입니다.')
                                  ) {
                                    navigate('/welcome/login');
                                  }
                                  return;
                                } else if (!cohortSn) {
                                  alert('recruitSn(cohortSn)이 없습니다.');
                                  return;
                                } else if (!user?.USER_OGDP_CO_SN) {
                                  navigate(
                                  `/visitorHome/applyRecruitPoster/${cohortSn}`
                                );
                                return;
                              } else {
                                alert('이미 수강중인 강좌가 있습니다.');
                              }
                            }}
                            >
                            신청
                          </button>
                          :
                          null
                          }
                        </div>
                      </div>
                    );
                  })}

                  {/* 상세 영역 */}
                  {openRow === idx && (
                    <div
                      className={styles.detailWrapper}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {(() => {
                        const items2 = items;
                        const item =
                          openItem != null && items2[openItem]
                            ? items2[openItem]
                            : items2[0] ?? {};

                        const recruitStart =
                          pick(item, ['recruitBgngYmd', 'recruitBgngDt']) ??
                          pick(v, ['recruitBgngYmd', 'recruitBgngDt']);
                        const recruitEnd =
                          pick(item, ['recruitEndYmd', 'recruitEndDt']) ??
                          pick(v, ['recruitEndYmd', 'recruitEndDt']);

                        const crclmStart =
                          pick(item, ['crclmBgngYmd', 'crclmBgngDt']) ??
                          pick(v, ['crclmBgngYmd', 'crclmBgngDt']);
                        const crclmEnd =
                          pick(item, ['crclmEndYmd', 'crclmEndDt']) ??
                          pick(v, ['crclmEndYmd', 'crclmEndDt']);

                        const attendStart =
                          item?.attendStartTm ?? v?.attendStartTm;
                        const attendEnd = item?.attendEndTm ?? v?.attendEndTm;
                        const place = item?.cohortPl ?? v?.cohortPl;

                        return (
                          <>
                            <div className={styles.detailInfo}>
                              <span className={styles.labelInfo}>
                                모집 기간
                              </span>
                              {`${recruitStart ?? '-'} - ${recruitEnd ?? '-'}`}
                            </div>
                            <div className={styles.detailInfo}>
                              <span className={styles.labelInfo}>
                                교육 기간
                              </span>
                              {`${crclmStart ?? '-'} - ${crclmEnd ?? '-'}`}
                            </div>
                            <div className={styles.detailInfo}>
                              <span className={styles.labelInfo}>
                                수업 시간
                              </span>
                              {`${
                                attendStart ? formatTime(attendStart) : '-'
                              } ~ ${attendEnd ? formatTime(attendEnd) : '-'}`}
                            </div>
                            <div className={styles.detailInfo}>
                              <span className={styles.labelInfo}>장 소</span>
                              {`${place ?? '-'}`}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </li>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CardBack;
