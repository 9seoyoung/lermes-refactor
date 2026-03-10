package com.kdt.KDT_PJT.bbs.mapper;

import com.kdt.KDT_PJT.bbs.dto.PostRequestDto;
import com.kdt.KDT_PJT.bbs.dto.PostResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface PostMapper {
    void insertPost(@Param("dto") PostRequestDto dto,
                    @Param("uuid") String uuid);
    PostResponseDto findById(Long postSn);
    List<PostResponseDto> findByFilters(@Param("coSn") Long coSn,
                                       @Param("cohortSn") Long cohortSn,
                                       @Param("bbsType") String bbsType);
    void updatePost(PostRequestDto dto);
    void softDelete(Long postSn);
    void increaseViewCnt(Long postSn);
}