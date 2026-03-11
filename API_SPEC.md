## 프로젝트 API 명세서

이 문서는 현재 백엔드(Spring Boot)에서 제공하는 주요 REST API를 요약한 것입니다.  
아래 하단의 **DTO 구조** 섹션에 주요 응답 DTO 필드 구조를 정리했습니다.

---

## 인증 / 회원 (AuthController, UserProfileController)

- **이메일 인증 코드 발송**
  - **POST** `/api/email/code`
  - **Body**: `EmailCodeRequest`
  - **설명**: 회원가입 전에 이메일 사용 가능 여부 확인 및 인증 코드 발송

- **일반 회원가입**
  - **POST** `/api/signup`
  - **Body**: `GeneralSignupDto`

- **테넌트(기업) 회원가입**
  - **POST** `/api/signup/tenant`
  - **Body**: `TenantSignupDto`

- **로그인**
  - **POST** `/api/login`
  - **Body**: `LoginRequestDto { email, password }`
  - **설명**: 세션 기반 로그인, `JSESSIONID` 세션 생성

- **내 정보 조회 (Landing용)**
  - **GET** `/api/me`
  - **응답 예시 필드**: `USER_SN, USER_NM, USER_EML_ADDR, USER_AUTHRT_SN, USER_OGDP_CO_SN, USER_COHORT_SN, HOME_PATH` 등

- **로그아웃**
  - **POST** `/api/logout`
  - **설명**: 세션 만료 및 `JSESSIONID` 쿠키 제거

- **아이디 찾기**
  - **POST** `/api/find-id`
  - **Body**: `FindIdRequest`

- **비밀번호 재설정 - 인증 코드 발송**
  - **POST** `/api/new-password/code`
  - **Body**: `EmailCodeRequest`

- **비밀번호 재설정 - 최종 변경**
  - **POST** `/api/new-password/confirm`
  - **Body**: `PasswordResetConfirmRequest`

- **마이페이지 - 프로필 조회**
  - **GET** `/api/user-profile`
  - **Auth**: 로그인 필요
  - **Response**: `ApiResponse<UserProfileResponse>`

- **마이페이지 - 프로필 수정**
  - **POST** `/api/user-profile/info`
  - **Body**: `UpdateUserProfileRequest { userEmlAddr, userTelno, userProfileImage }`
  - **Response**: `SimpleResponse` (`email`, `phoneNumber`, `fileSn` 포함)

- **마이페이지 - 비밀번호 변경**
  - **POST** `/api/user-profile/password/change`
  - **Body**: `PasswordChangeRequest { currentPassword, newPassword ... }`

---

## 회사 / 과정 (CompanyController, CohortController, CohortMemberController)

- **회사 목록 조회**
  - **GET** `/api/public/company`
  - **Response**: `List<Company>`

- **회사 + 모집 상태 요약 목록**
  - **GET** `/api/public/company/gogo`
  - **Response**: `List<Map<String, Object>>` (회사 및 상태 정보)

- **회사 단건 조회**
  - **GET** `/api/public/company/{id}`
  - **Path**: `id` = 회사 PK

- **회사 상세(+상태) 조회**
  - **GET** `/api/public/company/{id}/detail`
  - **Response**: `CompanyWithStatusDto`

- **전체 코호트(과정) 목록**
  - **GET** `/api/cohorts`
  - **Response**: `List<Cohort>`

- **코호트 단건 조회 (리크루팅 정보 포함)**
  - **GET** `/api/cohorts/{id}`
  - **Response**: `CohortRecruitDto`

- **특정 회사의 코호트 목록 + 모집 상태**
  - **GET** `/api/cohorts/company/{coSn}`
  - **Response**: `{ cohorts: List<Cohort>, stts: "RECRUITING" | null }`

- **코호트 생성**
  - **POST** `/api/cohorts/setgroup`
  - **Body**: `CohortDto`
  - **Response**: 저장된 `Cohort`

- **코호트 수정**
  - **PUT** `/api/cohorts/{id}`
  - **Body**: `Cohort` (수정 필드들)

- **코호트 삭제**
  - **DELETE** `/api/cohorts/{id}`

- **모든 코호트 제목 목록**
  - **GET** `/api/cohorts/titles`
  - **Response**: `List<String>`

