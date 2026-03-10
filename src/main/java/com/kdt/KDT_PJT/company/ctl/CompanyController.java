package com.kdt.KDT_PJT.company.ctl;

import com.kdt.KDT_PJT.auth.entity.Company;
import com.kdt.KDT_PJT.company.dto.CompanyWithStatusDto;
import com.kdt.KDT_PJT.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/company")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("/gogo")
    public List<Map<String, Object>> getAllCompaniesDe() {
        return companyService.getAllCompaniesWithStatus();
    }

    @GetMapping
    public List<Company> getAllCompanies() { return companyService.getAllCompanies(); }

    @GetMapping("/{id}")
    public Company getCompany(@PathVariable Long id) {
        return companyService.getCompanyById(id);
    }

    @GetMapping("/{id}/detail")
    public CompanyWithStatusDto getCompanyDetail(@PathVariable Long id) {
        return companyService.getCompanyDetailWithStatus(id);
    }

}
