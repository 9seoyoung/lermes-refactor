package com.kdt.KDT_PJT.bbs.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.bbs.dto.PostRequestDto;
import com.kdt.KDT_PJT.bbs.dto.PostResponseDto;
import com.kdt.KDT_PJT.bbs.enums.BbsScope;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.bbs.enums.BbsRole;
import com.kdt.KDT_PJT.bbs.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;

    // 게시글 등록
    public PostResponseDto createPost(PostRequestDto requestDto, AuthCustomUserDetails auth) {
        BbsRole role = resolveRole(auth);
        BbsType type = requestDto.getBbsType();

        if (!role.canCreate(type)) {
            throw new AccessDeniedException("작성 권한 없음");
        }

        // 작성일자
        LocalDateTime now = LocalDateTime.now();
        requestDto.setPostFrstWrtDt(now);
        requestDto.setPostLastMdfcnDt(now);

        String uuid = UUID.randomUUID().toString();
        postMapper.insertPost(requestDto, uuid);
        return postMapper.findById(requestDto.getPostSn());
    }

    // 🔹 공통 권한 체크 로직 (분리 전 로직 유지)
    private boolean canAccessPost(
            PostResponseDto post,
            AuthCustomUserDetails auth,
            Long filterCohortSn,
            String filterBbsType
    ) {
        BbsRole role = resolveRole(auth);
        BbsType type = post.getBbsType();
        BbsScope scope = post.getBbsScope();

        // 1) bbsType 필터 (문자열로 온 경우 무시대소문자)
        if (filterBbsType != null) {
            try {
                BbsType filterType = BbsType.valueOf(filterBbsType.toUpperCase());
                if (!type.equals(filterType)) return false;
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("게시판 유형 없음: " + filterBbsType);
            }
        }

        // 2) PUBLIC 우선 처리 (공지/FAQ 완전 공개)
        if (scope == BbsScope.PUBLIC) {
            if (type == BbsType.NOTICE || type == BbsType.FAQ) {
                return true;
            }
            // 그 외 PUBLIC 타입은 로그인만 필요
            return auth != null && auth.isEnabled();
        }

        // 3) PUBLIC이 아니면 로그인 필수
        if (auth == null || !auth.isEnabled()) return false;

        // 4) Role 권한 체크 (PUBLIC 우선 처리 이후에 위치해야 함)
        if (!role.canRead(type)) return false;

        // 5) QNA 예외 (요구사항 유지)
        if (type == BbsType.QNA) {

            // 🔹 관리자급은 전체 열람 가능
            if (role == BbsRole.SUPER_ADMIN || role == BbsRole.TENANT || role == BbsRole.EMPLOYEE) {
                return true;
            }

            // 🔹 강사 / 학생: 같은 회사 + 같은 코호트일 때만 접근 가능 (그룹공개 Q&A)
            if (role == BbsRole.INSTRUCTOR || role == BbsRole.STUDENT) {
                return Objects.equals(post.getCoSn(), auth.getCompanySn())
                        && Objects.equals(post.getCohortSn(), auth.getCohortSn());
            }

            // 🔹 일반 사용자(GENERAL): 본인 글만 접근 가능
            if (role == BbsRole.GENERAL) {
                return Objects.equals(post.getPostWrtrSn(), auth.getId());
            }

            // 🔹 비회원(VISITOR): 접근 불가
            if (role == BbsRole.VISITOR) {
                return false;
            }
        }

        log.info("check role={}, scope={}, type={}, post.coSn={}, auth.coSn={}, post.cohortSn={}, auth.cohortSn={}, filterCohortSn={}",
                role, scope, type, post.getCoSn(), auth.getCompanySn(), post.getCohortSn(), auth.getCohortSn(), filterCohortSn);

        // 6) 나머지 Scope
        return switch (scope) {
            case PRIVATE -> Objects.equals(post.getPostWrtrSn(), auth.getId());

            case COMPANY -> Objects.equals(post.getCoSn(), auth.getCompanySn());

            case COHORT -> {
                if (role == BbsRole.SUPER_ADMIN || role == BbsRole.TENANT || role == BbsRole.EMPLOYEE) {
                    // 회사 일치 + (필터 없음 OR 글의 코호트가 null OR 글 코호트==필터)
                    yield Objects.equals(post.getCoSn(), auth.getCompanySn())
                            && (
                            filterCohortSn == null
                                    || post.getCohortSn() == null
                                    || Objects.equals(post.getCohortSn(), filterCohortSn)
                    );
                } else if (role == BbsRole.INSTRUCTOR || role == BbsRole.STUDENT) {
                    // 같은 회사 + 자신의 코호트와 동일할 때만
                    yield Objects.equals(post.getCoSn(), auth.getCompanySn())
                            && Objects.equals(post.getCohortSn(), auth.getCohortSn());
                } else yield false;
            }

            default -> false;
        };
    }

    // 단건 조회 전용 권한 체크 메서드 (신규 추가)
    private boolean canAccessPostForSingle(PostResponseDto post, AuthCustomUserDetails auth) {
        return canAccessPost(post, auth, auth.getCohortSn(), post.getBbsType().name());
    }

    // 리스트 조회 전용 권한 체크 메서드 (신규 추가)
    private boolean canAccessPostForList(PostResponseDto post,
                                         AuthCustomUserDetails auth,
                                         Long filterCohortSn,
                                         String filterBbsType) {
        return canAccessPost(post, auth, filterCohortSn, filterBbsType);
    }

    // 수정/삭제 권한 체크
    private boolean canModifyPost(PostResponseDto post, AuthCustomUserDetails auth) {
        BbsRole role = resolveRole(auth);

        if (role == BbsRole.SUPER_ADMIN || role == BbsRole.TENANT) {
            return true;
        }
        return  Objects.equals(post.getPostWrtrSn(), auth.getId());
    }

    // 게시글 목록 조회
    public List<PostResponseDto> getPosts(AuthCustomUserDetails auth,
                                          Long filterCohortSn,
                                          String filterBbsType,
                                          Long requestCoSn) {

        BbsRole role = resolveRole(auth);
        Long companySn = null; // 최종 조회용 coSn

        // 1. SUPER_ADMIN → 프론트에서 전달된 회사 번호 그대로 사용
        if (role == BbsRole.SUPER_ADMIN) {
            companySn = requestCoSn;
        }

        // 2. TENANT_ADMIN / EMPLOYEE / INSTRUCTOR / STUDENT → 자기 회사만 허용
        else if (role == BbsRole.TENANT || role == BbsRole.EMPLOYEE
                || role == BbsRole.INSTRUCTOR || role == BbsRole.STUDENT) {
            Long myCompanySn = auth.getCompanySn();
            if (requestCoSn != null && !Objects.equals(myCompanySn, requestCoSn)) {
                throw new AccessDeniedException("다른 회사 게시판 접근 불가: 요청 coSn=" + requestCoSn);
            }
            companySn = myCompanySn;
        }

        // 3. GENERAL / VISITOR → 프론트에서 넘어온 회사번호 사용 (공개글만 허용)
        else if (role == BbsRole.GENERAL || role == BbsRole.VISITOR) {
            if (requestCoSn == null) {
                throw new AccessDeniedException("회사 번호(coSn)가 필요합니다.");
            }
            companySn = requestCoSn;
        }

        // Mapper 호출
        List<PostResponseDto> posts =
                postMapper.findByFilters(companySn, filterCohortSn, filterBbsType);

        // PUBLIC 범위 필터링 (GENERAL, VISITOR)
        if (role == BbsRole.GENERAL || role == BbsRole.VISITOR) {
            posts = posts.stream()
                    .filter(post -> post.getBbsScope() == BbsScope.PUBLIC)
                    .toList();
        } else {
            posts = posts.stream()
                    .filter(post -> canAccessPostForList(post, auth, filterCohortSn, filterBbsType))
                    .toList();
        }

        return posts;
    }

    // 게시글 단건 조회
    @Transactional
    public PostResponseDto getPost(Long postSn, AuthCustomUserDetails auth) {
        // 1. 조회수 먼저 증가
        postMapper.increaseViewCnt(postSn);

        // 2. 글 상세 가져오기
        PostResponseDto post = postMapper.findById(postSn);

        if (post == null) {
            throw new NoSuchElementException("게시글 없음: postSn=" + postSn);
        }

        // 3. 권한 체크
        if(auth != null){
            if (!canAccessPostForSingle(post, auth)) {
                throw new AccessDeniedException("조회 권한 없음");
            }
        }

        // 4. 최신 조회수 포함된 데이터 리턴
        return post;
    }
    // 게시글 수정
    public PostResponseDto updatePost(PostRequestDto requestDto, AuthCustomUserDetails auth) {
        PostResponseDto existing = postMapper.findById(requestDto.getPostSn());

        if (!canModifyPost(existing, auth)) {
            throw new AccessDeniedException("수정 권한 없음");
        }

        requestDto.setPostLastMdfcnDt(LocalDateTime.now());
        postMapper.updatePost(requestDto);
        return postMapper.findById(requestDto.getPostSn());
    }

    // 게시글 삭제 (Soft Delete)
    public void deletePost(Long postSn, AuthCustomUserDetails auth) {
        PostResponseDto existing = postMapper.findById(postSn);

        if (!canModifyPost(existing, auth)) {
            throw new AccessDeniedException("삭제 권한 없음");
        }

        postMapper.softDelete(postSn);
    }

    private BbsRole resolveRole(AuthCustomUserDetails auth) {
        if (auth == null || !auth.isEnabled()) {
            return BbsRole.VISITOR;
        }
        BbsRole role = BbsRole.fromCode(auth.getRoleType());
        log.info("Resolved Role: {}, from roleType={}", role, auth.getRoleType());
        return role;
    }
}
