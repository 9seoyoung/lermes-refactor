package com.kdt.KDT_PJT.cohort.service;

import com.kdt.KDT_PJT.cohort.dto.CohortDto;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.entity.cohortSttsNm;
import com.kdt.KDT_PJT.cohort.mapper.CohortConverter;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CohortService {

    private final CohortRepository cohortRepository;

    public CohortService(CohortRepository cohortRepository) {
        this.cohortRepository = cohortRepository;
    }

    public List<Cohort> findAll() {
        return cohortRepository.findAll();
    }

    public Optional<Cohort> findById(Long id) {
        return cohortRepository.findById(id);
    }

    public List<Cohort> findByCoSn(Long coSn) {
        return cohortRepository.findByCoSn(coSn);
    }

    // 저장할 때 상태를 날짜 기준으로 계산해서 세팅
    public Cohort save(Cohort cohort) {
        setStatusByDate(cohort);
        return cohortRepository.save(cohort);
    }

    public void deleteById(Long id) {
        cohortRepository.deleteById(id);
    }

    // DTO로부터 Entity 생성 후 상태 세팅 및 저장
    public void createCohort(CohortDto dto) {
        Cohort entity = CohortConverter.toEntity(dto);
        setStatusByDate(entity);
        cohortRepository.save(entity);
    }

    public CohortDto getCohortDto(Long cohortSn) {
        Cohort entity = cohortRepository.findById(cohortSn).orElse(null);
        return CohortConverter.toDto(entity);
    }

    public List<String> getAllCohortTitles() {
        return cohortRepository.findAllCohortTitles();
    }

    // 모든 코호트 상태를 한번에 업데이트하는 메서드
    public void updateCohortStatuses() {
        List<Cohort> cohorts = cohortRepository.findAll();
        for (Cohort cohort : cohorts) {
            setStatusByDate(cohort);
            cohortRepository.save(cohort);
        }
    }

    // 날짜 기준 상태 계산 메서드
    private void setStatusByDate(Cohort cohort) {
        LocalDate now = LocalDate.now();
        LocalDate Mojistart = cohort.getRecruitBgngDt();
        LocalDate Mojiend = cohort.getRecruitEndDt();
        LocalDate start = cohort.getCrclmBgngYmd();
        LocalDate end = cohort.getCrclmEndYmd();


        if (Mojistart == null || Mojiend == null) {
            throw new IllegalArgumentException("코호트의 시작일 또는 종료일이 없습니다.");
        }

        if (start == null || end == null) {
            throw new IllegalArgumentException("시작일 또는 종료일이 없습니다.");
        }

        if (!now.isBefore(Mojistart) && !now.isAfter(Mojiend)) {
            cohort.setCohortSttsNm(cohortSttsNm.RECRUITING);
        } else if (!now.isBefore(start) && !now.isAfter(end)) {
            cohort.setCohortSttsNm(cohortSttsNm.ONGOING);
        } else if (now.isAfter(end)) {
            cohort.setCohortSttsNm(cohortSttsNm.COMPLETED);
        }
    }
}
