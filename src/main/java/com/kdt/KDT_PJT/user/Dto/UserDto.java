
package com.kdt.KDT_PJT.user.Dto;


import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.cohortmem.entity.CohortMember;
import com.kdt.KDT_PJT.cohortmem.entity.CohortMemberStts;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long userSn;
    private String userNm;
    private String userPswd;
    private String userEmlAddr;
    private Boolean userActvtnYn;
    private Long userAuthrtSn;
    private String userTelno;
    private Long ogdpCoSn;
    private Long ogdpCohortSn;
    private CohortMemberStts cohortMemStts;

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setUserSn(user.getId());
        dto.setUserNm(user.getName());
        dto.setUserPswd(user.getPassword());
        dto.setUserEmlAddr(user.getEmail());
        dto.setUserActvtnYn(user.isEnabled());
        dto.setUserAuthrtSn(user.getRoleType());
        dto.setUserTelno(user.getUserTelno());
        dto.setOgdpCoSn(user.getCompanySn());
        dto.setOgdpCohortSn(user.getCohortSn());

        return dto;
    }
//
//    public User toEntity() {
//        return new User(userSn, userNm, userPswd,userEmlAddr,userActvtnYn, userAuthrtSn, userTelno, ogdpCoSn, ogdpCohortSn);
//    }
}