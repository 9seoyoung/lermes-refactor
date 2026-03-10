import { useRef } from "react";
import styles from "./fileUpload.module.css";

// 옵션: 허용 확장자/최대 개수/최대 용량(MB)
const ACCEPT = ".png,.jpg,.jpeg,.pdf,.doc,.docx";
const MAX_COUNT = 2;
const MAX_SIZE_MB = 50;

export function FileUpload({ files, setFiles }) {
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const toKey = (f) => `${f.name}_${f.size}_${f.lastModified}`;

  const handleAdd = (incoming) => {
    const arr = Array.from(incoming);

    // 1) 타입 필터
    const filteredByType = arr.filter((f) => {
      if (!ACCEPT) return true;
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      return ACCEPT.split(",").map((s) => s.trim().toLowerCase()).includes(ext);
    });

    // 2) 용량 필터
    const filteredBySize = filteredByType.filter(
      (f) => f.size <= MAX_SIZE_MB * 1024 * 1024
    );

    // 3) 중복 제거(이름+크기+수정시간 기준)
    const existKeys = new Set(files.map(toKey));
    const deduped = filteredBySize.filter((f) => !existKeys.has(toKey(f)));

    // 4) 최대 개수 제한
    const remain = Math.max(0, MAX_COUNT - files.length);
    const finalList = deduped.slice(0, remain);

    if (finalList.length === 0) return;

    setFiles((prev) => [...prev, ...finalList]);
  };

  const onChange = (e) => {
    if (e.target.files) handleAdd(e.target.files);
    // 같은 파일을 다시 선택할 수 있게 리셋
    e.target.value = "";
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) handleAdd(e.dataTransfer.files);
  };

  return (
    <div
      className={styles.fileUpload}
      onClick={openPicker}
      onDragOver={onDragOver}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
      aria-label="파일 업로드"
    >
      이곳에 파일을 드래그하거나, 클릭하여 <br />
      파일을 첨부하세요
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        style={{ display: "none" }}
        onChange={onChange}
      />
      <div className={styles.helper}>
        허용: {ACCEPT.replaceAll(",", ", ")} · 최대 {MAX_COUNT}개 · 파일당 {MAX_SIZE_MB}MB
      </div>
    </div>
  );
}