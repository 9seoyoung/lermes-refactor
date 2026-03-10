import React, { useEffect, useId, useState, useRef } from 'react'
import {FileList, FormInput, SaveBtn } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import {v4 as uuidv4} from "uuid";
import { deletePost, editPostByPostSn, readPostByPostSn } from '../../../services/postService';

import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';
import { downloadByStoredName, findFileSnByFormUuid } from '../../../services/fileService';
import styles from '../../../styles/form.module.css';
import styles2 from "../../../styles/SchedListPopUp.module.css";
import { MessageCircle, Trash2Icon } from 'lucide-react';
import CommentSection from "../../../components/module/Comment/CommentSection";




function BoardRead() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const {postSn} = useParams();
  const userAuth = user?.USER_AUTHRT_SN;
  const userSn = user?.USER_SN;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editToggle, setEditToggle] = useState(true);
  const [files, setFiles] = useState([]);
  const { effectiveSn } = useSelectedCompany();
  const {pathname} = useLocation();
  const [commentToggle, setCommentToggle] = useState(false);

  // 일반 게시글
  const [formData, setFormData] = useState({
    formUuid: postId.current,
    userSn: user?.USER_SN,
    postTtl: "",
    postCn: "", //내용
    type: "",
    bbsScope: "", //공개범위
    postFrstWrtDt: "",     // 최초 작성일시
    postLastMdfcnDt: "", // 최종 수정일시
    postWriterName: user?.USER_NM, // 작성자
    delYn: "-", // 삭제 여부
    files: files,
    viewCnt: 0,
    postSn: 0
  });

  useEffect(()=>{

    const params = {
      effectiveSn: effectiveSn,
      postSn: postSn,
      formData: formData
    };

    (async () => {
      try {
        const {data}  = await readPostByPostSn(params);
        console.log(data);
        setFormData(data);
        const fileData = await findFileSnByFormUuid(data.formUuid);
    console.log(files);
        setFiles(fileData.data.map((v) => ({"name":v.orgnlFileNm, "fileSn": v.fileSn})));
        console.log(fileData.data);
        console.log(files);
      } catch(err) {
        toast.error(err);
      }
    })();
  }, [])

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const deletePost = () => {};


  const saveSubmit = async (e) => {
    e.preventDefault();

  const snapshot = structuredClone
    ? structuredClone({ formData })
    : JSON.parse(JSON.stringify({ formData }));

    const body = { ...snapshot.formData };
    console.log("[will send to server]", JSON.stringify(body, null, 2));
    console.table(snapshot.formData);

    const params = {
      formData: formData,
      postSn: postSn,
      effectiveSn: effectiveSn
    };

    try {
      const res = await editPostByPostSn(params);
      console.log(params);
      toast.success("신청등록 되었습니다.")
      console.log(Object.keys(snapshot)); 
      console.log(Object.keys(snapshot.formData));
      console.log("[RecruitPost] createGroup response:", res);
      navigate(-1);
    } catch (err) {
      toast.error(err.message);
      console.error("[RecruitPost] createGroup error:", err);
    }
  };


  return (
    <div className="boardPage">
      <h2>게시판</h2>
      <div className="limitedHeightBox" style={{height: "706px"}}>
        <h4 style={{ fontWeight: "500" }}>
          <div boxType="row">
          {`[${formData?.bbsType}] ${formData?.postTtl}`}
          <span style={{border: "none", display: "flex", alignItems: "flex-end", height:"100%", gap: "4px", margin: "0 0 14px 4px"}}>
                    { editToggle && formData?.postWriterName === user?.USER_NM ?
                      <button type='button' onClick={() => setEditToggle(false)} className={styles2.grayBtn} style={{width:"3rem", fontSize:"1rem"}} >edit</button>
                      :
                      <></>
                    }
                    {pathname === "/adminHome/boardSet" || formData?.postWriterName === user?.USER_NM || userAuth === 1?
                    <button type='button'
                    className={styles2.redBtn}
                    onClick={async () => {
                      const ok = window.confirm("정말 삭제하시겠습니까?");
                      if (!ok) return; // 취소하면 아무것도 안 함
                      
                      try {
                        await deletePost(postSn);
                        toast.success("삭제되었습니다.", {
                          onClose: () => navigate(-1) // ✅ 토스트 닫힐 때 리로드
                        });
                      } catch (err) {
                        console.error(err);
                        toast.error("삭제 중 오류가 발생했습니다.");
                      }
                    }}
                    >
                      <Trash2Icon size={"1.4rem"} color={"var(--font-color-white)"}/>
                    </button>
                    : null}
              </span>
              <button type={"button"} onClick={() => setCommentToggle(!commentToggle)}>
                <MessageCircle size={14}></MessageCircle>
                {commentToggle ? "댓글 닫기" : "댓글 보기"}</button>

          </div>
          {editToggle ?
            <button type='button' onClick={() => navigate(-1)} className={styles2.grayBtn}>back</button>
            :
            <SaveBtn type='button' onClick={(e) => {setEditToggle(true); saveSubmit(e)}} style={{color: "#fff", marginTop: "4px"}} textType={"저장"}></SaveBtn>
        }
          </h4>
        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
              <BoardEditForm
                  type={formData.type}
                  postId={postId.current}
                  domFormId={domFormId}
                  handleChange={handleChange}
                  formData={formData}
                  FileList={FileList}
                  files={files}
                  setFiles={setFiles}
                  editToggle={editToggle}
              />
          </div>
            {commentToggle ?
            <div className="formArea_R" style={{width: "400px"}}>
                <CommentSection postSn={postSn} />
            </div>: null
            }
          
        </form>
      </div>
    </div>
  );
}

export default BoardRead;


function BoardEditForm({
  domFormId, handleChange, formData, files, formId, setFiles, editToggle
}) {

  return (
    <>
      {editToggle === false ? 
      <div className='formHeader'>
        <div className='inputSet inputTitleSet'>
          <label className='formLabel' htmlFor={`${domFormId}_postTtl`}>제목</label>
          <input
            id={`${domFormId}_postTtl`}
            className='formInput'
            name='postTtl'
            placeholder='제목을 입력하세요.'
            value={formData.postTtl}
            onChange={handleChange}
            disabled = {editToggle}
          />
        </div>
      </div>
        : null }
      <div className="formContent">
            <textarea                 
                id={`${formId}_postCn`}
                name="postCn"
                className='formTextarea'
                placeholder='본문을 입력하세요.'
                value={formData.postCn}
                onChange={handleChange}
                disabled = {editToggle}>
            </textarea>
            <div className='inputSet'>
          </div>
          <div className='inputGrid '>
            <div  className='inputSet'>
              <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
              <FileList files={files} setFiles={setFiles} uploadUser={formData.postWrtrSn} noShow={true} editToggle={editToggle}></FileList>
              <div style={{display:"flex", gap: "12px"}}>
                <p style={{display:"flex", gap: "4px", padding: "2px 4px", background: "var(--bg-color-gray3)", borderRadius: "4px"}}>작성자 |<p>{formData.postWriterName}</p></p>
                <p style={{display:"flex", gap: "4px", padding: "2px 4px", background: "var(--bg-color-gray3)", borderRadius: "4px"}}>조회수 |<p>{formData.viewCnt || 0}</p></p>
              </div>
            </div>
          </div>
      </div>
      </>
  );
}