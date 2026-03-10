package com.kdt.KDT_PJT.auth.dto.mypage;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserProfileRequest {
    private String userEmlAddr;
    private String userTelno;
    private Long userProfileImage;
}
