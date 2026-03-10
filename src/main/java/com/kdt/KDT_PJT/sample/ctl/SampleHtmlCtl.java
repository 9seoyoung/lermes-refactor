package com.kdt.KDT_PJT.sample.ctl;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.kdt.KDT_PJT.sample.svc.SampleService;



@Controller
@RequestMapping("/sampleHtmlMvc")
public class SampleHtmlCtl {

	
	@Autowired // 객체 생성과 연결을 Spring이 대신 해줌, 서비스자동 주입
	SampleService sampleService;
	
	// log 사용을 위함
	private final Logger log = LoggerFactory.getLogger(getClass());
	
	
	// HTML 예제	
	@GetMapping("/hello")
	public String helloHTML(Model model) {
		
		log.info("test");
		
		model.addAttribute("name", "홍길동");
		return "index"; // → templates/index.html
	}

}