- **특정 코호트 신청자 목록**
  - **GET** `/api/cohort-member/cohort/{cohortSn}/applicants`
  - **Response**: `List<CohortMemberDto>`

- **코호트 수강신청**
  - **POST** `/api/cohort-member/apply`
  - **Query**: `userSn`, `cohortSn`

- **코호트 지원자 승인**
  - **POST** `/api/cohort-member/{memberId}/approve`
  - **Body**: `{ companySn, cohortSn }`

- **코호트 지원자 반려**
  - **POST** `/api/cohort-member/{memberId}/reject`

---

## 게시판 / 댓글 (PostController, CommentController)

- **게시글 생성**
  - **POST** `/api/posts`
  - **Body**: `PostRequestDto`
  - **Auth**: 로그인 (작성자 정보는 서버에서 추출)

- **게시글 단건 조회**
  - **GET** `/api/posts/{postSn}`
  - **Response**: `PostResponseDto`

- **게시글 목록 조회**
  - **GET** `/api/posts`
  - **Query(옵션)**:
    - `coSn` : 회사 번호
    - `cohortSn` : 코호트 번호
    - `bbsType` : 게시판 유형(Enum, 예: `NOTICE`, `SURVEY` 등)
  - **Response**: `List<PostResponseDto>`

- **게시글 수정**
  - **PUT** `/api/posts/{postSn}`
  - **Body**: `PostRequestDto` (내부에서 `postSn` 세팅)

- **게시글 삭제 (Soft Delete)**
  - **DELETE** `/api/posts/{postSn}`

- **댓글 생성 (원댓글/대댓글 공통)**
  - **POST** `/api/comments/{postSn}`
  - **Body**: `CommentDto`
  - **설명**: 서버에서 `postSn`, 작성자, 작성일 등 세팅 후 저장

- **특정 게시글의 댓글 트리 조회**
  - **GET** `/api/comments/{postSn}`
  - **Response**: `List<CommentDto>` (트리 구조)

- **댓글 수정**
  - **PUT** `/api/comments/{cmntSn}`
  - **Body**: `CommentDto`

- **댓글 삭제 (Soft Delete)**
  - **DELETE** `/api/comments/{cmntSn}`

---

## 설문 / 설문 응답 (SurveyController, SrvyResponseController)

- **설문 생성**
  - **POST** `/api/survey/post`
  - **Body**: `RequestSurveyDto`
  - **Auth**: 로그인 (userSn, roleId 서버에서 추출)

- **설문 단건 조회**
  - **GET** `/api/survey/{srvySn}`
  - **Response**: `ResponseSurveyDto`
  - **설명**: 권한/회사/코호트 검증 포함

- **설문 목록 조회**
  - **GET** `/api/survey/list/{coSn}`
  - **Query(옵션)**:
    - `coSn`
    - `cohortSn`
    - `bbsType` (게시판 유형)
  - **Response**: `List<ResponseSurveyDto>`

- **설문 수정**
  - **PUT** `/api/survey/{srvySn}`
  - **Body**: `RequestSurveyDto`

- **설문 삭제**
  - **DELETE** `/api/survey/{srvySn}`

- **설문 응답 등록/수정**
  - **POST** `/api/surveys/{srvySn}/responses`
  - **Body**: `SrvyRequestResponseDto`
  - **설명**: 서버에서 `userSn`, `parentSn(srvySn)`, `roleId`, `coSn`, `cohortSn` 세팅

- **설문 응답 리스트 조회**
  - **GET** `/api/surveys/{srvySn}/list`
  - **Response**: `List<SrvyResponseResponseDto>`
  - **권한**:
    - 관리자: 전체 응답
    - 수강생: 본인 응답만

- **설문 응답 삭제 (Soft Delete)**
  - **DELETE** `/api/surveys/responses/{responseSn}`

---

## 출결 (AttendController)

> 기본 Base URL: `/api/attend`

- **강사: 출석 코드 생성**
  - **POST** `/api/attend/code`
  - **Body**: `CreateAttendCodeRequest`
  - **Auth**: `ROLE_INSTRUCTOR`
  - **Response**: `SimpleResponse { ok, message, data: { code } }`

- **현재 활성 코드 조회 (강사/학생)**
  - **GET** `/api/attend/code`
  - **Auth**: `ROLE_INSTRUCTOR` 또는 `ROLE_STUDENT`

