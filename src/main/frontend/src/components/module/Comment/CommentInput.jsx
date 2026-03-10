import React, { useState } from "react";

export default function CommentInput({
  onAddComment,
  placeholder = "댓글을 입력하세요...",
}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onAddComment(text);
    setText("");
  };

  return (
    <div style={{ display: "flex", marginTop: 10 }}>
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          padding: 8,
          borderRadius: 5,
          border: "1px solid lightgray",
          fontSize: "0.9rem",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: 8,
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 5,
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        보내기
      </button>
    </div>
  );
}
