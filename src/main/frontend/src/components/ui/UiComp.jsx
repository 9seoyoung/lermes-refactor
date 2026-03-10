// 상호작용 컴포넌트
// props로 텍스트 조절할 수 있게
import { useId, forwardRef, useRef, useImperativeHandle  } from 'react';
import { Calendar, Clock } from "lucide-react";
import styles2 from "../../styles/DateTimeInput.module.css";
import styles from '../../styles/UiComp.module.css';
import Dropdown from './Dropdown';
import FilePreview from './FilePreview';
import ListTable from './ListTable';
import { useAccount } from '../../auth/AuthContext';
import { downloadFileByFileSn } from '../../services/fileService';

export function UiComp() {
  const arr1 = ["#", "이름", "이메일"];
  
  return (
    <div>
       <FormInput />
            <FormUnderline />
            <WhiteBtn />
            <BlueBtn />
            <GrayBtn />
            <SchedAddBtn />
            <SaveBtn />
            <CancelBtn />
            <TempSaveBtn />
            <CheckInBtn />
            <CheckOutBtn  />
            <BackBtn />
            <NavBtn  />
            <DeleteBtn />
            <ActionBtn />
            <AddBtn />
            <OptionSelect />
            <TextAreaBox />
            <BlueCheckbox />
            <OrangeCheckbox />
            <FileUpload />
            <Table />
            <ListTable tableHead={arr1} columnData={["no", "name", "email","tel"]} apiData={[{no:"#", name: "이름", email:"이메일", tel:"전화번호" }, {no:"#", name: "이름", email:"이메일", tel:"전화번호" }, {no:"#", name: "이름", email:"이메일", tel:"전화번호" }]}></ListTable>
      {/* 드롭다운 사용 방법 */}
      <Dropdown label="드롭다운 제목" trigger="hover" placement="bottom-start" >
      <a className="dd__item" href="/mypage">내 정보</a>
      <a className="dd__item" href="/settings">설정</a>
      <button className="dd__item">로그아웃</button>
      </Dropdown>
      <FilePreview/>
    </div>
  );
}
// 날짜 / 시간 인풋
export const DateTimeInput = forwardRef(function DateTimeInput(
  props,
  ref
) {
  const inputRef = useRef(null);
  const {type, name, addLabelStyle, addStyle, textType, icon, handleChange , formData = {}, labelNm, disabled, isRequired} = props;
  const inputId = useId();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    showPicker: () => inputRef.current?.showPicker?.(),
    get input() { return inputRef.current; }
  }));

  const IconCmp = icon
    ? icon === "clock" ? Clock : Calendar
    : (type === "time" ? Clock : Calendar);

  const onIconClick = () => {
    if (inputRef.current?.showPicker) {
      inputRef.current.showPicker();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div className={`${styles2.field} ${styles.inputSet}`}>
      <label htmlFor={`${inputId}-${name}`} className={`${styles.inputLabel} ${addLabelStyle}`}>{labelNm}</label>
      <input
        ref={inputRef}
        type={type}
        className={`${styles.input} ${addStyle}`}
        disabled={disabled}
        required={isRequired}
        id={`${inputId}-${name}`} autoComplete={ "off"} name={name} value={formData[name] ?? ""} placeholder={textType} onChange={handleChange} />
        {disabled ? null :

        <button
        type="button"
        className={styles2.iconBtn}
        onClick={onIconClick}
        aria-label="open picker"
        tabIndex={-1}
        >
        <IconCmp size={18} strokeWidth={2} />
        </button>}
    </div>
  );
});


// 인풋
export function FormInput(props) {
  const {type, name, isRequired, textType, handleChange , formData, labelNm, addLabelStyle, addStyle, disabled} = props;
  const inputId = useId();

  return (
    <div className={styles.inputSet}>
      <label htmlFor={`${inputId}-${name}`} className={`${styles.inputLabel} ${addLabelStyle}`}>{labelNm}</label>
      <input 
        required={isRequired}
      
      disabled={disabled} id={`${inputId}-${name}`} autoComplete={"off"} className={`${styles.input} ${addStyle}`} type={type} name={name} value={formData[name] ?? ""} placeholder={textType} onChange={handleChange} />
    </div>
  );
}

// 밑줄
export function FormUnderline({ textType }) {
  return (
    <div>
      <input className={styles.underline} type="text" placeholder={textType} />
    </div>
  );
}

// 흰색 버튼
export function WhiteBtn({ textType }) {
  return (
    <div>
      <button className={styles.btn}>{textType}</button>
    </div>
  );
}
// 파란색 버튼
export function BlueBtn({ textType, onClick }) {
  return (
    <div>
      <button className={styles.blueBtn} onClick={onClick} >{textType}</button>
    </div>
  );
}
// 회색 버튼
export function GrayBtn({ textType, style, onClick }) {
  return (
    <div>
      <button className={styles.grayBtn} style={{style}} onClick={onClick}>{textType}</button>
    </div>
  );
}

