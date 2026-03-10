import React, { useState, useEffect, forwardRef } from "react";
import {MessageCircle, MoreVertical, StopCircle, StopCircleIcon} from "lucide-react";
import CommentInput from "./CommentInput";
import {useAccount} from "../../../auth/AuthContext";
import {toast} from "react-toastify";
import {deleteComment} from "../../../services/postService";
import {FcDeleteDatabase, FcDeleteRow} from "react-icons/fc";
import {FiDelete} from "react-icons/fi";
import {TiUserDelete} from "react-icons/ti";
import {RiDeleteBack2Fill} from "react-icons/ri";

const CommentItem = forwardRef(function CommentItem(
  { comment, onAddReply, isReply = false, style },   // ← style 받기
  ref                                                 // ← ref 받기
) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hovering, setHovering] = useState(false);
  const {user} = useAccount();
  const userAuth = user.USER_AUTHRT_SN;
  const userSn = user.USER_SN;
  const handleReplySubmit = (replyText) => {
    onAddReply?.(comment.id, replyText);
    setShowReplyInput(false);
    setShowReplies(true);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleDelete = () => {
      (async () => {await deleteComment(comment.id)})();
  }

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: isReply ? "#f9fafb" : "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "12px 16px",
        marginBottom: 10,
        marginLeft: isReply ? 28 : 0,
        boxShadow: isReply ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "background 0.2s",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setShowMenu(false);
      }}
    >
      {/* ⋯ 메뉴 버튼 (hover 시 상단 오른쪽에 표시) */}


      {/* 👤 작성자 + 시간 (한 줄) */}
      <div
      ref={ref}   // ← 여기!
      style={{
        position: "relative",
        backgroundColor: isReply ? "#f9fafb" : "#ffffff",
        marginLeft: isReply ? 28 : 0,
        transition: "background 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 6,
          marginBottom: 6,
          fontWeight: "bold",
          color: "#111827",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setShowMenu(false);
      }}
    >
          <div  style={{  display: "flex",
                  alignItems: "center",
                  gap: 6,}}>
        <p>{comment.user}</p>
        <p style={{ fontWeight: "normal", color: "gray", fontSize: "0.8rem" }}>
          · {comment.time}
        </p>
          </div>

          { ((userAuth <= 2 || userSn === comment.userId) && hovering) && (
              <div style={{ position: "relative", zIndex: 15, cursor: "pointer", color: "#6b7280" }}
                   // onClick={() => setShowMenu((prev) => !prev)}
                   onClick={handleDelete}

              >
                  <RiDeleteBack2Fill size={14}/>
                  {/*<MoreVertical*/}
                  {/*    size={14}*/}
                  {/*/>*/}
                  {showMenu && (
                      <div
                          style={{
                              position: "absolute",
                              top: 20,
                              right: 0,
                              background: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: 6,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                          }}
                      >
                          {/*<div style={menuItem} onClick={() => alert("✏️ 수정 클릭됨")}>*/}
                          {/*    ✏️ 수정*/}
                          {/*</div>*/}
                          {/*<div style={menuItem} onClick={handleDelete}>*/}
                          {/*    🗑️ 삭제*/}
                          {/*</div>*/}
                      </div>
                  )}
              </div>
          )}

      </div>

      {/* 본문 */}
      <p style={{ margin: 0, color: "#374151", lineHeight: "1.5" }}>{comment.text}</p>

      {/* 👇 답글 보기 / 말풍선 입력창 토글 */}
      {/*!isReply && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setShowReplies(!showReplies)}
            style={textBtn}
          >
            {showReplies
              ? "▼ 답글 숨기기"
              : `▶ ${hasReplies ? `${comment.replies.length}개의 답글 보기` : "답글 보기"}`}
          </button>

          <div
            onClick={() => setShowReplyInput(!showReplyInput)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#2563eb",
            }}
            title="답글 달기"
          >
            <MessageCircle size={16} />
          </div>
        </div>
      )}

      🧩 답글 리스트
      {showReplies && hasReplies && (
        <div
          style={{
            marginTop: 10,
            marginLeft: 24,
            borderLeft: "2px solid #e5e7eb",
            paddingLeft: 12,
          }}
        >
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onAddReply={onAddReply}
              isReply={true}
            />
          ))}
        </div>
      )}

      {/* ✏️ 입력창 (말풍선 클릭 시) */}
      {showReplyInput && (
        <div style={{ marginTop: 10, marginLeft: isReply ? 10 : 24 }}>
          <CommentInput
            onAddComment={handleReplySubmit}
            placeholder="답글을 입력하세요..."
          />
        </div>
      )}
    </div>
  );
});

export default CommentItem;

const textBtn = {
  background: "none",
  border: "none",
  color: "#2563eb",
  fontSize: "0.8rem",
  cursor: "pointer",
  padding: 0,
};

const menuItem = {
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "0.85rem",
  color: "#374151",
  whiteSpace: "nowrap",
  transition: "background 0.2s",
  borderRadius: 4,
  userSelect: "none",
  hover: { background: "#f3f4f6" },
};



