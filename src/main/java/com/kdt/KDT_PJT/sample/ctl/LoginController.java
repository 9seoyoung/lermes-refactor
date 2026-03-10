package com.kdt.KDT_PJT.sample.ctl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import com.kdt.KDT_PJT.sample.svc.UserService;

@Controller
public class LoginController {
	
    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @GetMapping("/main")
    public String main() {
        return "main";
    }
    
    @PostMapping("/join")
    public String joinSubmit(@RequestParam String username,
                             @RequestParam String password,
                             @RequestParam String name
                             ,CmmnMap params) {
    	
    	params.put("username", username);
    	params.put("password", password);
    	params.put("name", name);
    	

        return "redirect:/login"; // 가입 후 로그인 페이지로
    }
    
    
}