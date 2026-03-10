package com.kdt.KDT_PJT.cohortresponse.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohort.dto.CohortDto;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import com.kdt.KDT_PJT.cohortresponse.dto.CohortResponseDetailDto;
import com.kdt.KDT_PJT.cohortresponse.dto.CohortResponseDto;
import com.kdt.KDT_PJT.cohortresponse.entity.CohortResponse;
import com.kdt.KDT_PJT.cohortresponse.repository.CohortResponseRepository;
import com.kdt.KDT_PJT.user.Dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CohortResponseService {

    private final CohortResponseRepository repository;
    private final CohortRepository cohortRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public Long save(CohortResponseDto dto) {
        CohortResponse entity = CohortResponse.builder()
                .parentType(dto.getParentType())
                .parentSn(dto.getParentSn())
                .userSn(dto.getUserSn())
                .rspnsDt(dto.getRspnsDt() != null ? dto.getRspnsDt() : LocalDateTime.now())
                .rspnsCn(dto.getRspnsCn())
                .viewCnt(dto.getViewCnt())
                .delYn(dto.getDelYn() != null ? dto.getDelYn() : Boolean.FALSE)
                .formUuid(dto.getFormUuid())
                .build();
        return repository.save(entity).getRspnsSn();
    }


//    @Transactional(readOnly = true)
//    public CohortResponseDetailDto get(Long responseId) throws JsonProcessingException {
//        // 1. 응답 조회
//        CohortResponse response = repository.findById(responseId)
//                .orElseThrow(() -> new IllegalArgumentException("응답이 존재하지 않습니다. ID = " + responseId));
//
//        // 2. 응답 DTO 매핑 (rspnsCn은 String 타입이라고 가정)
//        CohortResponseDto responseDto = CohortResponseDto.builder()
//                .rspnsSn(response.getRspnsSn())
//                .parentType(response.getParentType())
//                .parentSn(response.getParentSn())
//                .userSn(response.getUserSn())
//                .rspnsDt(response.getRspnsDt())
//                .rspnsCn(response.getRspnsCn())  // JSON 문자열 그대로 전달
//                .viewCnt(response.getViewCnt())
//                .delYn(response.getDelYn())
//                .formUuid(response.getFormUuid())
//                .build();
//
//        // 3. 모집 설문 정보 (CohortDto)
//        CohortDto cohortDto = null;
//        if ("COHORT".equals(response.getParentType())) {
//            Cohort cohort = cohortRepository.findById(response.getParentSn().longValue())
//                    .orElseThrow(() -> new IllegalArgumentException("모집이 존재하지 않습니다. ID = " + response.getParentSn()));
//
//            JsonNode surveyJson = objectMapper.readTree(cohort.getCrclmCn());
//
//            cohortDto = CohortDto.builder()
//                    .coSn(cohort.getCoSn())            // cohort.getCoSn() 사용 (중복 제거)
//                    .title(cohort.getCohortNm())       // 모집명
//                    .content(cohort.getCrclmNm())      // 커리큘럼명
//                    .surveyForm(surveyJson)   // JSON 문자열 그대로 전달
//                    .surveyStart(cohort.getRecruitBgngDt())
//                    .surveyEnd(cohort.getRecruitEndDt())
//                    .startDate(cohort.getCrclmBgngYmd())
//                    .endDate(cohort.getCrclmEndYmd())
//                    .stts(cohort.getCohortSttsNm().name())
//                    .type(cohort.getCohortCate().name())
//                    .classStart(cohort.getAttendStartTm())
//                    .classEnd(cohort.getAttendEndTm())
//                    .place(cohort.getCohortPl())
//                    .build();
//        }
//
//        // 4. 사용자 정보
//        User user = userRepository.findById(response.getUserSn().longValue())
//                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. ID = " + response.getUserSn()));
//
//        UserDto userDto = UserDto.fromEntity(user);
//
//        // 5. 최종 DTO 조립 및 반환
//        return CohortResponseDetailDto.builder()
//                .responseJson(responseDto)
//                .surveyForm(cohortDto)
//                .userInfo(userDto)
//                .build();
//    }


    @Transactional(readOnly = true)
    public CohortResponseDetailDto get(Long responseId) throws JsonProcessingException {
        CohortResponse response = repository.findById(responseId)
                .orElseThrow(() -> new IllegalArgumentException("응답이 존재하지 않습니다. ID = " + responseId));

        CohortResponseDto responseDto = CohortResponseDto.builder()
                .rspnsSn(response.getRspnsSn())
                .parentType(response.getParentType())
                .parentSn(response.getParentSn())
                .userSn(response.getUserSn())
                .rspnsDt(response.getRspnsDt())
                .rspnsCn(response.getRspnsCn())
                .viewCnt(response.getViewCnt())
                .delYn(response.getDelYn())
                .formUuid(response.getFormUuid())
                .build();

        CohortDto cohortDto = null;
        if ("COHORT".equals(response.getParentType())) {
            Cohort cohort = cohortRepository.findById(response.getParentSn().longValue())
                    .orElseThrow(() -> new IllegalArgumentException("모집이 존재하지 않습니다. ID = " + response.getParentSn()));

            JsonNode surveyJson = null;
            String crclmCn = cohort.getCrclmCn();
            if (crclmCn != null && !crclmCn.isBlank()) {
                surveyJson = objectMapper.readTree(crclmCn);
            }
            cohortDto = CohortDto.builder()
                    .coSn(cohort.getCoSn())
                    .title(cohort.getCohortNm())
                    .content(cohort.getCrclmNm())
                    .surveyForm(surveyJson)
                    .surveyStart(cohort.getRecruitBgngDt())
                    .surveyEnd(cohort.getRecruitEndDt())
                    .startDate(cohort.getCrclmBgngYmd())
                    .endDate(cohort.getCrclmEndYmd())
                    .stts(cohort.getCohortSttsNm() != null ? cohort.getCohortSttsNm().name() : null)
                    .type(cohort.getCohortCate() != null ? cohort.getCohortCate().name() : null)
                    .classStart(cohort.getAttendStartTm())
                    .classEnd(cohort.getAttendEndTm())
                    .place(cohort.getCohortPl())
                    .build();
        }

        User user = userRepository.findById(response.getUserSn().longValue())
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. ID = " + response.getUserSn()));

        UserDto userDto = UserDto.fromEntity(user);

        return CohortResponseDetailDto.builder()
                .responseJson(responseDto)
                .surveyForm(cohortDto)
                .userInfo(userDto)
                .build();
    }




    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CohortResponseDto> findByParentSn(Integer parentSn) {
        return repository.findByParentSn(parentSn).stream()
                .map(this::toDto)
                .toList();
    }

    private CohortResponseDto toDto(CohortResponse entity) {
        return CohortResponseDto.builder()
                .rspnsSn(entity.getRspnsSn())
                .parentType(entity.getParentType())
                .parentSn(entity.getParentSn())
                .userSn(entity.getUserSn())
                .rspnsDt(entity.getRspnsDt())
                .rspnsCn(entity.getRspnsCn())
                .viewCnt(entity.getViewCnt())
                .delYn(entity.getDelYn())
                .formUuid(entity.getFormUuid())
                .build();
    }

}
