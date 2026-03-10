package com.kdt.KDT_PJT.user.service;

import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import com.kdt.KDT_PJT.cohortmem.repository.CohortMemberRepository;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohortmem.entity.CohortMember;
import com.kdt.KDT_PJT.user.Dto.UserDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("userUserService")
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CohortRepository cohortRepository;

    @Autowired
    private CohortMemberRepository cohortMemberRepository;


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setPassword(updatedUser.getPassword());
            user.setEmail(updatedUser.getEmail());
            user.setEnabled(updatedUser.isEnabled());
            user.setRoleType(updatedUser.getRoleType());
            user.setUserTelno(updatedUser.getUserTelno());
            user.setCompanySn(updatedUser.getCompanySn());
            user.setCohortSn(updatedUser.getCohortSn());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void nullifyCompanyAndCohortSnByUserSn(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setCompanySn(null);   // 회사 null
        user.setCohortSn(null);    // 코호트 null
        // save() 호출 안 해도 트랜잭션 끝날 때 자동 업데이트 됨 (Dirty Checking)
    }

    // 회사 + 권한 + 코호트SN
    public List<UserDto> findUsersByCompanyCohortAndRole(Long ogdpCoSn, Long ogdpCohortSn, Long userAuthrtSn) {
        List<User> users = userRepository.findUsersByCompanyAndCohortAndRole(
                ogdpCohortSn, ogdpCoSn, userAuthrtSn
        );

        return users.stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }


    // 회사 + 권한
    public List<UserDto> findUsersByCompanyAndRole(Long ogdpCoSn, Long userAuthrtSn) {
        List<User> users = userRepository.findByCompanySnAndRoleType(ogdpCoSn, userAuthrtSn);
        return users.stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    }


