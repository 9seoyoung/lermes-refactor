// src/utils/normalize.js
import { formatDate, formatTime } from "./dateformat";

/** 면담 대상(scope) → 서버 공개범위 코드 매핑 */
export function mapScopeToInterviewAuth(scope) {
  switch (scope) {
    case "강사":
      return "INSTRUCTOR";
    case "직원":
      return "EMPLOYEE";
    case "대표":
      return "REPRESENTATIVE";
    default:
      return "";
  }
}

/** "YYYY-MM-DD" + "HH:mm" → ISO-ish 문자열(초까지) */
export function joinDateTime(dateStr, timeStr) {
  if (!dateStr && !timeStr) return "";
  const d = (dateStr && typeof dateStr === "string") ? dateStr : formatDate(new Date());
  const t = (timeStr && typeof timeStr === "string") ? timeStr : "00:00";
  // 초가 없으면 :00 붙여줌
  const hhmm = /^\d{2}:\d{2}(:\d{2})?$/.test(t) ? (t.length === 5 ? `${t}:00` : t) : "00:00:00";
  return `${d}T${hhmm}`;
}

/** 서버 → 폼 (면담 읽기/수정 시 사용) */
function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return "";
}

export function normalizeSchedulePayload(payload = {}) {
  const {
    // 원본 가능 키들
    calSn,
    cohortSn,
    prvtYn,               // 0 | 1 | true | false
    title,
    memo,                 // 본문
    content,              // 혹시 서버가 content로 줄 수도 있음
    location,
    userNm,               // 작성자 표시용
    author,               // 혹시 존재하면 사용
    viewCnt,

    // 날짜/시간 1안: 분리되어 오는 경우
    startDate, endDate, startTime, endTime,

    // 날짜/시간 2안: ISO로 묶여 오는 경우
    eventBgngDt,          // e.g. 2025-09-18T09:00:00
    eventEndDt,           // e.g. 2025-09-20T12:00:00

    // 그 외 있어도 무시하지 않게 나중에 스프레드 가능
  } = payload;

  // 우선순위: 분리필드 > event*에서 파생
  const [bgDateFromIso, bgTimeFromIso] = formatDate(eventBgngDt);
  const [edDateFromIso, edTimeFromIso] = formatTime(eventEndDt);

  const normStartDate = firstNonEmpty(startDate, bgDateFromIso);
  const normEndDate   = firstNonEmpty(endDate,   edDateFromIso, normStartDate); // 없으면 시작일로
  const normStartTime = firstNonEmpty(startTime, bgTimeFromIso);
  const normEndTime   = firstNonEmpty(endTime,   edTimeFromIso);

  // prvtYn → boolean(isPrivate)로 정규화
  const isPrivate =
    prvtYn === 1 || prvtYn === "1" || prvtYn === true || prvtYn === "Y";

  return {
    // 식별자
    calSn: calSn ?? null,
    cohortSn: cohortSn ?? null,

    // 화면에서 쓰는 필드들
    title: title ?? "",
    content: firstNonEmpty(content, memo),     // 네 폼은 content를 씀
    location: location ?? "",
    author: firstNonEmpty(author, userNm),     // 네 폼에는 author가 있음
    userNm: userNm ?? "",                      // 필요하면 같이 보존

    startDate: normStartDate,
    endDate: normEndDate,
    startTime: normStartTime,
    endTime: normEndTime,

    // 공개/비공개 (체크박스는 boolean)
    isPrivate,
    // 원시값도 화면 어딘가에서 그대로 보여주는 것 같아서 같이 보존
    prvtYn: prvtYn ?? 0,
    calType: prvtYn ? "개인 일정" : "공식 일정",

    // 기타
    viewCnt: viewCnt ?? 0,
  };
}

export function normalizeInterviewPayload(payload = {}) {
  const {
    itvSn,
    coSn,
    cohortSn,
    itvAplyTtl,
    itvAplyCn,
    itvAplyDt,     // e.g. "2025-09-24T14:29:42"
    itvPicAutht,   // 혹시 서버가 오타로 보내는 경우
    itvPicAuthrt,  // 정식 키
    itvAplcntNm,
    mento,
    place,
    itvPicAns,
    files,
    itvCfmtnDt

  } = payload;

  // 날짜/시간 분리
  const day = itvAplyDt ? formatDate(itvCfmtnDt) : "";
  const time = itvAplyDt ? formatTime(String(itvCfmtnDt).split("T")[1]?.slice(0,5)) : "";

  return {
    // 식별자/참조
    itvSn: itvSn ?? null,
    coSn: coSn ?? null,
    cohortSn: cohortSn ?? null,

    // 본문
    itvAplyTtl: itvAplyTtl ?? "",
    itvAplyCn: itvAplyCn ?? "",
    type: "면담신청",

    // 공개범위 키 보정
    itvPicAuthrt: itvPicAuthrt ?? itvPicAutht ?? "",

    itvAplcntNm: itvAplcntNm ?? "",
    mento: mento ?? "",
    place: place ?? "",
    itvPicAns: itvPicAns ?? "",

    // 분리된 날짜/시간
    itvDay: day,
    itvTime: time,

    // 파일
    files: Array.isArray(files) ? files : [],
  };
}

