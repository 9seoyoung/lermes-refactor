package com.kdt.KDT_PJT.file.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadResultDTO {
    private Integer fileSn; // 생성된 PK
    private String originalFileName;
    private String storedFileName;
    private long size;
    private String formUuid;

//    public UploadResultDTO() {}
//    public UploadResultDTO(Integer fileSn, String originalFileName, String storedFileName, long size) {
//        this.fileSn = fileSn;
//        this.originalFileName = originalFileName;
//        this.storedFileName = storedFileName;
//        this.size = size;
//    }
//
//    public Integer getFileSn() {
//        return fileSn;
//    }
//
//    public void setFileSn(Integer fileSn) {
//        this.fileSn = fileSn;
//    }
//
//    public String getOriginalFileName() {
//        return originalFileName;
//    }
//
//    public void setOriginalFileName(String originalFileName) {
//        this.originalFileName = originalFileName;
//    }
//
//    public String getStoredFileName() {
//        return storedFileName;
//    }
//
//    public void setStoredFileName(String storedFileName) {
//        this.storedFileName = storedFileName;
//    }
//
//    public long getSize() {
//        return size;
//    }
//
//    public void setSize(long size) {
//        this.size = size;
//    }
}
