package com.kdt.KDT_PJT.company.service;

import com.kdt.KDT_PJT.auth.entity.Company;
import com.kdt.KDT_PJT.auth.repository.CompanyRepository;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.entity.cohortSttsNm;
import com.kdt.KDT_PJT.company.dto.CompanyWithStatusDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CohortRepository cohortRepository;

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회사입니다. ID = " + id));
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public CompanyWithStatusDto getCompanyDetailWithStatus(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회사입니다. ID = " + id));

        List<Cohort> cohorts = cohortRepository.findByCoSn(id);

        boolean hasRecruiting = cohorts.stream()
                .anyMatch(cohort -> cohort.getCohortSttsNm() == cohortSttsNm.RECRUITING);

        return CompanyWithStatusDto.builder()
                .id(company.getId())
                .brno(company.getBrno())
                .name(company.getName())
                .active(company.isActive())
                .registeredAt(company.getRegisteredAt())
                .fileSn(company.getFileSn())
                .stts(hasRecruiting ? "RECRUITING" : null)
                .build();
    }

    public List<Map<String, Object>> getAllCompaniesWithStatus() {
        List<Company> companies = companyRepository.findAll();

        return companies.stream()
                .map(company -> {
                    List<Cohort> cohorts = cohortRepository.findByCoSn(company.getId());
                    boolean hasRecruiting = cohorts.stream()
                            .anyMatch(cohort -> cohort.getCohortSttsNm() == cohortSttsNm.RECRUITING);

                    Map<String, Object> result = new HashMap<>();
                    result.put("id", company.getId());
                    result.put("brno", company.getBrno());
                    result.put("name", company.getName());
                    result.put("active", company.isActive());
                    result.put("registeredAt", company.getRegisteredAt());
                    result.put("fileSn", company.getFileSn());
                    result.put("stts", hasRecruiting ? "RECRUITING" : null);
                    result.put("companyAddress", company.getCompanyAddress());
                    result.put("companyAddressDetail", company.getCompanyAddressDetail());
                    result.put("bigLogoFileSn", company.getBigLogoFileSn());

                    return result;
                })
                .collect(Collectors.toList());
    }
}
