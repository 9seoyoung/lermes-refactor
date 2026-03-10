package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.auth.entity.Company;
import com.kdt.KDT_PJT.auth.repository.CompanyRepository;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyLogoController {

    private final CompanyRepository companyRepository;
    private final CohortRepository cohortRepository;

    // 회사 스몰 로고 갱신
    @PostMapping("/{companyId}/logo/small")
    public ResponseEntity<Map<String, Object>> updateSmallLogo(
            @PathVariable Long companyId,
            @RequestParam(value = "fileSn", required = false) Long fileSn
    ) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사 없음: " + companyId));

        // fileSn이 null이면 로고 삭제
        company.setSmallLogoFileSn(fileSn);
        companyRepository.save(company);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "fileSn", fileSn
        ));
    }

    // 회사 조회 (로고 표시용)
    @GetMapping("/{companyId}")
    public ResponseEntity<Company> getCompany(@PathVariable Long companyId) {
        return companyRepository.findById(companyId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 회사 스몰 로고 삭제
    @DeleteMapping("/{companyId}/logo/small")
    public ResponseEntity<Map<String, Object>> deleteSmallLogo(@PathVariable Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사 없음: " + companyId));

        company.setSmallLogoFileSn(null); // 로고 SN 제거
        companyRepository.save(company);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "message", "스몰 로고 삭제 완료"
        ));
    }

    // 회사 빅 로고 갱신
    @PostMapping("/{companyId}/logo/big")
    public ResponseEntity<Map<String, Object>> updateBigLogo(
            @PathVariable Long companyId,
            @RequestParam(value = "fileSn", required = false) Long fileSn
    ) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사 없음: " + companyId));

        company.setBigLogoFileSn(fileSn);
        companyRepository.save(company);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "fileSn", fileSn
        ));
    }

    // 회사 빅 로고 삭제
    @DeleteMapping("/{companyId}/logo/big")
    public ResponseEntity<Map<String, Object>> deleteBigLogo(@PathVariable Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사 없음: " + companyId));

        company.setBigLogoFileSn(null);
        companyRepository.save(company);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "message", "빅 로고 삭제 완료"
        ));
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<Company> updateCompany(
            @PathVariable Long companyId,
            @RequestBody Company updated
    ) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사 없음: " + companyId));

        // 필요한 필드만 업데이트
        company.setName(updated.getName());
        company.setCompanyTel(updated.getCompanyTel());
        company.setCompanyAddress(updated.getCompanyAddress());
        company.setCompanyAddressDetail(updated.getCompanyAddressDetail());
        company.setSmallLogoFileSn(updated.getSmallLogoFileSn());

        companyRepository.save(company);
        return ResponseEntity.ok(company);
    }

    // ========================== 기수 ==========================

    @PostMapping("/cohort/{cohortSn}/image")
    public ResponseEntity<Map<String, Object>> updateCohortImage(
            @PathVariable Long cohortSn,
            @RequestParam(value = "fileSn", required = false) Long fileSn
    ) {
        Cohort cohort = cohortRepository.findById(cohortSn)
                .orElseThrow(() -> new IllegalArgumentException("기수 없음: " + cohortSn));

        cohort.setCohortImg(fileSn);
        cohortRepository.save(cohort);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "fileSn", fileSn
        ));
    }

    @DeleteMapping("/{companyId}/cohort/{cohortSn}/image")
    public ResponseEntity<Map<String, Object>> deleteCohortImage(
            @PathVariable Long companyId,
            @PathVariable Long cohortSn
    ) {
        Cohort cohort = cohortRepository.findById(cohortSn)
                .orElseThrow(() -> new IllegalArgumentException("기수 없음: " + cohortSn));

        cohort.setCohortImg(null);
        cohortRepository.save(cohort);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "message", "기수 이미지 삭제 완료"
        ));
    }
}