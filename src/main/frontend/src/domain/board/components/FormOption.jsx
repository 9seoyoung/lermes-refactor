import React, { useState } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from '../../../styles/layout.module.css'
import optionStyles from '../styles/formOption.module.css'

// 
export default function BasicFormOption({optionToggle, position = "right"}) {
  const [slideEffect, setSlideEffect] = useState({
    isOpened: optionToggle,
    duration: 0.3,
  });

  return (
    <div style={{ position: "relative" }}>
      <div className={[
        optionStyles.postOpt,
        optionToggle && optionStyles.open,

      ].filter(Boolean).join(' ')}>
          등록 / 수정일 때 보이는 구간 (옵션) <br></br>
          옵션 숨김 나타남 버튼도 있음 좋을듯? 반투명<br />
          그럼 상태 필요함. ㅇㅇ <br />
          ------------------- <br />
          유형: 전부
          공개 범위: 공지/자료실/FAQ/문의
          파일: 공지/자료실/FAQ/문의/면담기록/면담신청
          공개범위2: 설문(그룹지정-관리자만, 학생/강사는 본인 그룹)
          시작일/종료일/시간/장소 - 일정 = 근데 본문에 보여야할 것 같음
          공개범위3: 일정(회사지정, 그룹지정-관리자만, 나머지는 개인일정)
          면담일/시간/장소 - 면담신청 확정시(관리자, 강사 요청받은 건에 한해)
          공개범위4: 면담기록 = 본인, 본인 직급 이상
          면담대상: 면담신청(학생, 강사)
        <InterviewApplyFormOption></InterviewApplyFormOption>
        <ScheduleFormOption ></ScheduleFormOption>
        </div>
      </div>
  )
}

export function ScheduleFormOption() {
  return (
    <>
    {/* 시작일 종료일 시작시간 종료시간 장소 개인인지 아닌지 */}
    </>
  )
}

/**
 * 피면담자가 true이면 피면담자용 option을 보여준다.
 * 같은 직급끼리의 면담 신청은 불가능하다. 또한 요청대상으로도 보여선 안된다.
 * 
 * @param {*} param0 
 * @returns 
 */
export function InterviewApplyFormOption({setFormData, formData, userAuth}) {
  return (
    <>
      <div>
        <input type='checkbox' id='cb' />
        <label htmlFor='cb'>저는 피면담자 입니다.</label>
      </div>
      <div className="dropSet" style={{ zIndex: "2" }}>
        <p>면담 요청 대상</p>
        <Dropdown className="dropset_dd" label={formData?.scope || "---- 필수 선택 ----"}>
          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, itvPicAuthrt: "REPRESENTATIVE", scope: "대표" }))}>대표</p>
          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, itvPicAuthrt: "EMPLOYEE" , scope: "직원"}))}>직원</p>
          {/* 학생 전용 */}
          {userAuth != 4 ?
            <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, itvPicAuthrt: "INSTRUCTOR", scope: "강사" }))}>강사</p>
          : null }
        </Dropdown>
        <input type="hidden" name="scope" value={formData?.itvPicAuthrt} />
      </div>
    </>
  )
}

