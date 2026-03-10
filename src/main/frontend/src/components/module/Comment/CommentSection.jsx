import React, {useEffect, useId, useRef, useState} from "react";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import {createComment, pullCommentList} from "../../../services/postService";
import {toast} from "react-toastify";
import { useAccount } from "../../../auth/AuthContext";
import { timeAgo } from "../../../utils/dateformat";

export default function CommentSection({postSn}) {
  const newCommentRef = useRef(null);       // 방금 추가한 댓글 DOM
  const scrollBoxRef = useRef(null);        // 스크롤 컨테이너
  const pollTimerRef = useRef(null);        // 폴링 타이머
  const startedRef = useRef(false);         // StrictMode 가드
  const pendingScrollRef = useRef(false);   // 방금 쓴 댓글 스크롤 플래그

  const { user } = useAccount();
  const commentId = useId();
  const [comments, setComments] = useState([]);
  const [lastAddedId, setLastAddedId] = useState(null); // 방금 추가한 댓글 id

  // ✅ 새 댓글 추가 (맨 아래 추가 + 스크롤 예약)
  const handleAddComment = (newText) => {
    const newId = `${user ? `${user.USER_AUTHRT_SN}-${Date.now()}` : `7-${Date.now()}`}`;
    const newComment = {
      id: newId,
      cmntSn: null,
      userId: null,
      user: user?.USER_NM ?? "방문자",
      time: timeAgo(Date.now()),
      text: newText,
      replies: [],
    };

    (async () => {
      try {
        await createComment(postSn, newComment);
      } catch (err) {
        toast.error(err.message);
      } finally {
        pendingScrollRef.current = true;        // 🔹 스크롤 예약
        setComments(prev => [...prev, newComment]);
        setLastAddedId(newId);
      }
    })();
  };

  // ✅ 방금 쓴 댓글이 렌더된 이후, 컨테이너 내부로만 스크롤
  useEffect(() => {
    if (!pendingScrollRef.current || !lastAddedId) return;

    const box = scrollBoxRef.current;
    const el = newCommentRef.current;
    if (!box || !el) return;

    // 방법 1) 수치 계산 (컨테이너 내부 스크롤)
    const targetTop = el.offsetTop - box.offsetTop;
    const targetBottom = targetTop + el.offsetHeight;
    const nextTop = Math.max(0, targetBottom - box.clientHeight);
    box.scrollTo({ top: nextTop, behavior: "smooth" });

    // 방법 2) 혹시 모를 레이아웃 이슈 대비해서 한 번 더 보정
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });

    pendingScrollRef.current = false; // 한 번만
  }, [comments, lastAddedId]);

  // ✅ 3초 폴링 (요청 종료 후 재예약) + 방금 쓴 댓글 DOM 붙기 전엔 덮어쓰기 보류
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let stopped = false;
    const INTERVAL = 1000;

    const fetchOnce = async () => {
      if (stopped) return;

      // 방금 쓴 댓글이 아직 DOM 처리 중이면 덮어쓰기 보류
      if (pendingScrollRef.current) {
        pollTimerRef.current = setTimeout(fetchOnce, 1000);
        return;
      }

      try {
        const { data } = await pullCommentList(postSn);

        const formatted = (data || [])
          .map((item) => {
            const tsStr = item?.cmntLastMdfcnDt ?? item?.cmntFrstWrtDt;
            const ts = tsStr ? new Date(tsStr).getTime() : 0;

            return {
              id: item?.cmntSn,
              userId: item?.cmntWrtrSn,
              user: item.cmntWrtrNm ?? "알 수 없음",
              time: timeAgo(tsStr ?? Date.now()),
              text: item.cmntCn,
              replies: item?.children ? [...item.children] : [],
            };
          })
          .sort((a, b) => a.ts - b.ts); // 오래된 → 최신

        setComments(formatted);
      } catch (err) {
        toast.error(err.message);
      } finally {
        if (!stopped) {
          pollTimerRef.current = setTimeout(fetchOnce, INTERVAL);
        }
      }
    };

    fetchOnce();

    return () => {
      stopped = true;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      startedRef.current = false;
    };
  }, [postSn]);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        maxWidth: 900,
        margin: "0 auto",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          gap: "4px",
        }}
      >
        <h3>💬 Comments</h3>

        {/* 🔸 스크롤 박스: 여기만 스크롤 */}
        <div style={{ flex: 1, overflowY: "auto" }} ref={scrollBoxRef}>
          <div>
            {comments.map((c) => (
              <div
                key={`${c.id}-${commentId}`}                                  // 고유키만 사용
                ref={c.id === lastAddedId ? newCommentRef : null}  // 새 댓글에만 ref
              >
                <CommentItem comment={c} />
              </div>
            ))}
          </div>
        </div>

        <CommentInput onAddComment={handleAddComment} />
      </div>
    </div>
  );
}