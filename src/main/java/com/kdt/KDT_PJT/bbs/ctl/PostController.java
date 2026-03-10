package com.kdt.KDT_PJT.bbs.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.bbs.dto.PostRequestDto;
import com.kdt.KDT_PJT.bbs.dto.PostResponseDto;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.bbs.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;


import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    // 게시글 등록
    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@RequestBody PostRequestDto requestDto,
                                                      @AuthenticationPrincipal AuthCustomUserDetails auth) {
        PostResponseDto responseDto = postService.createPost(requestDto, auth);
        return ResponseEntity.ok(responseDto);
    }

    // 게시글 단건 조회
    @GetMapping("/{postSn}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long postSn,
                                                   @AuthenticationPrincipal AuthCustomUserDetails auth) {
        PostResponseDto responseDto = postService.getPost(postSn, auth);
        return ResponseEntity.ok(responseDto);
    }

    // 게시글 목록 조회
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getPosts(
            @AuthenticationPrincipal AuthCustomUserDetails auth,
            @RequestParam (required = false) Long coSn,      //프론트 전달용
            @RequestParam(required = false) Long cohortSn,   // 기수 필터
            @RequestParam(required = false) String bbsType   // 게시판 유형 필터 (Enum 이름: NOTICE, SURVEY 등)
    ) {
        List<PostResponseDto> posts = postService.getPosts(auth, cohortSn, bbsType, coSn);
        return ResponseEntity.ok(posts);
    }

    // 게시글 수정
    @PutMapping("/{postSn}")
    public ResponseEntity<PostResponseDto> updatePost(@PathVariable Long postSn,
                                                      @RequestBody PostRequestDto requestDto,
                                                      @AuthenticationPrincipal AuthCustomUserDetails auth) {
        requestDto.setPostSn(postSn); // pathVariable → DTO 반영
        PostResponseDto responseDto = postService.updatePost(requestDto, auth);
        return ResponseEntity.ok(responseDto);
    }

    // 게시글 삭제 (Soft Delete)
    @DeleteMapping("/{postSn}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postSn,
                                           @AuthenticationPrincipal AuthCustomUserDetails auth) {
        postService.deletePost(postSn, auth);
        return ResponseEntity.noContent().build(); // HTTP 204
    }
}
