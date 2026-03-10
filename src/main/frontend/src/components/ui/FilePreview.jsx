import { useState, useEffect } from "react";
import style from "../../styles/SignUp.module.css";
import { uploadProfileFile, uploadMany } from "../../utils/fileUpload";
import { useAccount } from "../../auth/AuthContext";

function FilePreview({qid, setFiles}) {
  const [preview, setPreview] = useState(null);
  const {user} = useAccount();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; // 여러개면 Array.from(e.target.files)
    if (!file) return;

    try {
      const res = await uploadProfileFile(file, { qid: qid, userSn: user.USER_SN });
      console.log("업로드 성공:", res.data);
    } catch (err) {
      console.error("업로드 실패:", err);
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // 브라우저 임시 URL 생성
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  // 메모리 누수 방지: 언마운트되면 revoke
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => { 
          handleFileChange(e);
          handleFileUpload(e);
        }
      }
        style={{ display: "none" }}
        id="profile-input"
      />
      <label htmlFor="profile-input" style={{ cursor: "pointer" }}>
        {preview ? (
            <img
                src={preview}
                alt="프로필 미리보기"
            />
        ) : (
          <div
            className={style.logoImg}
          >
            로고 180px * 60px
          </div>
        )}
      </label>
    </div>
  );
}

export default FilePreview;
