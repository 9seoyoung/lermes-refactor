package com.kdt.KDT_PJT.survey.enums;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToSurveyScopeConverter implements Converter<String, SurveyScope> {
    @Override
    public SurveyScope convert(String source) {
        return SurveyScope.from(source);
    }
}
