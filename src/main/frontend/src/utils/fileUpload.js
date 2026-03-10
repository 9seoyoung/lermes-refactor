import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// 이미지 크기(가로/세로)까지 뽑고 싶을 때
const readImageSize = (file) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: null, height: null });
    img.src = URL.createObjectURL(file);
  });

export async function uploadProfileFile(file, extra = {}) {
  const id = uuidv4();

  const { width, height } =
    file.type.startsWith("image/") ? await readImageSize(file) : {};

  const meta = {
    id,                          // 클라에서 생성한 uuid
    originalName: file.name,     // 원본 파일명
    size: file.size,             // 바이트
    mimeType: file.type,         // MIME
    lastModified: file.lastModified, // epoch(ms)
    width, height,               // 이미지면 픽셀 크기
    ...extra,                    // 사용자 정의 메타(예: userSn, category 등)
  };

  const fd = new FormData();
  fd.append("file", file, file.name);
  // JSON을 'meta' 파트로 붙임 (서버에서 @RequestPart("meta")로 받기 좋음)
  fd.append("meta", new Blob([JSON.stringify(meta)], { type: "application/json" }));

  return axios.post("/api/profile/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function uploadMany(files) {
  const fd = new FormData();
  const metas = [];

  for (const f of files) {
    const id = uuidv4();
    const { width, height } = f.type.startsWith("image/") ? await readImageSize(f) : {};
    metas.push({
      id, originalName: f.name, size: f.size, mimeType: f.type,
      lastModified: f.lastModified, width, height
    });
    fd.append("files", f, f.name); // 서버에서 List<MultipartFile> files
  }
  fd.append("metas", new Blob([JSON.stringify(metas)], { type: "application/json" }));

  return axios.post("/api/profile/uploadMany", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}