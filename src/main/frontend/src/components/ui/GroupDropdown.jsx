import { useState, useEffect } from "react";
import { hortlistByCpSn } from "../../services/cohortService";
import Dropdown from "./Dropdown";
import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";
import styles from "../../styles/fontStyle.module.css";
import {useNavigate} from "react-router-dom";

function GroupDropdown({setCohortSn, setCohortStts}) {
  const { effectiveSn } = useSelectedCompany();
  const [hortlist, setHortList] = useState([]);
  const [groupFilter, setGroupFilter] = useState(null);
  const navigate = useNavigate();
    console.log("그룹 변경")


  useEffect(() => {
      (async () => {
        try {
          // console.log(coSn);
          // console.log(`>>>>>>>>>>>>>>>hortlistByCpSn(회사별 모집공고 리스트) 호출`)
          const data = await hortlistByCpSn(effectiveSn);
          const cohorts = data.data.cohorts || [];
          console.log(data)
          setHortList(cohorts);
  
          // 🔹 바로 응답 데이터를 이용해서 초기값 설정
          if (cohorts.length > 0) {
            setGroupFilter(cohorts[0].cohortNm);
            setCohortSn(cohorts[0].cohortSn);
            setCohortStts?.(cohorts[0].cohortSttsNm)
          }
          // console.log(data.data.map((value, idx)=> `${value.cohortNm} + ${idx}`))
        } catch (e) {
          console.log(e.message);
        }
      })();
    }, [effectiveSn]);

  if(!hortlist || hortlist.length === 0) return (
      <div className="dropSet" style={{minWidth: "100px", maxWidth:"100px", whiteSpace:"nowrap", textOverflow:"ellipsis"}}>
        <Dropdown className="dropset_dd" label={"과정 없음"} >
          {/* <p className=".subMenuList" onClick={()=> {setGroupFilter("All"); setCohortSn(null)}} >All</p> */}
              <p className="subMenuList" key={"nohort"} onClick={()=> navigate("/adminHome/groupSet/createGroup")} >
                + 과정 등록
              </p>
        </Dropdown>
      </div>
  );

  return (
    <div className="dropSet" style={{minWidth: "100px", maxWidth:"100px", whiteSpace:"nowrap", textOverflow:"ellipsis"}}>
      <Dropdown className="dropset_dd" label={groupFilter || hortlist[0]?.cohortNm} >
        {/* <p className=".subMenuList" onClick={()=> {setGroupFilter("All"); setCohortSn(null)}} >All</p> */}
      { hortlist.map((hortlist, idx) => (
          <p className="subMenuList" key={idx} onClick={()=> {console.log("그룹선택>>>>>>>>>>>>>>>>>>>>>>>>>>>>");setGroupFilter(`${hortlist.cohortNm}`);setCohortSn(hortlist.cohortSn); setCohortStts?.(hortlist.cohortSttsNm);}} >
            {hortlist.cohortNm}
            <div className={`${hortlist.cohortSttsNm === "RECRUITING" ?
              styles.detailsGray : 
              (hortlist.cohortSttsNm === "CANCELED" ?
                styles.detailsRed : (hortlist.cohortSttsNm === "ONGOING" ?
                  styles.detailsBlue
                  :
                  styles.detailsGray
                )
              )
            }`}>
              {`[${hortlist.cohortSttsNm === "RECRUITING" ? "예정" : (hortlist.cohortSttsNm === "CANCELED" ? "폐강" : (hortlist.cohortSttsNm === "ONGOING" ? "진행" : "수료"))}]`}
          </div>
          </p>
      ))}
      </Dropdown>
    </div>
  )
}

export default GroupDropdown