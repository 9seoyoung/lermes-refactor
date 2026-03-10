package com.kdt.KDT_PJT.cohortresponse.ctl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.kdt.KDT_PJT.cohortresponse.dto.CohortResponseDetailDto;
import com.kdt.KDT_PJT.cohortresponse.dto.CohortResponseDto;
import com.kdt.KDT_PJT.cohortresponse.service.CohortResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cohort-responses")
@RequiredArgsConstructor
public class CohortResponseController {

    private final CohortResponseService service;

    @PostMapping
    public Long save(@RequestBody CohortResponseDto dto) {
        return service.save(dto);
    }

    @GetMapping("/{id}")
    public CohortResponseDetailDto get(@PathVariable Long id) throws JsonProcessingException {
        return service.get(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/parent/{parentSn}")
    public List<CohortResponseDto> findByParentSn(@PathVariable Integer parentSn) {
        return service.findByParentSn(parentSn);
    }
}
