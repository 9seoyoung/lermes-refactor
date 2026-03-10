import { DateTimeInput, FileList, FormInput } from "../../../components/ui/UiComp"
import styles from "../../../styles/SchedListPopUp.module.css";
import React from "react";
import {useLocation} from "react-router-dom";
import {useAccount} from "../../../auth/AuthContext";

export const SchedPost = ({formId, handleChange, formData, prvToggle, setPrvToggle, setFormData}) => {
    const {pathname} = useLocation();
    const {user} = useAccount();
  return (
    <>
        <div className='formHeader'>
            <div className='inputSet'>
              <label className='formLabel' htmlFor={`${formId}_title`}>제목</label>
              <input
                id={`${formId}_title`}
                className='formInput'
                name='title'
                placeholder='제목을 입력하세요.'
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            { user?.USER_AUTHRT_SN <= 3 && pathname !== "/adminHome" ? (
                <div className={styles.private}>
                  <label htmlFor="privateBox">개인</label>
                    <input
                        type="checkbox"
                        name="isPrivate"
                        checked={!!formData.isPrivate}
                        onChange={(e) => {setPrvToggle(v => !v); handleChange(e);}}
                        id="privateBox"
                    />
                </div>
            ) : null}
        </div>
        {/* 본문 */}
        <textarea
            id={`${formId}_content`}
            name="content"
            className='formTextarea'
            placeholder='본문을 입력하세요.'
            value={formData.content}
            onChange={handleChange}>
        </textarea>
    </>
  )
}