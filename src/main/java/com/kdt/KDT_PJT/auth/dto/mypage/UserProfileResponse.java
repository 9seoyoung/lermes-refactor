package com.kdt.KDT_PJT.auth.dto.mypage;

import lombok.*;


@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class UserProfileResponse {
    private String name;        // 회원명
    private String status;      // 수강 상태 (enabled 여부)
    private String phoneNumber; // 휴대폰 번호
    private String email;       // 이메일

    private String courseName;  // 과정명 (Cohort에서 가져옴)
    private String cohortName;  // 소속 그룹 (예: 10기)

    private String companyName;  // 회사명 (모두)
    private String brNo;        // 사업자번호 (모두)

    private Long userProfileImage; // 유저 프로필 사진
}