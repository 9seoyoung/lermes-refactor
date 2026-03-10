package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.dto.mypage.UserDetailRequest;
import com.kdt.KDT_PJT.auth.entity.UserDetail;
import com.kdt.KDT_PJT.auth.repository.UserDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailService {

    private final UserDetailRepository repository;

    /** 상세정보 등록 및 수정 */
    @Transactional
    public UserDetail upsert(Long userSn, UserDetailRequest req) {
        UserDetail detail = repository.findByUserSn(userSn).orElse(null);

        if (detail == null) {
            // 등록
            detail = UserDetail.builder()
                    .userSn(userSn)
                    .address(req.getAddress())
                    .addressDetail(req.getAddressDetail())
                    .major(req.getMajor())
                    .cert(req.getCert())
                    .skills(req.getSkills())
                    .birth(req.getBirth())
                    .build();
        } else {
            // 수정 (도메인 메서드 사용)
            detail.update(
                    req.getAddress(),
                    req.getAddressDetail(),
                    req.getMajor(),
                    req.getCert(),
                    req.getSkills(),
                    req.getBirth()
            );
        }

        return repository.save(detail);
    }

    /**
     * 특정 유저 상세 정보 조회
     */
    @Transactional(readOnly = true)
    public UserDetail getByUserSn(Long userSn) {
        return repository.findByUserSn(userSn).orElse(null);
    }
}
