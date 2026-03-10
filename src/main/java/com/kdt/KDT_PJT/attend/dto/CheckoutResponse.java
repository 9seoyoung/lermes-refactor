package com.kdt.KDT_PJT.attend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CheckoutResponse {
    private final boolean ok;
    private final String message;
    private final LocalDateTime checkoutTime;
}
