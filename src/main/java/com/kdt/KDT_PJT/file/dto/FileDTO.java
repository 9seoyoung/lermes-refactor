package com.kdt.KDT_PJT.file.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data //@Getter + @Setter + @RequiredArgsConstructor + @ToString + @EqualsAndHashCode
public class FileDTO {
    private Integer fileSn;            // FILE_SN
    private String orgnlFileNm;        // ORGNL_FILE_NM
    private String strgFileNm;         // STRG_FILE_NM
    private String strgFilePath;       // STRG_FILE_PATH
    private Byte delYn;                // DEL_YN (0/1)
    private LocalDateTime strgDt;      // STRG_DT
    private Integer userSn;            // USER_SN
    private Integer coSn;              // CO_SN
    private Long fileSz;               // FILE_SZ
    private String fileMimeType;       // FILE_MIME_TYPE
    private String fileExtnNm;         // FILE_EXTN_NM
    private String formUuid;            // FORM_UUID (어떤글에대한 매칭인지)
}