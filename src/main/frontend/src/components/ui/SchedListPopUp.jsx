// src/components/calendar/SchedListPopUp.jsx
import React, { useState, useMemo } from "react";
import { SaveBtn, CancelBtn, DateTimeInput, FormInput } from "./UiComp.jsx";
import styles from "../../styles/SchedListPopUp.module.css";
import { registToDo } from "../../services/calService.js";
import { useAccount } from "../../auth/AuthContext.jsx";
import { useLocation } from "react-router-dom";

function getInitialDate(selectedDate) {
  // yyyy-mm-dd
  return (selectedDate && String(selectedDate).slice(0, 10)) || new Date().toISOString().split("T")[0];
}

function SchedListPopUp({ onClose, onSave, selectedDate }) {
  const initialDate = useMemo(() => getInitialDate(selectedDate), [selectedDate]);
  const { user } = useAccount();
  const { pathname } = useLocation();
  const [showOptions, setShowOptions] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    memo: "",
    startDate: initialDate,
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    isPrivate: 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (typeof formData.title !== "string" || !formData.title.trim()) {
      alert("제목을 입력해줘.");
      return;
    }
    if (!formData.startDate) {
      alert("시작일을 선택해줘.");
      return;
    }
    if (formData.endDate && formData.endDate < formData.startDate) {
      alert("종료일은 시작일 이후여야 해.");
      return;
    }
    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      alert("종료 시간은 시작 시간 이후여야 해.");
      return;
    }

    try {
      const res = await registToDo(formData);
      onSave?.(res?.data ?? formData);
    } catch (err) {
      console.error("[SchedListPopUp] registToDo error:", err);
      alert("저장 중 오류가 발생했어.");
      return;
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.container} ${showOptions ? styles.containerExpanded : styles.containerCollapsed}`}>
        {/* 상단 */}
        <div className={styles.header}>
          <input
            placeholder="제목 입력"
            className={styles.schedTitle}
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <div className={styles.popUpBtn}>
            <SaveBtn onClick={handleSave} textType="저장" />
            <CancelBtn onClick={onClose} textType="취소" />
          </div>
        </div>

        <hr style={{ width: "330px", marginTop: "10px" }} />

        {/* 메모 */}
        <div className={styles.memo}>
          <textarea
            rows={4}
            placeholder="메모를 입력하세요"
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        {/* 옵션 토글 */}
        <div className={`${styles.optionsToggle} ${styles.optionHeader}`} onClick={() => setShowOptions((s) => !s)}>
          <div>
            <span className={`${styles.arrow} ${showOptions ? styles.arrowOpen : ""}`}>▼</span>
            상세보기
          </div>
          { user?.USER_AUTHRT_SN <= 3 && pathname === "/adminHome" ? (
            <div className={styles.private}>
              <input
                type="checkbox"
                name="isPrivate"
                checked={!!formData.isPrivate}
                onChange={handleChange}
                id="privateBox"
              />
              <label htmlFor="privateBox">비공개</label>
            </div>
          ) : null}
        </div>

        {/* 옵션 내용 */}
        {showOptions && (
          <div className={styles.optionsContent}>
            <div className={styles.content}>
              <DateTimeInput
                type="date"
                name="startDate"
                addLabelStyle="formLabel"
                labelNm={"시작일"}
                value={formData.startDate}
                formData={formData}
                disabled={false}
                handleChange={handleChange}
              />
            </div>

            <div className={styles.content}>
              <DateTimeInput
                type="date"
                name="endDate"
                labelNm={"종료일"}
                addLabelStyle="formLabel"
                value={formData.endDate}
                formData={formData}
                handleChange={handleChange}
                disabled={false}
              />
            </div>

            <div className={styles.content}>
              <div className={styles.timeInput}>
                <DateTimeInput
                  type="time"
                  name="startTime"
                  labelNm={"시간"}
                  addLabelStyle="formLabel"
                  value={formData.startTime}
                  formData={formData}
                disabled={false}
                handleChange={handleChange}
                />
                <div>~</div>
                <DateTimeInput
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  formData={formData}
                disabled={false}
                handleChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.content}>
              <FormInput 
                labelNm={"장소"}
                  type="text"
                  name="location"
                  addLabelStyle="formLabel"
                  value={formData.location}
                  formData={formData}
                disabled={false}
                handleChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SchedListPopUp;