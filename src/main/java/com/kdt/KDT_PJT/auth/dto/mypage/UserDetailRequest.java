package com.kdt.KDT_PJT.auth.dto.mypage;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UserDetailRequest {

    @Size(max = 255)
    private String address;

    @Size(max = 255)
    private String addressDetail;

    @Size(max = 100)
    private String major;

    @Size(max = 255)
    private String cert;

    @Size(max = 255)
    private String skills;

    @Past(message = "생년월일은 과거 날짜여야 합니다.")
    private LocalDate birth;
}
