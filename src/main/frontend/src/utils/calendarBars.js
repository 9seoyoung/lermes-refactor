// src/utils/calendarBars.js
import dayjs from "dayjs";
import { formatDate } from "./dateformat";

// 0패딩
const z2 = (n) => String(n).padStart(2, "0");

// 'YYYY-MM-DD'
export const keyOf = (d) => dayjs(d).format("YYYY-MM-DD");

// 해당 월의 주(week) 그리드 만들기 (셀 그리드와 동일)
export function buildWeeks(year, month /* 1-based */) {
  const first = dayjs(`${year}-${z2(month)}-01`);
  const startDay = first.day(); // 0=일
  const last = first.endOf("month");
  const days = [];

  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= last.date(); d++) days.push(d);

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    const row = days.slice(i, i + 7);
    while (row.length < 7) row.push(null);
    weeks.push(row);
  }
  return weeks; // ex) [ [null, null, 1,2,3,4,5], [6,7,...], ... ]
}

// 날짜 -> (row, col) 맵
export function makeCellIndexMap(year, month, weeks) {
  const map = new Map(); // 'YYYY-MM-DD' -> {row, col}
  weeks.forEach((rowArr, r) => {
    rowArr.forEach((day, c) => {
      if (day) {
        const k = `${year}-${z2(month)}-${z2(day)}`;
        map.set(k, { row: r + 1, col: c + 1 }); // CSS grid는 1-base
      }
    });
  });
  return map;
}

// 월 범위로 잘라내기
export function clampToMonthRange(startISO, endISO, year, month) {
  const monthStart = dayjs(`${year}-${z2(month)}-01T00:00:00`);
  const monthEndExcl = month === 12
    ? dayjs(`${year + 1}-01-01T00:00:00`)
    : dayjs(`${year}-${z2(month + 1)}-01T00:00:00`);

  const s = dayjs(startISO).isAfter(monthStart) ? dayjs(startISO) : monthStart;
  // monthEndExcl - 1ms 를 포함 끝으로
  const e = dayjs(endISO).isBefore(monthEndExcl) ? dayjs(endISO) : monthEndExcl.subtract(1, "millisecond");
  return [s, e];
}

// 해당 주의 남은 칸 수
function remainInWeek(col /*1~7*/) {
  return 8 - col;
}

/**
 * 이벤트(시작~끝) -> "주 경계"에 맞춰 여러 바(segment)로 분할
 * 반환: [{ row, colStart, span, title, fullDays, id, stackKey }]
 */
export function splitIntoWeekSegments(item, year, month, cellIndexMap) {
  const { eventBgngDt, eventEndDt, eventNm, eventSn } = item;
  const [s, e] = clampToMonthRange(eventBgngDt, eventEndDt, year, month);

  // 달력 안에 안 들어오면 없음
  if (e.isBefore(s, "day")) return [];

  const segments = [];
  let cur = s.startOf("day");

  while (cur.isBefore(e, "day") || cur.isSame(e, "day")) {
    const curKey = keyOf(cur);
    const cell = cellIndexMap.get(curKey);
    if (!cell) {
      // (월 외부 null 칸) 다음날로
      cur = cur.add(1, "day");
      continue;
    }

    const row = cell.row;
    const colStart = cell.col;

    // 이번 주의 끝(토요일) 혹은 이벤트 끝 중 더 빠른 날까지 span
    const daysLeftThisWeek = remainInWeek(colStart);
    const daysLeftInEvent = e.diff(cur, "day") + 1; // 끝 포함

    const span = Math.min(daysLeftThisWeek, daysLeftInEvent);

    segments.push({
      id: `${eventSn ?? eventNm}-${curKey}`,
      title: eventNm,
      row,
      colStart,
      span,
      // 전체 길이(호버용)
      fullDays: dayjs(eventEndDt).diff(dayjs(eventBgngDt), "day") + 1,
      // 같은 날짜/행 안에서의 "세로 스택" 구분을 위한 키
      stackKey: curKey,
      raw: item,
    });

    cur = cur.add(span, "day"); // 다음 세그먼트 시작일
  }

  return segments;
}

// /**
//  * 오버레이 바 목록 만들기 + 같은 셀 시작점에서의 스택 인덱스 계산
//  * 반환: [{ id, title, row, colStart, span, z, stackIndex, fullDays }]
//  */
// export function buildOverlayBars(monthlyList, year, month) {
//   const weeks = buildWeeks(year, month);
//   const cellMap = makeCellIndexMap(year, month, weeks);

//   // 1) 모든 이벤트를 주 경계로 쪼갠 세그먼트로 변환
//   const allSegs = [];
//   for (const it of (monthlyList ?? [])) {
//     allSegs.push(...splitIntoWeekSegments(it, year, month, cellMap));
//   }

//   // 2) 같은 (row, colStart) 같은 날에 겹치는 바를 세로로 쌓기
//   //    key = `${row}-${colStart}`
//   const buckets = new Map();
//   for (const seg of allSegs) {
//     const k = `${seg.row}-${seg.colStart}`;
//     if (!buckets.has(k)) buckets.set(k, []);
//     buckets.get(k).push(seg);
//   }

//   const bars = [];
//   for (const [k, list] of buckets.entries()) {
//     // 같은 칸에서의 쌓임 순서(원하면 정렬 규칙 부여 가능: 길이 긴 것 우선 등)
//     list.sort((a, b) => (a.raw?.priority ?? 0) - (b.raw?.priority ?? 0));
//     list.forEach((seg, idx) => {
//       bars.push({
//         ...seg,
//         stackIndex: idx,
//         z: 10 + idx, // 위로 쌓이게 z-index
//       });
//     });
//   }

//   return { weeks, bars };
// }


// src/utils/calendarBars.js
const MAX_BARS_PER_CELL = 4;

export function buildOverlayBars(monthlyList, year, month) {
  if (!Array.isArray(monthlyList)) monthlyList = [];
  const weeks = buildWeeks(year, month);
  const cellMap = makeCellIndexMap(year, month, weeks);

  const allSegs = [];
  for (const it of (monthlyList ?? [])) {
    allSegs.push(...splitIntoWeekSegments(it, year, month, cellMap));
  }

  const buckets = new Map(); // key = `${row}-${colStart}`
  for (const seg of allSegs) {
    const k = `${seg.row}-${seg.colStart}`;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(seg);
  }

  const bars = [];
  for (const [k, list] of buckets.entries()) {
    // 정렬 규칙: 필요시 바꿔도 됨 (길이/우선순위 등)
    list.sort((a, b) => (a.raw?.priority ?? 0) - (b.raw?.priority ?? 0));

   list.forEach((seg, idx) => {
     bars.push({ ...seg, stackIndex: idx, z: 10 + idx });
   });
   // 상위 MAX만 노출
   const visible = list.slice(0, MAX_BARS_PER_CELL);
   const hidden = Math.max(0, list.length - MAX_BARS_PER_CELL);

   visible.forEach((seg, idx) => {
     bars.push({ ...seg, stackIndex: idx, z: 10 + idx });
   });

   // 숨겨진 게 있으면 n 표시 바 추가 (해당 셀 첫 칸에만, span=1)
   if (hidden > 0) {
     const any = visible[visible.length - 1] ?? list[0];
     bars.push({
       id: `more-${k}`,
       title: `${hidden}`,
       row: any.row,
       colStart: any.colStart,
       span: 1,
       stackIndex: visible.length, // 바로 아래 줄에 배치
       z: 100,
       isMore: true,
       fullDays: hidden, // 의미상 값, 사용하진 않음
     });
   }
  }

  return { weeks, bars };
}