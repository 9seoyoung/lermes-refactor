
/**
 * 쿼리스트링으로 헤더에 역할싣어서 원하는 내용 얻기
 * 1. 관리자 - 시스템공지, 직원용공지
 * 2. 방문자(로그인/비로그인 소속아닌사람) - 전체공개공지
 * 3. 강사/학생 -전체공개/일부공개 공지
 * @returns 
 */
export function LineNotice() {
  return (
    <div>SystemNotice</div>
  )
}
