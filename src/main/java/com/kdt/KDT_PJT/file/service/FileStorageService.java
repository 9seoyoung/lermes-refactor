package com.kdt.KDT_PJT.file.service;

import com.kdt.KDT_PJT.file.util.StoragePaths;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path base = StoragePaths.root();

    /*
    * 파일 저장될 루트 디렉터리 실제로 존재하는지 체크, 없으면 생성함*/
    public void ensureBaseDir() {
        try {
            Files.createDirectories(base);  //base 경로 (user.home/LERMES/files)생성함, 없으면 만들고 있으면 아무것도 안함
        } catch (IOException e) {
            throw new RuntimeException("cannot create base dir: " + base, e);   //생성 실패시 예외 발생
        }
    }
    /*
    * 파일을 물리적으로 저장하는 함수
    * 저장 파일명(UUID 적용)을 반환함.
    * return 예시 ) 9a4b3d1f...c8e.jpg */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is required"); // 파일이 비어있는지 체크하고 비어있으면 예외
        ensureBaseDir();                                                                            // 파일 저장 디렉토리 존재하는지 체크, 없으면 만듦
        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "file"); // getOriginalFilename()로 실제 이름을 original에 저장.
        String ext = extractExt(original);      // 확장자만 ext에 저장
        String stored = genRandomName(ext);     // UUID 생성후 확장자도 붙임. ex) 9a4b3d1f...c8e.jpg -> 실제 파일 명 생성
        Path target = resolveFilename(stored);  // 저장될 파일의 최종 저장 경로 반환됨. user.home/LERMES/files/9a4b3d1f...c8e.jpg
        try {
            Files.copy(file.getInputStream(), target);  // 전달받은 file객체에서 입력 스트림 얻어와서 경로에 파일의 바이너리 데이터를 복사함
        } catch (IOException e) {
            throw new RuntimeException("copy failed to: " + target, e); //실패하면 예외발생
        }
        return stored;      //파일 물리저장 후 uuid 적용된 이름 반환해줌 ex)9a4b3d1f...c8e.jpg
    }

    /*
    * 파일 확장자 포함된 UUID 적용된 이름을 String타입으로 받고
    * base경로 (user.home/LERMES/files) 와 합쳐진 주소를 반환해준다 (파일의 최종 경로 반환).*/
    public Path resolveFilename(String storedFileName) {
        Path target = base.resolve(storedFileName).normalize();         //중간에 불필요한 .. 같은거 들어갈수있는거 빼줌
        if (!target.startsWith(base)) throw new SecurityException("Path traversal");
        return target;
    }

    /*
    * 파일 저장 이름을 이용하여 실제 경로에 파일이 존재하는지 확인 후 있으면 파일 객체를 리턴 */
    public Resource loadAsResource(String storedFileName) {
        Path p = resolveFilename(storedFileName);   // 파일 저장된 경로 생성
        if (!Files.exists(p)) throw new RuntimeException("file not found: " + storedFileName);  //해당 저장 경로에 파일 없으면 예외발생, 있으면 파일 객체를 반환(업로드시에는 MultipartFile타입(input용 클래스)이었는데)
        return new FileSystemResource(p); // 다운로드시에는 Resource 타입 객체로 만들어서 리턴함 (Output용 클래스)
    }

    public String detectContentType(Path p) {
        try {
            String type = Files.probeContentType(p);
            return type != null ? type : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        } catch (IOException e) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }

    private static String genRandomName(String ext) {
        String base = UUID.randomUUID().toString().replace("-", "");
        return (ext == null || ext.isBlank()) ? base : base + "." + ext.toLowerCase();
    }

    private static String extractExt(String filename) {
        int i = filename.lastIndexOf('.');
        if (i < 0 || i == filename.length() - 1) return null;
        return filename.substring(i + 1);
    }
}