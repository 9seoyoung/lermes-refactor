package com.kdt.KDT_PJT.auth.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Table(name = "TB_USER")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_sn")
    private Long id;

    // 이름
    @Column(name = "user_nm", nullable = false)
    private String name;

    // 이메일
    @Column(name = "user_eml_addr", nullable = false, unique = true)
    private String email;

    // PW
    @Column(name = "user_pswd", nullable = false)
    private String password;

    // 활성여부
    @Column(name = "user_actvtn_yn", nullable = false)
    private boolean enabled;

    // 사용자 권한
    @Column(name = "user_authrt_sn")
    private Long roleType;

    @Column(name = "user_telno")
    private String userTelno;

    // 회사 번호(FK) - nullable
    @Column(name = "OGDP_CO_SN")
    private Long companySn;

    // 기수 번호(FK) - nullable
    @Column(name = "OGDP_COHORT_SN")
    private Long cohortSn;

    // 사용자 이미지 파일 일련번호
    @Column(name = "USER_PROFILE_IMAGE")
    private Long userProfileImage;

}