// 일정등록 버튼
export function SchedAddBtn({ textType, onClick }) {
    return (
        <div>
            <button type='button' onClick={onClick} className={styles.schedAddBtn}>{textType}</button>
        </div>
    );
}

// 저장 버튼
export function SaveBtn({ textType, onClick, style }) {
  return (
      <button className={`${styles.smallBtn} ${styles.saveBtn}`} style={style} onClick={onClick}>
        {textType}
      </button>
  );
}
// 취소 버튼
export function CancelBtn({ textType, onClick }) {
  return (
    <div>
      <button onClick={onClick} className={`${styles.smallBtn} ${styles.cancelBtn}`}>
        {textType}
      </button>
    </div>
  );
}
// 임시저장 버튼
export function TempSaveBtn({ textType }) {
  return (
    <div>
      <button className={styles.tempSaveBtn}>{textType}</button>
    </div>
  );
}
// 입실 버튼
export function CheckInBtn({ textType }) {
  return (
    <div>
      <button className={`${styles.statusBtn} ${styles.checkInBtn}`}>
        {textType}
      </button>
    </div>
  );
}
// 퇴실 버튼
export function CheckOutBtn({ textType }) {
  return (
    <div>
      <button className={`${styles.statusBtn} ${styles.checkOutBtn}`}>
        {textType}
      </button>
    </div>
  );
}
// 입•퇴실 취소 버튼
export function BackBtn({ textType }) {
  return (
    <div>
      <button className={`${styles.statusBtn} ${styles.backBtn}`}>{textType}</button>
    </div>
  );
}
// nav 영역 버튼
export function NavBtn({ textType }) {
  return (
    <div>
      <button className={styles.navBtn}>{textType}</button>
    </div>
  );
}
// 마이너스 버튼 (파일 삭제)
export function DeleteBtn({onClick}) {
  return (
    <button type="button" onClick={onClick} className={styles.deleteBtn}>
      <span className={styles.delete} />
    </button>
  );
}
// 서식 저장, 질문 추가 버튼
export function ActionBtn({ textType }) {
  return (
    <div>
      <button className={styles.actionBtn}>{textType}</button>
    </div>
  );
}
// 항목 추가 버튼
export function AddBtn({ textType }) {
  return (
    <>
      <div className={styles.addBtn}>{textType}</div>
    </>
  );
}
// 드롭박스
export function OptionSelect() {
  return (
    <div className={styles.selectWrapper}>
      <select className={styles.select} defaultValue="---- 필수 선택 ----">
        <option>---- 필수 선택 ----</option>
        <option>자료실</option>
        <option>설문 조사</option>
        <option>문의</option>
      </select>
      <div className={styles.selectArrow}></div>
    </div>
  );
}
// 장문 작성
export function TextAreaBox({ textType }) {
  return (
    <div>
      <textarea className={styles.textarea} placeholder={textType} />
    </div>
  );
}
// 파란색 체크박스
export function BlueCheckbox() {
  return (
    <label className={`${styles.checkBox} ${styles.blueCheck}`}>
      <input type="checkbox" />
      <span className={styles.checkmark} />
    </label>
  );
}
// 주황색 체크박스
export function OrangeCheckbox() {
  return (
    <label className={`${styles.checkBox} ${styles.orangeCheck}`}>
      <input type="checkbox" />
      <span className={styles.checkmark} />
    </label>
  );
}
// 파일 첨부
export function FileUpload({ files, setFiles }) {
  const inputRef = useRef(null);

  // 파일 추가
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      className={styles.fileUpload}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      이곳에 파일을 드래그하거나, 클릭하여 <br />
      파일을 첨부하세요
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}

// 파일 목록
export function FileList({ files, setFiles, noShow, uploadUser, editToggle }) {
  const {user} = useAccount();
  const removeFile = (idx) => {
    setFiles((prev) => prev?.filter((_, i) => i !== idx));
  };

  return (
    <ul className="addfileList">
      {files?.map((file, idx) => (
        <li key={idx}>
          <span>
            { noShow ? 
              <>
                <div onClick={() => downloadFileByFileSn(file.fileSn, file.name )}>{file.name ?? file}</div>
              </>
              :
              <>
                {file.name ?? file}
                <DeleteBtn onClick={() => removeFile(idx)} />
              </>
            }
          </span>
        </li>
      ))}
    </ul>
  );
}

// 표
export function Table() {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>#</th>
          <th>유형</th>
          <th>사유</th>
          <th>신청일</th>
          <th>승인여부</th>
          <th>첨부파일</th>
        </tr>
      </thead>
      <tbody>
        <tr className={styles.row}>
          <td>1</td>
          <td>외출</td>
          <td>나간다</td>
          <td>2025-09-11</td>
          <td>Y</td>
          <td>📋</td>
        </tr>
      </tbody>
    </table>
  );
}

export default UiComp;