package com.kdt.KDT_PJT.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "TB_USER_DETAIL")
public class UserDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DETAIL_SN")
    private Long id;

    // FK: TB_USER.USER_SN (단방향이라 숫자로만 저장)
    @Column(name = "USER_SN", nullable = false)
    private Long userSn;

    @Column(name = "ADDRESS", length = 255)
    private String address;

    @Column(name = "ADDRESS_DETAIL", length = 100)
    private String addressDetail;

    @Column(name = "MAJOR", length = 100)
    private String major;

    @Column(name = "CERT", length = 255)
    private String cert;

    @Column(name = "SKILLS", length = 255)
    private String skills;

    @Column(name = "BIRTH")
    private LocalDate birth;

    @Column(name = "MEMO")
    private String memo;

    public void update(String address,String addressDetail , String major, String cert, String skills, LocalDate birth) {
        this.address = address;
        this.addressDetail = addressDetail;
        this.major = major;
        this.cert = cert;
        this.skills = skills;
        this.birth = birth;
    }
}
