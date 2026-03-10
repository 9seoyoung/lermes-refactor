package com.kdt.KDT_PJT.file.ctl;

import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import com.kdt.KDT_PJT.file.dto.UploadResultDTO;
import com.kdt.KDT_PJT.file.service.FileService;
import com.kdt.KDT_PJT.file.service.FileStorageService;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Array;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FileController {

    private final FileStorageService storage;
    private final FileService fileService;

//    public FileController(FileStorageService storage, FileService fileService) {
//        this.storage = storage;
//        this.fileService = fileService;
//    } //@RequiredArgsConstructor로 대치

    // 단일 업로드: 파일을 user.home/LERMES/files 폴더에 저장하고 저장된 파일명을 반환
    // 단일 업로드는 폐기) 필요가없음. 다중이 더 안정적일듯 [{}] 걍 단일도 이렇게 받으면 되니까.
//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public UploadResultDTO upload(@AuthenticationPrincipal AuthCustomUserDetails me,
//                                  @RequestPart("file") MultipartFile file,
//                                  @RequestParam(value="formUuid", required=false) String formUuid) {
//        Integer userSn = (me != null) ? Math.toIntExact(me.getId()) : null; //로그인한경우 usersn집어넣음
//        Integer coSn   = (me != null && me.getCompanySn() != null) ? Math.toIntExact(me.getCompanySn()) : null; //회사넘버는 없을수도있는데 있으면 집어넣음
//        return fileService.save(file, userSn, coSn, formUuid);
//    }

    // 다중 업로드: /api/files 에 POST로 처리 (단일도 files 1개로 전송)
    // 다중 업로드의 경우도, MultipartFile 타입 객체로 받고
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<UploadResultDTO> uploadBatch(@AuthenticationPrincipal AuthCustomUserDetails me,
                                             @RequestPart("files") List<MultipartFile> files,
                                             @RequestParam(value="formUuid", required=false) String formUuid) {
        Integer userSn = (me != null) ? Math.toIntExact(me.getId()) : null; //로그인한경우 usersn집어넣음
        Integer coSn   = (me != null && me.getCompanySn() != null) ? Math.toIntExact(me.getCompanySn()) : null; //회사넘버는 없을수도있는데 있으면 집어넣음
        return fileService.saveBatch(files, userSn, coSn, formUuid); //
    }

    // 미리보기 요청 받는 컨트롤러
    @GetMapping("/{storedFileName}/preview")
    public ResponseEntity<Resource> preview(@PathVariable String storedFileName,
                                            @RequestParam(value = "original", required = false) String original) {
        Resource r = storage.loadAsResource(storedFileName);
        Path p = storage.resolveFilename(storedFileName);
        String contentType = storage.detectContentType(p);
        String filename = (original != null && !original.isBlank()) ? original : storedFileName;
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
        long len;
        try { len = Files.size(p); } catch (Exception e) { len = -1L; }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encoded + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(Math.max(0, len))
                .body(r);
    }

    // 파일 SN으로 미리보기 (inline)
    @GetMapping("/id/{fileSn:\\d+}/preview")
    public ResponseEntity<Resource> previewById(@PathVariable int fileSn) {
        var meta = fileService.getMeta(fileSn);
        if (meta == null || (meta.getDelYn() != null && meta.getDelYn() == 1)) {
            return ResponseEntity.notFound().build();
        }

        String storedFileName = meta.getStrgFileNm();
        String original = meta.getOrgnlFileNm();

        Resource r = storage.loadAsResource(storedFileName);
        Path p = storage.resolveFilename(storedFileName);
        String contentType = storage.detectContentType(p);

        String filename = (original != null && !original.isBlank()) ? original : storedFileName;
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replaceAll("\\+", "%20");

        long len;
        try {
            len = Files.size(p);
        } catch (Exception e) {
            len = -1L;
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encoded + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(Math.max(0, len))
                .body(r);
    }



    // 다운로드 (attachment) - 저장 파일명으로
    @GetMapping("/{storedFileName}")
    public ResponseEntity<Resource> download(@PathVariable String storedFileName,
                                             @RequestParam(value = "original", required = false) String original) {
        Resource r = storage.loadAsResource(storedFileName);
        Path p = storage.resolveFilename(storedFileName);
        String contentType = storage.detectContentType(p);
        String filename = original != null && !original.isBlank() ? original : storedFileName;
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
        long len;
        try {
            len = Files.size(p);
        } catch (Exception e) {
            len = -1L;
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encoded + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(Math.max(0, len))
                .body(r);
    }

    // 파일 SN으로 원본 파일명 조회
    @GetMapping("/id/{fileSn:\\d+}/name")
    public ResponseEntity<?> getOriginalName(@PathVariable int fileSn) {
        var meta = fileService.getMeta(fileSn);
        if (meta == null || (meta.getDelYn() != null && meta.getDelYn() == 1)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of(
                "fileSn", meta.getFileSn(),
                "originalFileName", meta.getOrgnlFileNm()
        ));
    }

    //1) fileSn 받아오고 그걸로 저장 파일명(strgfilenm)받아오는 api 호출 -> 파일명 받아옴 -> user.home+LERMES/FILES/파일명 으로 바로 연결
    // 2) 미리보기 api 호출하면 그거는 용량 쪼매난애니까 더 빨리 받아질거임 그거쓰기

    // 파일 SN으로 다운로드 (attachment)
    @GetMapping("/id/{fileSn:\\d+}")    //파일 SN을 url에 실어서 요청 보냄, @Pathvariable은 항상 포함되어야하고,
    // @RequestParam도 value="fileSn" required = false 한거 아니면
    //일반 타입으로 받아도 괜찮음. null이 해당 변수에 들어오기 전에 막혀서 상관 없음
    public ResponseEntity<Resource> downloadById(@PathVariable int fileSn) {
        var meta = fileService.getMeta(fileSn);     //select * from TB_FILE where fileSn = {#fileSn} 실행, 해당 row 긁어옴
        if (meta == null || (meta.getDelYn() != null && meta.getDelYn() == 1)) {
            return ResponseEntity.notFound().build();   //삭제됐거나 긁어온게 null뿐이라면 return
        }
        String storedFileName = meta.getStrgFileNm();
        String original = meta.getOrgnlFileNm();        //파일 원본명 original 에 저장

        Resource r = storage.loadAsResource(storedFileName);    // 파일이 실제 그경로에 있으면 해당하는 파일 객체가 반환됨 (Resource 타입 파일 객체)
        Path p = storage.resolveFilename(storedFileName);       // 파일의 경로값을 Path 타입 객체로 반환
        String contentType = storage.detectContentType(p);      // MIME 타입 감지 (응답 헤더에 사용할 용도)
        String filename = (original != null && !original.isBlank()) ? original : storedFileName;    //파일 원본명 없으면 저장명(UUID적용)을 실제 다운로드시 사용할 파일명으로 사용, 있으면 원본명 사용
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replaceAll("\\+", "%20"); //파일명 인코딩, 한글 깨짐 방지
        long len;
        try {
            len = Files.size(p);    //파일 사이즈 감지해서 len에 담음
        } catch (Exception e) {     // 오류 발생시 -1로 설정
            len = -1L;
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encoded + "\"")    //DisPosition헤더를 attachment로 설정하여 브라우저가 파일 다운하도록 강제설정, filename에 인코딩된 파일명을 담아서 올바르게 저장하도록 함
                .contentType(MediaType.parseMediaType(contentType))         //contentType 헤더에 MIME타입을 설정해서 브라우저가 적절한 방식으로 처리하게함
                .contentLength(Math.max(0, len))                            //파일 크기(바이트)설정, 이걸로 브라우저가 다운로드 진행률 표시할수있음. 크기 측정 아까 못했으면(-1) 0으로 처리
                .body(r);                                                   //body에 파일 객체를 실어서 보냄(실제 파일 데이터를 전송)
    }

    @GetMapping("/formUuid/{formUuid}") // formUuid를 보내면 해당하는 파일의 SN을 리턴해줌
    public List<CmmnMap> findFileSnByFormUuid(@PathVariable String formUuid) {
        List<CmmnMap> result = fileService.findFileSnByFormUuid(formUuid);
        System.out.println("결과 result = " + result);
        return result;
    }

}
