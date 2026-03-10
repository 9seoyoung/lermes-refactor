package com.kdt.KDT_PJT.auth.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_USER_AUTHRT")
public class UserAuthrt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_authrt_sn")
    private Long id;

    @Column(name = "user_authrt_nm")
    private String name;

}
