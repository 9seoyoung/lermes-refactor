// src/utils/dateformat.js
import dayjs from "dayjs";

const DEFAULT_FORMAT = "YYYY-MM-DD";

export function formatDate(value, format = DEFAULT_FORMAT) {
  if (!value) return "-";
  return dayjs(value).format(format);
}

export function formatTime(value) {
  if (!value) return "-";
  const [hour, minutes] = String(value).split(':');
  return `${hour}:${minutes}`;
}

/**
 * 끝일 포함 일수 계산 (예: 10/01~10/03 => 3일)
 */
export const diffDaysInclusive = (start, end) => {
  if (!start || !end) return 1;
  const s = new Date(formatDate(start));
  const e = new Date(formatDate(end));
  const ms = e.getTime() - s.getTime();
  return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)) + 1);
};

/**
 * 네가 쓰던 period(dailyTodo)도 유지
 * dailyTodo: [{eventBgngDt, eventEndDt, ...}, ...]
 * return: [일수, 일수, ...]
 */
export function period(dailyTodo) {
  const periodStack = [];
  (dailyTodo ?? []).forEach((v) => {
    const d1 = new Date(formatDate(v.eventBgngDt));
    const d2 = new Date(formatDate(v.eventEndDt));
    const periodMs = d2.getTime() - d1.getTime();
    const days = Math.max(1, Math.floor(periodMs / (1000 * 60 * 60 * 24)) + 1);
    periodStack.push(days);
  });
  return periodStack;
}

/* 내부 유틸 */
const z2 = (n) => String(n).padStart(2, "0");
const fmtKey = (y, m, d) => `${y}-${z2(m)}-${z2(d)}`;

/**
 * 월 범위로 시작/종료를 잘라내기 (해당 월 안에서만 보여주기 위함)
 */
const clampToMonth = (start, end, year, month) => {
  const startLimit = new Date(`${year}-${z2(month)}-01T00:00:00`);
  const endLimit =
    month === 12
      ? new Date(`${year + 1}-01-01T00:00:00`)
      : new Date(`${year}-${z2(month + 1)}-01T00:00:00`);

  const s = new Date(
    Math.max(new Date(formatDate(start)).getTime(), startLimit.getTime())
  );
  const e = new Date(
    Math.min(new Date(formatDate(end)).getTime(), endLimit.getTime() - 1)
  );
  return [s, e];
};

/**
 * 월 달력 렌더용 맵 생성
 * 반환: { 'YYYY-MM-DD': [ { id, title, spanDays, fullDays, raw } ] }
 *  - key: 해당 날짜 셀에서 "시작"되는 바만 넣는다
 *  - spanDays: 해당 월 범위에서 칸을 몇 개 차지하는지
 *  - fullDays: 실제 전체 기간(호버 표기용)
 */
export function buildMonthlyMap(list, year, month) {
  const map = {};
  for (const v of (list ?? [])) {
    if (!v?.eventBgngDt || !v?.eventEndDt) continue;
    const [s, e] = clampToMonth(v.eventBgngDt, v.eventEndDt, year, month);

    const startKey = fmtKey(s.getFullYear(), s.getMonth() + 1, s.getDate());
    const fullDays = diffDaysInclusive(v.eventBgngDt, v.eventEndDt);
    const spanDays = diffDaysInclusive(s, e);

    (map[startKey] ??= []).push({
      id: v.eventSn ?? v.id ?? `${v.eventNm}-${startKey}`,
      title: v.eventNm,
      spanDays,
      fullDays,
      raw: v,
    });
  }
  return map;
}

export function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${diffDay}일 전`;
}