/** 저장용: 일반/설문/일정 공통 Post JSON */
export function buildPostJson({
  formData,
  surveyForm,
  cohortSn,
  userAuth,
  formUuid,
}) {
  const base = {
    id: formData.id,
    userSn: formData.userSn,
    title: formData.title,
    content: formData.content,
    coSn: formData.coSn,
    type: formData.type,
    cohortSn, // 우선순위: 외부 주입
    scope: formData.scope,
    detailScope:
      (formData.scope === "그룹공개" && userAuth > 3) ? cohortSn : formData.detailScope,
    detailScopeNm: formData.detailScopeNm,
    startDate: formData.startDate,
    endDate: formData.endDate,
    startTime: formData.startTime,
    location: formData.location,
    isPrivate: formData.isPrivate,
    formUuid,
  };

  // 설문만 surveyForm 포함
  if (formData.type === "설문조사") {
    return { ...base, surveyForm };
  }
  return base;
}

/** 저장용: 면담 신청 JSON (서버 키 규격에 맞춤) */
export function buildInterviewJson({
  formData,
  cohortSn,
  formUuid,
}) {
  const itvPicAuthrt = mapScopeToInterviewAuth(formData.scope);
  const itvAplyDt = joinDateTime(formData.startDate, formData.startTime);

  return {
    // 서버 인터뷰 규격 예상 키
    formUuid,                // 업로드 귀속 등 추적용
    coSn: formData.coSn,
    cohortSn,
    itvAplyTtl: formData.title,
    itvAplyCn: formData.content,
    itvPicAuthrt,            // 공개범위(대상역할)
    itvAplcntNm: formData.author ?? "", // 작성자 이름
    mento: formData.mento ?? "",
    place: formData.location ?? "",
    itvAplyDt,               // 희망 일시(있으면)
    // 파일 첨부는 별도 업로드 API 사용
  };
}

/** 저장용: 일정 JSON (캘린더 registToDo 규격에 맞춤) */
export function buildScheduleJson({
  formData,
  cohortSn,
  userAuth,
  formUuid,
}) {
  // 필요에 맞게 조정: 여기선 최소 키들만 구성
  return {
    formUuid,
    title: formData.title,
    content: formData.content,
    coSn: formData.coSn,
    cohortSn,
    scope: formData.scope,
    detailScope:
      (formData.scope === "그룹공개" && userAuth > 3) ? cohortSn : formData.detailScope,
    startDate: formData.startDate,
    endDate: formData.endDate,
    startTime: formData.startTime,
    location: formData.location,
    isPrivate: formData.isPrivate,
  };
}


// utils/buildScheduleUpdateBody.js
const z2 = (n) => String(n).padStart(2, "0");

// 'HH:mm' → 'HH:mm:ss' 보정
function toHHmmss(t) {
  if (!t) return "";
  const s = String(t);
  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
  if (/^\d{1}:\d{2}$/.test(s)) return `0${s}:00`;
  if (/^\d{2}:\d{2}$/.test(s)) return `${s}:00`;
  return s; // 이미 ss 포함 등
}

/** formData → 서버 DTO 바디로 변환 */
export function buildScheduleUpdateBody(fd = {}) {
  const {
    calSn, cohortSn,
    title, content, memo, location,
    isPrivate, prvtYn,
    startDate, endDate, startTime, endTime,
  } = fd;

  // 프론트 boolean/문자 → 서버 0|1
  const prvt = typeof prvtYn !== "undefined"
    ? (String(prvtYn) === "1" || prvtYn === 1 ? 1 : 0)
    : (isPrivate ? 1 : 0);

  return {
    calSn: calSn ?? null,
    cohortSn: cohortSn ?? null,

    title: title ?? "",
    memo: memo ?? content ?? "",     // 서버는 memo 사용
    location: location ?? "",
    prvtYn: prvt,                    // 0 | 1

    // 서버 DTO가 start/end 를 문자열로 받는 형태이므로 그대로 전달(시:분:초로 정규화)
    startDate: startDate ?? "",
    endDate: endDate || startDate || "",
    startTime: toHHmmss(startTime || "00:00"),
    endTime: toHHmmss(endTime || "23:59"),
  };
}