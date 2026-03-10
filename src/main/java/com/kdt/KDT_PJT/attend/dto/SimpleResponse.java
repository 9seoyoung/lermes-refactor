package com.kdt.KDT_PJT.attend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class SimpleResponse {
    private final boolean ok;
    private final String message;
    private final Object data;
}
