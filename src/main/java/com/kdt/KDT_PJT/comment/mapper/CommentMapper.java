package com.kdt.KDT_PJT.comment.mapper;

import com.kdt.KDT_PJT.comment.dto.CommentDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {


    void insertComment(CommentDto dto);

    List<CommentDto> findCommentsByPost(Long postSn);

    CommentDto findCommentById(Long cmntSn);

    void updateComment(CommentDto dto);

    void softDeleteComment(Long cmntSn, Long userSn); // userSn은 Audit용 필요시 추가 가능

    List<CommentDto> findRepliesByParent(Long parentCmntSn);
}
