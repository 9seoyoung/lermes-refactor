package com.kdt.KDT_PJT.comment.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.comment.dto.CommentDto;
import com.kdt.KDT_PJT.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.xml.stream.events.Comment;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 등록 (원댓글 / 대댓글)
    @PostMapping("/{postSn}")
    public ResponseEntity<CommentDto> createComment(@PathVariable Long postSn,
                                                    @RequestBody CommentDto requestDto,
                                                    @AuthenticationPrincipal AuthCustomUserDetails auth) {
        requestDto.setPostSn((postSn));
        requestDto.setCmntWrtrSn(auth.getId());
        requestDto.setCmntFrstWrtDt(LocalDateTime.now());
        requestDto.setCmntSn(requestDto.getCmntSn());
        requestDto.setDelYn(false);

        CommentDto responseDto = commentService.createComment(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // ✅ 게시글 기준 댓글 전체 조회 (트리 구조 반환)
    @GetMapping("/{postSn}")
    public ResponseEntity<List<CommentDto>> getCommentsByPost(@PathVariable Long postSn,
                                                              @AuthenticationPrincipal AuthCustomUserDetails auth) {
        List<CommentDto> comments = commentService.getCommentsByPost(postSn); //(이제 트리 구조 반환)
        return ResponseEntity.ok(comments);
    }

    // ✅ 댓글 수정
    @PutMapping("/{cmntSn}")
    public ResponseEntity<CommentDto> updateComment(@PathVariable Long cmntSn,
                                                    @RequestBody CommentDto requestDto,
                                                    @AuthenticationPrincipal AuthCustomUserDetails auth) {

        requestDto.setCmntSn(cmntSn);
        requestDto.setCmntWrtrSn(auth.getId());
        requestDto.setCmntLastMdfcnDt(LocalDateTime.now());

        CommentDto responseDto = commentService.updateComment(requestDto, auth);
        return ResponseEntity.ok(responseDto);
    }

    // 댓글 삭제 (Soft Delete)
    @DeleteMapping("/{cmntSn}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long cmntSn,
                                              @AuthenticationPrincipal AuthCustomUserDetails auth) {
        commentService.deleteComment(cmntSn, auth);
        return ResponseEntity.noContent().build();

        // 204 No Content : 요청 성공했으나 반환할 데이터 없음 → 삭제 요청에 가장 적합한 상태코드
    }
}
