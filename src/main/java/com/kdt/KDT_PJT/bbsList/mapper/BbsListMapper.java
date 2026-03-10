package com.kdt.KDT_PJT.bbsList.mapper;

import com.kdt.KDT_PJT.bbsList.dto.BbsListResponseDto;
import com.kdt.KDT_PJT.survey.enums.SurveyScope;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface BbsListMapper {
    List<BbsListResponseDto> findBbsList(
            @Param("coSn") Long coSn,
            @Param("cohortSn") Long cohortSn,
            @Param("userSn") Long userSn,
            @Param("allowedScopes") List<SurveyScope> allowedScopes
    );
}
