package com.kdt.KDT_PJT.cerfifi.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.dto.CalendarRequestDTO;
import com.kdt.KDT_PJT.cerfifi.dto.CertifiResponseDTO;
import com.kdt.KDT_PJT.cerfifi.dto.CertifiTemplateRequestDTO;
import com.kdt.KDT_PJT.cerfifi.service.CertifiService;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/certifi")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CertifiController {

    private final CertifiService certifiService;


    /*
    * 증명서 등록*/
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','EMPLOYEE')") // 권한 체크
    @PostMapping("/template")
    public ResponseEntity<Void> registerCertifiTemplate(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @RequestBody CertifiTemplateRequestDTO params
    ) {
        params.setCoSn(Math.toIntExact(me.getCompanySn())); //me의 Cosn받아와서 넣기
        certifiService.createCertifiTemplate(params);
        return ResponseEntity.noContent().build();
    }
// TODO
//    @PreAuthorize("hasAnyRole('STUDENT')")
//    @GetMapping
//    public ResponseEntity<CertifiResponseDTO> getCertifi(@AuthenticationPrincipal AuthCustomUserDetails me){
//
//        return ResponseEntity.of(certifiService.getCertifiByCertifiTypeNm());
//    }

}