- **학생: 코드로 출석 체크**
  - **POST** `/api/attend/checkin`
  - **Body**: `SubmitAttendRequest { code, ... }`
  - **Auth**: `ROLE_STUDENT`

- **학생: 퇴실 처리**
  - **POST** `/api/attend/checkout`
  - **Auth**: `ROLE_STUDENT`

- **학생: 오늘 입·퇴실 상태 조회**
  - **GET** `/api/attend/status/today`
  - **Auth**: `ROLE_STUDENT`

- **강사: 출석 코드 강제 만료**
  - **DELETE** `/api/attend/code`
  - **Auth**: `ROLE_INSTRUCTOR`

- **강사: 오늘 기수 학생 출결 현황**
  - **GET** `/api/attend/today/list`

- **관리자/테넌트: 특정 코호트의 오늘 출결 현황**
  - **GET** `/api/attend/today/list/cohort/{cohortSn}`

- **학생: 월별 출결 요약**
  - **GET** `/api/attend/summary`
  - **Auth**: `ROLE_STUDENT`

- **관리자: 교육 과정별 결석 현황 (당일)**
  - **GET** `/api/attend/absence/by-cohort/today`

- **학생: 출결 인정 요청 생성**
  - **POST** `/api/attend/adjust`
  - **Body**: `AttendAdjustCreateRequest`

- **학생: 내 출결 인정 요청 목록 (페이징)**
  - **GET** `/api/attend/adjust/my?page=&size=...`

- **관리자: 출결 인정 요청 목록 (회사 기준, 페이징)**
  - **GET** `/api/attend/adjust/admin`
  - **GET** `/api/attend/admin` (관리자용 전체 목록, 다른 포맷)

- **관리자: 출결 인정 요청 상태 변경**
  - **PUT** `/api/attend/adjust/{id}/status`
  - **Body**: `{ status: "APPROVED" | "REJECTED" | ... }`

- **관리자: 신규 출석인정 요청 개수**
  - **GET** `/api/attend/absence-requests/count`
  - **Header**: `X-Effective-Sn: <회사/코호트 번호>`

---

## 면담 (InterviewController)

> Base URL: `/api/interview`

- **면담 신청**
  - **POST** `/api/interview/apply`
  - **Body**: `CmmnMap` (면담 제목/내용/희망 등 포함)
  - **Auth**: 로그인 사용자

- **면담 확정 전 신청 삭제**
  - **DELETE** `/api/interview/delete/{itvSn}`

- **내 면담 요청 목록**
  - **GET** `/api/interview/my-requests`
  - **GET** `/api/interview/my-requests/{cohortSn}`
  - **설명**: 역할별(cohortSn, coSn) 분기 로직 포함

- **면담 상세 조회**
  - **GET** `/api/interview/read/{itvSn}`
  - **Response**: `CmmnMap` (면담 정보 + 파일 목록 `files`)

- **면담 확정 (시간/장소 지정 + 캘린더 연동)**
  - **PUT** `/api/interview/confirm/{itvSn}`
  - **Body**: `CmmnMap`  
    - 필수: `itvDay`(yyyy-MM-dd), `itvTime`(HH:mm)  
    - 옵션: `itvPlc`, `itvPicAns` 등

---

## 파일 (FileController)

> Base URL: `/api/files`

- **파일 다중 업로드**
  - **POST** `/api/files`
  - **Content-Type**: `multipart/form-data`
  - **Parts**:
    - `files`: `List<MultipartFile>`
    - `formUuid` (optional)
  - **Response**: `List<UploadResultDTO>`

- **저장 파일명으로 미리보기 (inline)**
  - **GET** `/api/files/{storedFileName}/preview`
  - **Query(옵션)**: `original` (원본 파일명)

- **파일 SN으로 미리보기**
  - **GET** `/api/files/id/{fileSn}/preview`

- **저장 파일명으로 다운로드 (attachment)**
  - **GET** `/api/files/{storedFileName}`

- **파일 SN으로 원본 이름 조회**
  - **GET** `/api/files/id/{fileSn}/name`

- **파일 SN으로 다운로드 (attachment)**
  - **GET** `/api/files/id/{fileSn}`

- **formUuid로 파일 메타 조회**
  - **GET** `/api/files/formUuid/{formUuid}`
  - **Response**: `List<CmmnMap>` (파일 SN/이름 등)

---

