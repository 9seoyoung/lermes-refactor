package com.kdt.KDT_PJT.cohort.ctl;


// import com.kdt.KDT_PJT.cohort.dto.CohortListDto;
import com.kdt.KDT_PJT.auth.entity.Company;
import com.kdt.KDT_PJT.auth.repository.CompanyRepository;
import com.kdt.KDT_PJT.cohort.dto.CohortDto;
import com.kdt.KDT_PJT.cohort.dto.CohortRecruitDto;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.entity.cohortSttsNm;
import com.kdt.KDT_PJT.cohort.mapper.CohortConverter;
import com.kdt.KDT_PJT.cohort.service.CohortService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cohorts")
public class CohortController {

    private final CohortService cohortService;
    private final CompanyRepository companyRepository;

    public CohortController(CohortService cohortService, CompanyRepository companyRepository) {
        this.cohortService = cohortService;
        this.companyRepository = companyRepository;
    }

    // 전체 조회
    @GetMapping
    public List<Cohort> getAllCohorts() {
        return cohortService.findAll();
    }

    // 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<CohortRecruitDto> getCohortById(@PathVariable Long id) {
        return cohortService.findById(id).map(c -> {
            Long logoSn = companyRepository.findById(c.getCoSn())
                    .map(Company::getBigLogoFileSn)
                    .orElse(null);

            Long cohortImg = c.getCohortImg();

            CohortRecruitDto dto = new CohortRecruitDto(
                    c.getCohortSn(),
                    c.getCohortNm(),
                    c.getCrclmNm(),
                    c.getRecruitBgngDt(),
                    c.getRecruitEndDt(),
                    c.getCrclmBgngYmd(),
                    c.getCrclmEndYmd(),
                    c.getAttendStartTm(),
                    c.getAttendEndTm(),
                    c.getCohortPl(),
                    c.getCrclmCn(),
                    logoSn,
                    cohortImg
            );
            System.out.println("[DEBUG] cohortSn=" + c.getCohortSn() +
                    " / cohortImg=" + c.getCohortImg() +
                    " / logoSn=" + logoSn);


            return ResponseEntity.ok(dto);
        }).orElse(ResponseEntity.notFound().build());
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<Cohort> getCohortById(@PathVariable Long id) {
//        return cohortService.findById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }

    //회사 조회
    @GetMapping("/company/{coSn}")
    public ResponseEntity<Map<String, Object>> getCohortsByCompanyId(@PathVariable Long coSn) {
        List<Cohort> cohorts = cohortService.findByCoSn(coSn);

        if (cohorts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        boolean hasRecruiting = cohorts.stream()
                .anyMatch(cohort -> cohort.getCohortSttsNm() == cohortSttsNm.RECRUITING);

        Map<String, Object> response = new HashMap<>();
        response.put("cohorts", cohorts);
        response.put("stts", hasRecruiting ? "RECRUITING" : null);

        return ResponseEntity.ok(response);
    }


    // @GetMapping("/company/{coSn}/names")
    // public ResponseEntity<List<CohortListDto>> getCohortNamesByCompanyId(@PathVariable Long coSn) {
    //     List<CohortListDto> names = cohortService.findNamesByCoSn(coSn);
    //     if (names.isEmpty()) {
    //         return ResponseEntity.noContent().build();
    //     }
    //     return ResponseEntity.ok(names);
    // }



    // 생성
    @PostMapping("/setgroup")
    public ResponseEntity<Cohort> createCohort(@RequestBody CohortDto dto) {
        Cohort entity = CohortConverter.toEntity(dto);
        Cohort saved = cohortService.save(entity);
        return ResponseEntity.ok(saved);
    }

    // 수정
    @PutMapping("/{id}")
    public ResponseEntity<Cohort> updateCohort(@PathVariable Long id, @RequestBody Cohort cohort) {
        return cohortService.findById(id)
                .map(existing -> {
                    // 업데이트 할 필드 설정 (id 제외)
                    existing.setCohortNm(cohort.getCohortNm());
                    existing.setCrclmNm(cohort.getCrclmNm());
                    existing.setCrclmCn(cohort.getCrclmCn());
                    existing.setCoSn(cohort.getCoSn());
                    existing.setRecruitBgngDt(cohort.getRecruitBgngDt());
                    existing.setRecruitEndDt(cohort.getRecruitEndDt());
                    existing.setCrclmBgngYmd(cohort.getCrclmBgngYmd());
                    existing.setCrclmEndYmd(cohort.getCrclmEndYmd());
                    existing.setCohortSttsNm(cohort.getCohortSttsNm());
                    existing.setCohortCate(cohort.getCohortCate());
                    existing.setAttendStartTm(cohort.getAttendStartTm());
                    existing.setAttendEndTm(cohort.getAttendEndTm());
                    existing.setCohortPl(cohort.getCohortPl());
                    Cohort updated = cohortService.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCohort(@PathVariable Long id) {
        if (!cohortService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        cohortService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/titles")
    public ResponseEntity<List<String>> getAllCohortTitles() {
        List<String> titles = cohortService.getAllCohortTitles();
        if (titles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(titles);
    }

}

