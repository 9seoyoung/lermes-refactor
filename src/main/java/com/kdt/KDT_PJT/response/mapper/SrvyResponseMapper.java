package com.kdt.KDT_PJT.response.mapper;

import com.kdt.KDT_PJT.response.dto.SrvyRequestResponseDto;
import com.kdt.KDT_PJT.response.dto.SrvyResponseResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SrvyResponseMapper {

    // 응답 등록
    void insertResponse(@Param("dto") SrvyRequestResponseDto dto);

    // 응답 수정
    void updateResponse(@Param("dto") SrvyRequestResponseDto dto);

    // 응답 단건 조회 (유저 + 설문 기준)
    SrvyResponseResponseDto findByParentAndUser(@Param("parentSn") Long parentSn,
                                                @Param("userSn") Long userSn);

    // 본인 응답만 조회 (일반 유저용)
    List<SrvyResponseResponseDto> findByParentAndUserList(@Param("parentSn") Long parentSn,
                                                          @Param("userSn") Long userSn);

    // 응답 단건 조회 (PK 기준)
    SrvyResponseResponseDto findById(@Param("rspnsSn") Long rspnsSn);

    // 관리자·강사용 전체 응답 조회 (유저명 포함)
    List<SrvyResponseResponseDto> findAllByParentWithUserName(@Param("parentSn") Long parentSn);

    // 슈퍼관리자 전용: coSn / cohortSn 필터 지원
    List<SrvyResponseResponseDto> findAllByParentWithFilter(@Param("parentSn") Long parentSn,
                                                            @Param("coSn") Long coSn,
                                                            @Param("cohortSn") Long cohortSn);
    //응답개수 확인용
    int countResponsesByParent(@Param("srvySn") Long srvySn,
                               @Param("bbsType") String bbsType);
    // Soft Delete
    void softDelete(@Param("rspnsSn") Long rspnsSn,
                    @Param("userSn") Long userSn);
}
