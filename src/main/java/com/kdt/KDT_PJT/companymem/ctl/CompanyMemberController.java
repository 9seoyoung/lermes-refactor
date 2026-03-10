package com.kdt.KDT_PJT.companymem.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.companymem.Dto.CompanyMemberDto;
import com.kdt.KDT_PJT.companymem.service.CompanyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company-members")
@RequiredArgsConstructor
public class CompanyMemberController {

    private final CompanyMemberService companyMemberService;
    
    //직원 승인 대기 목록 ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ
    @GetMapping
    public ResponseEntity<List<CompanyMemberDto>> getMembersInSameCompany(
            @RequestParam("effectiveSn") Long companySn) {

        List<CompanyMemberDto> members = companyMemberService.findByCompanySn(companySn);

        return ResponseEntity.ok(members);
    }


    @PostMapping
    public ResponseEntity<Long> create(@RequestBody CompanyMemberDto dto) {
        Long id = companyMemberService.save(dto);
        return ResponseEntity.ok(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody CompanyMemberDto dto) {
        companyMemberService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyMemberDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(companyMemberService.get(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        companyMemberService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/apply")
    public ResponseEntity<Long> apply(@RequestBody CompanyMemberDto dto) {
        Long id = companyMemberService.apply(dto);
        return ResponseEntity.ok(id);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long id) {
        companyMemberService.approve(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{companyMemberSn}/approve")
    public ResponseEntity<String> approveCompanyMember(@PathVariable Long companyMemberSn) {
        companyMemberService.approveMember(companyMemberSn);
        return ResponseEntity.ok("승인 완료 (ID: " + companyMemberSn + ")");
    }

    @PostMapping("/{companyMemberSn}/reject")
    public ResponseEntity<String> rejectCompanyMember(@PathVariable Long companyMemberSn) {
        companyMemberService.rejectMember(companyMemberSn);
        return ResponseEntity.ok("반려 완료 (ID: " + companyMemberSn + ")");
    }


}
