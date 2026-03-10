package com.kdt.KDT_PJT.bbs.enums;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToBbsTypeConverter  implements Converter<String, BbsType> {
    @Override
    public BbsType convert(String source) {
        return BbsType.fromDescription(source);
    }
}
