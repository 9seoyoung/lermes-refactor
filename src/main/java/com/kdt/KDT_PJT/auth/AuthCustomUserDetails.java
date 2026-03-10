package com.kdt.KDT_PJT.auth;

import com.kdt.KDT_PJT.auth.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * User 엔티티 → Spring Security UserDetails + OAuth2User 어댑터
 */
public class AuthCustomUserDetails implements UserDetails, OAuth2User {

    private final Long id;
    private final String name;       //  이름
    private final String email;      //  이메일 (username)
    private final String password;   //  비밀번호
    private final String authority;  // ROLE_ 접두사 포함 권한
    private final boolean enabled;   //  활성여부
    private final Long roleType;     //  권한(숫자)
    private final String userTelno;  //  전화번호
    private final Long companySn;    //  회사 FK
    private final Long cohortSn;     //  기수 FK
    private final Long userProfileImage; //

    public AuthCustomUserDetails(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.authority = "ROLE_" + mapRoleIdToName(user.getRoleType());
        this.enabled = user.isEnabled();
        this.roleType = user.getRoleType();
        this.userTelno = user.getUserTelno();
        this.companySn = user.getCompanySn();
        this.cohortSn = user.getCohortSn();
        this.userProfileImage = user.getUserProfileImage();
    }

    private String mapRoleIdToName(Long roleId) {
        return switch (roleId.intValue()) {
            case 1 -> "SUPER_ADMIN";
            case 2 -> "TENANT_ADMIN";
            case 3 -> "EMPLOYEE";
            case 4 -> "INSTRUCTOR";
            case 5 -> "STUDENT";
            case 6 -> "GENERAL";
            default -> throw new IllegalArgumentException("Unknown roleId: " + roleId);
        };
    }

    // ===== 추가 정보 getter =====
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Long getRoleType() { return roleType; }
    public String getUserTelno() { return userTelno; }
    public Long getCompanySn() { return companySn; }
    public Long getCohortSn() { return cohortSn; }
    public Long getUserProfileImage() { return userProfileImage; }

    // ===== UserDetails 구현 =====
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.authority));
    }

    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return email; } // username = email

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return enabled; }

    // ===== OAuth2User 구현 =====
    @Override
    public Map<String, Object> getAttributes() {
        // 필요한 최소 속성만 반환 (email, name)
        return Map.of(
                "email", this.email,
                "name", this.name
        );
    }
}
