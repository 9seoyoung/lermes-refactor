package com.kdt.KDT_PJT.file.service;

import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import com.kdt.KDT_PJT.file.dto.FileDTO;
import com.kdt.KDT_PJT.file.dto.UploadResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    private final CmmnDao cmmnDao;
    private final FileStorageService storage;

    public UploadResultDTO save(MultipartFile file, Integer userSn, Integer coSn, String formUuid) { //MultipartFile -> 파일의 바이너리데이터, 파일의 메타데이터 포함하는 File객체를 받을수있는 클래스
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is required");
        System.out.println("파일 객체 = " + file);
        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "file"); //getOriginalFilename()메서드로 파일의 원본 명을 original에 저장
        System.out.println("파일 원본 이름 = " + original);
        String ext = extractExt2(original);
        System.out.println("파일 확장자 = " + ext);// 확장자 추출 함수로 파일의
        String mime = detectMime2(file, ext);
        System.out.println("파일 MIME = " + mime);
        long size = file.getSize();
        System.out.println("파일 사이즈 = " + size);

        // 물리 저장 (UUID 파일명은 FileStorageService.store 내부에서 생성)
        String stored = storage.store(file); // 파일을 실제로 경로에 저장하고, 저장 파일명을 반환해줌 그걸 stored 변수에 담음 ex) stored = 9a4b3d1f...c8e.jpg

        // formUuid 없으면 서버가 생성 (단일 파일 업로드시, 단일일때는 UUID 생성 필요없어서 주석처리)
//        if (formUuid == null || formUuid.isBlank()) {
//            formUuid = UUID.randomUUID().toString().replace("-", "");
//        }

        // DB 저장 DTO 구성
        FileDTO dto = new com.kdt.KDT_PJT.file.dto.FileDTO();
        dto.setOrgnlFileNm(original);
        dto.setStrgFileNm(stored);
        dto.setStrgFilePath(""); //StoragePaths.root().toString() //경로는 하위에 날짜형식 YYYY/MM/DD 이런거 나중에 추가하면 할듯
        dto.setDelYn((byte)0);
        dto.setStrgDt(java.time.LocalDateTime.now());
        dto.setUserSn(userSn);
        dto.setCoSn(coSn);
        dto.setFileSz(size);
        dto.setFileMimeType(mime);
        dto.setFileExtnNm(ext);
        dto.setFormUuid(formUuid);

        cmmnDao.insert("com.kdt.mapper.file.FileMapper.insertTbFile", dto); //DB 쿼리에 담음, fileSn 자동증가로 값 추가됨

        return new UploadResultDTO(dto.getFileSn(), original, stored, size, formUuid);        // fileSn은 새로 생긴거 담고, 나머지 저장할때 썼던거 담아서 리턴
    }

    @Transactional //하나의 원자적 단위로, 실패시 롤백 ㄱㄴ하도록
    public List<UploadResultDTO> saveBatch(List<MultipartFile> files, Integer userSn, Integer coSn, String formUuid) {
        if (files == null || files.isEmpty()) throw new IllegalArgumentException("files is required");
        // formUuid 없으면 서버가 생성 (1개 파일 업로드여도 formUuid 무조건 생성) 해당 코드 사용시 아래 블록 주석처리 필요
//        if (formUuid == null || formUuid.isBlank()) {
//            formUuid = UUID.randomUUID().toString().replace("-", "");
//        }

        // 파일 개수가 2개 이상일 경우에만 formUuid를 생성, 해당 코드 사용시 위 블록 주석처리 필요
        if (files.size() > 1 && (formUuid == null || formUuid.isBlank())) {
            formUuid = UUID.randomUUID().toString().replace("-", "");
        }


        List<UploadResultDTO> list = new ArrayList<>(); // 파일 업로드 결과 담을 ArrayList
        for (MultipartFile f : files) {                 // 파일 객체 들어있는 files 배열에 대해.
            list.add(save(f, userSn, coSn, formUuid));  // 이 클래스 위의 save메서드 호출, 호출결과를 ArrayList에 담음
        }                                               //UploadResultDTO 객체가 돌아왔음. 근데 이게 리스트로 계속 쭉 담김 [UploadResultDTO객체1, UploadResultDTO객체2, ...]
        return list;                                    // ArrayList<UploadResultDTO> 를 반환
    }

    private static String extractExt2(String filename) {
        int i = filename.lastIndexOf('.');
        if (i < 0 || i == filename.length() - 1) return null;
        return filename.substring(i + 1);
    }

    private static String detectMime2(MultipartFile file, String ext) {
        try {
            String probe = file.getContentType();
            if (probe != null && !probe.isBlank()) return probe;
            return ext != null ? Files.probeContentType(Path.of("dummy." + ext)) : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        } catch (Exception e) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }

    public FileDTO getMeta(int fileSn) {
        return cmmnDao.selectOne("com.kdt.mapper.file.FileMapper.selectTbFileBySn", fileSn);
    }

    public List<CmmnMap> findFileSnByFormUuid(String formUuid){
        return cmmnDao.selectList("com.kdt.mapper.file.FileMapper.findFileSnByFormUuid", formUuid);
    }

    public List<CmmnMap> readFileSnAndNmbyFormUuid(String formUuid){
        return cmmnDao.selectList("com.kdt.mapper.file.FileMapper.readFileSnAndNmbyFormUuid", formUuid);
    }
}
