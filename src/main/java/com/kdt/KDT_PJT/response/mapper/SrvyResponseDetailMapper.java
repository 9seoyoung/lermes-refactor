package com.kdt.KDT_PJT.response.mapper;

import com.kdt.KDT_PJT.response.dto.SrvyResponseDetailDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SrvyResponseDetailMapper {

    // 단건 조회
    SrvyResponseDetailDto findSurveyDetailWithResponse(@Param("srvySn") Long srvySn,
                                                       @Param("userSn") Long userSn);
    //작성자일경우 전체 응답 조회
    List<SrvyResponseDetailDto> findAllResponsesBySurvey(@Param("srvySn") Long srvySn);
}