## 기타

이 외에도 `CalendarController`, `StudyScheduleController`, `CompanyLogoController`, `UserDetailController` 등 추가 컨트롤러가 존재할 수 있습니다.  

---

## DTO 구조

### 공통 Wrapper

- **ApiResponse** (`com.kdt.KDT_PJT.auth.dto.ApiResponse`)
  - `ok`: `boolean`
  - `message`: `String`
  - `data`: `Object` (엔드포인트별 실제 payload)

- **SimpleResponse** (`com.kdt.KDT_PJT.attend.dto.SimpleResponse`)
  - `ok`: `boolean`
  - `message`: `String`
  - `data`: `Object`

---

### Auth / UserProfile

- **UserProfileResponse** (`com.kdt.KDT_PJT.auth.dto.mypage.UserProfileResponse`)
  - `name`: `String` - 회원명
  - `status`: `String` - 수강 상태 (enabled 여부를 문자열로 표현)
  - `phoneNumber`: `String` - 휴대폰 번호
  - `email`: `String` - 이메일
  - `courseName`: `String` - 과정명
  - `cohortName`: `String` - 소속 기수명 (예: "10기")
  - `companyName`: `String` - 회사명
  - `brNo`: `String` - 사업자번호
  - `userProfileImage`: `Long` - 프로필 이미지 파일 SN

---

### 게시판 / 댓글

- **PostResponseDto** (`com.kdt.KDT_PJT.bbs.dto.PostResponseDto`)
  - `postSn`: `Long` - 게시물 PK
  - `postTtl`: `String` - 제목
  - `postCn`: `String` - 내용
  - `postWrtrSn`: `Long` - 작성자 SN
  - `postWriterName`: `String` - 작성자 이름
  - `postFrstWrtDt`: `LocalDateTime` - 최초 작성일시
  - `postLastMdfcnDt`: `LocalDateTime` - 최종 수정일시
  - `delYn`: `Boolean` - 삭제 여부
  - `coSn`: `Long` - 회사 SN
  - `cohortSn`: `Long` - 코호트 SN
  - `formUuid`: `String` - 첨부/폼 UUID
  - `bbsType`: `BbsType` - 게시판 유형 (NOTICE, SURVEY 등)
  - `bbsScope`: `BbsScope` - 공개 범위
  - `viewCnt`: `Integer` - 조회수

- **CommentDto** (`com.kdt.KDT_PJT.comment.dto.CommentDto`)
  - `cmntSn`: `Long` - 댓글 PK
  - `postSn`: `Long` - 게시글 SN
  - `cmntCn`: `String` - 댓글 내용 (`text` JSON 키와 alias)
  - `cmntWrtrSn`: `Long` - 작성자 SN
  - `cmntWrtrNm`: `String` - 작성자 이름
  - `cmntFrstWrtDt`: `LocalDateTime` - 최초 작성일
  - `cmntLastMdfcnDt`: `LocalDateTime` - 최종 수정일
  - `delYn`: `Boolean` - 삭제 여부
  - `parentCmntSn`: `Long` - 부모 댓글 SN (null이면 원댓글)
  - `children`: `List<CommentDto>` - 대댓글 리스트

---

### 설문 / 설문 응답

- **ResponseSurveyDto** (`com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto`)
  - `srvySn`: `Long` - 설문 SN
  - `srvyTtl`: `String` - 설문 제목
  - `srvyQitem`: `Object` - 설문 문항 (JSON 형태)
  - `srvyBgngDt`: `LocalDate` - 설문 시작일
  - `srvyEndDt`: `LocalDate` - 설문 종료일
  - `srvyScope`: `SurveyScope` - 설문 범위 (예: COHORT/INTERNAL)
  - `bbsType`: `BbsType` - 게시판 유형 (보통 SURVEY)
  - `coSn`: `Long` - 회사 SN
  - `cohortSn`: `Long` - 코호트 SN
  - `userSn`: `Long` - 작성자 SN
  - `userNm`: `String` - 작성자 이름
  - `formUuid`: `String` - 설문 폼 UUID
  - `viewCnt`: `int` - 조회수
  - `srvyFrstWrtDt`: `LocalDateTime` - 최초 작성일
  - `srvyLastMdfcnDt`: `LocalDateTime` - 마지막 수정일
  - `delYn`: `boolean` - 삭제 여부

