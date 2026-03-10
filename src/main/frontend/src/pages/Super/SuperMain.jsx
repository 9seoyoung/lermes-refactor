import { useEffect, useState } from 'react';
import cardStyle from '../../styles/superMain.module.css';
import { pullAllCompany } from '../../services/infoService';
import { toast } from 'react-toastify';
import { useSelectedCompany } from '../../contexts/SelectedCompanyContext';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../auth/AuthContext';
import CardBack from '../../components/ui/CardBack';
import { MdHome } from 'react-icons/md';

export default function SuperMain() {
  const { user } = useAccount();
  const { effectiveSn, setFixedSn } = useSelectedCompany();
  const [companyList, setCompanyList] = useState([]);
  const [flipped, setFlipped] = useState(null); // 클릭 토글용
  const navigate = useNavigate();
  const myCoSn = user?.USER_OGDP_CO_SN;
  const myAuth = user?.USER_AUTHRT_SN;
  const authLvPath = {
    1: 'adminHome',
    2: 'adminHome',
    3: 'adminHome',
    4: 'tutorHome',
    5: 'stdHome',
    6: 'visitorHome',
    7: 'visitorHome',
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await pullAllCompany();
        console.log(res);
        setCompanyList(res.data ?? []);
      } catch (err) {
        toast.error(err.message);
        console.log('회사불러오기 실패', err);
      }
    })();
  }, [effectiveSn]);

  const handleGoLms = (selectedCoSn) => {
    if (!user) {
      navigate('/unknownHome', { replace: true });
    } else {
      const path = authLvPath[myAuth] ?? 'visitorHome';
      navigate(`/${path}`, { replace: true });
    }
  };

  return (
    <div className={cardStyle.mainContainer_cardGrid}>
      {[...companyList].reverse().map((v, idx) => {
        const bg = v?.bigLogoFileSn
          ? `url(http://localhost:940/api/files/id/${v.bigLogoFileSn})`
          : 'none';

        const isFlipped = flipped === v.id;

        return (
          <div
            key={v.id ?? idx}
            className={cardStyle.flipCard}
            onClick={() => {
              setFlipped(flipped === v.id ? null : v.id);
              setFixedSn(v.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFlipped(flipped === v.id ? null : v.id);
              }
            }}
            aria-pressed={flipped === v.id}
          >
            <div
              className={`${cardStyle.flipInner} ${
                flipped === v.id ? cardStyle.isFlipped : ''
              }`}
            >
              {/* 앞면: 기존 .company_card 그대로 */}
              <div className={cardStyle.company_card}>
                {v?.bigLogoFileSn ? (
                  <img
                    src={`http://localhost:940/api/files/id/${v.bigLogoFileSn}`}
                    alt={v?.name || 'company banner'}
                    className={cardStyle.company_img}
                  />
                ) : (
                  <div className={cardStyle.noImage}>홍보 배너 없음</div>
                )}

                <div className={cardStyle.card_bottom}>
                  <p className={cardStyle.title} data-title-type="3">
                    {v?.name}
                  </p>
                  <p className={cardStyle.title}>{`${
                    (v?.companyAddress ?? '소재지') +
                    ' ' +
                    (v?.companyAddressDetail ?? '정보 없음')
                  }`}</p>
                  <div className={cardStyle.row} data-box-type="row">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFixedSn(v.id);
                        handleGoLms(v.id);
                      }}
                    >
                      LMS 바로가기
                    </button>
                    <button
                      type="button"
                      className={!v.stts ? null : cardStyle.sttsBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {`${!v.stts ? '-' : '모집중'}`}
                    </button>
                  </div>
                </div>
              </div>

              {/* 뒷면: 동일 크기, 다른 내용 */}
              <div
                className={`${cardStyle.company_card} ${cardStyle.card_back}`}
              >
                <CardBack effectiveSn={effectiveSn}></CardBack>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
