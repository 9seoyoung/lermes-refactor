package com.kdt.KDT_PJT.cerfifi.service;

import com.kdt.KDT_PJT.cerfifi.dto.CertifiResponseDTO;
import com.kdt.KDT_PJT.cerfifi.dto.CertifiTemplateRequestDTO;
import com.kdt.KDT_PJT.cerfifi.exception.CertifiDuplicateException;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CertifiService {
    @Autowired
    CmmnDao dao;

    @Transactional
    public void createCertifiTemplate(CertifiTemplateRequestDTO params) {

        // 1. 중복 예외 처리 블록
        try {
            // DB에 등록 시도 (CmmnDao를 통해 MyBatis 실행)
            dao.insert("com.kdt.mapper.certifi.createCertifiTemplate", params);
            System.out.println("params = " + params);

        } catch (DuplicateKeyException e) {
            // 2. DuplicateKeyException 발생 시 Custom 예외로 전환

            // 사용자에게 보낼 메시지를 DTO 정보(회사, 유형)를 기반으로 생성
            String errorMessage = String.format(
                    "해당 회사(CO_SN: %d)에는 이미 '%s' 유형의 증명서 서식이 등록되어 있습니다.",
                    params.getCoSn(),
                    params.getCertifiTypeNm()
            );

            // 3. 비즈니스 예외(Custom Exception)를 던짐
            // (예: CertifiDuplicateException은 직접 정의해야 함)
            throw new CertifiDuplicateException(errorMessage, e);

        } catch (Exception e) {
            // 그 외 일반적인 DB/런타임 예외 처리
            throw new RuntimeException("증명서 서식 등록 중 알 수 없는 오류 발생", e);
        }
    }

    //TODO
//    public CertifiResponseDTO getCertifiByCertifiTypeNm(){
//
//    }

}