- **SrvyResponseResponseDto** (`com.kdt.KDT_PJT.response.dto.SrvyResponseResponseDto`)
  - `rspnsSn`: `Long` - 응답 SN
  - `responseUuid`: `String` - 응답 UUID
  - `parentType`: `String` - 부모 유형 (예: "SURVEY")
  - `parentSn`: `Long` - 부모 SN (설문 SN 등)
  - `userSn`: `Long` - 응답자 SN
  - `rspnsDt`: `LocalDateTime` - 응답 일시
  - `rspnsCn`: `String` - 응답 내용 (JSON 문자열)
  - `viewCnt`: `Integer` - 조회수
  - `delYn`: `Boolean` - 삭제 여부

---

### 출결

- **AttendTodayResponse** (`com.kdt.KDT_PJT.attend.dto.AttendTodayResponse`)
  - `ok`: `boolean`
  - `checkinTime`: `String` - 입실 시각 (없으면 null, 예: `"09:00"`)
  - `checkoutTime`: `String` - 퇴실 시각 (없으면 null)

- **AttendSummaryDto** (`com.kdt.KDT_PJT.attend.dto.AttendSummaryDto`)
  - `period`: `String` - 조회 기간 (예: `"2025-09-01 ~ 2025-09-30"`)
  - `present`: `Long` - 출석 일수
  - `lateEarlyOut`: `Long` - 지각/조퇴 일수
  - `absent`: `Long` - 결석(휴가/병가/공가 포함) 일수
  - `requiredDays`: `Long` - 요구 출석 일수

- **CheckinResponse** (`com.kdt.KDT_PJT.attend.dto.CheckinResponse`)
  - `ok`: `boolean`
  - `message`: `String`
  - `checkinTime`: `LocalDateTime`

- **CheckoutResponse** (`com.kdt.KDT_PJT.attend.dto.CheckoutResponse`)
  - `ok`: `boolean`
  - `message`: `String`
  - `checkoutTime`: `LocalDateTime`

- **StudentAttendanceDto** (`com.kdt.KDT_PJT.attend.dto.StudentAttendanceDto`)
  - `userSn`: `Long`
  - `username`: `String`
  - `checkInTime`: `String` - `"HH:mm"`
  - `checkOutTime`: `String` - `"HH:mm"`
  - `status`: `String` - `"ABSENT" | "PRESENT" | "LATE" | "EARLY_LEAVE"`

- **AttendDocumentResponse** (`com.kdt.KDT_PJT.attend.dto.AttendDocumentResponse`)
  - `attendDtlTypeNm`: `AttendDtlTypeNm` - 상세 유형
  - `rmrkCn`: `String` - 사유
  - `bgngDt`: `LocalDate` - 시작일
  - `endDt`: `LocalDate` - 종료일
  - `aprvSttsNm`: `AprvSttsNm` - 승인 상태
  - `createdAt`: `LocalDateTime` - 생성(신청) 일시
  - `hasFile`: `boolean` - 첨부파일 존재 여부
  - `fileSn`: `Long` - 첨부파일 SN

- **AttendDocumentAdminResponse** (`com.kdt.KDT_PJT.attend.dto.AttendDocumentAdminResponse`)
  - `attendDcmntSn`: `Long` - 문서 SN
  - `attendDtlTypeNm`: `AttendDtlTypeNm`
  - `cohortName`: `String`
  - `userName`: `String`
  - `rmrkCn`: `String`
  - `bgngDt`: `LocalDate`
  - `endDt`: `LocalDate`
  - `hasFile`: `boolean`
  - `aprvSttsNm`: `AprvSttsNm`
  - `createdAt`: `LocalDateTime`
  - `fileSn`: `Long`

- **AbsenceCountsRes** (`com.kdt.KDT_PJT.attend.dto.AbsenceCountsRes`)
  - `pendingCount`: `long` - 대기중인 출석인정 요청 수

---

### 파일

- **UploadResultDTO** (`com.kdt.KDT_PJT.file.dto.UploadResultDTO`)
  - `fileSn`: `Integer` - 파일 PK
  - `originalFileName`: `String` - 원본 파일명
  - `storedFileName`: `String` - 저장 파일명(UUID 등)
  - `size`: `long` - 바이트 단위 파일 크기
  - `formUuid`: `String` - 연관 폼 UUID

