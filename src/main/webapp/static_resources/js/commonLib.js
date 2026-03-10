
function cf_setBtnState_ByCrudAuth(mod_crud, btn_el_id){
	var authtargetmenu = auth_menulist.getElementFirst("menuUrl", window.location.pathname);
	
	if(!cf_isEmpty(authtargetmenu)){
		var yn;
		if(mod_crud === "c") yn = authtargetmenu.cYn;
		else if(mod_crud === "r") yn = authtargetmenu.rYn;
		else if(mod_crud === "u") yn = authtargetmenu.uYn;
		else if(mod_crud === "d") yn = authtargetmenu.dYn;
		
		if("N" === yn){
			$("#"+btn_el_id).remove();
		}
	}
}

function cf_setAttchFiles_portal(fileList, atchFileList, info){
	var atchFileListLength = atchFileList.length;
	var fileMappingInfo = [];
	
	if(atchFileListLength >= 1){
		if(cf_isEmpty(atchFileList[0].fileinfo)){
			info.atch_file_1 = atchFileList[0].fileId;
		} else {
			fileList.push(atchFileList[0].fileinfo);
			fileMappingInfo.push("atch_file_1");
			info.atch_file_1 = "";
		}
	} else {
		info.atch_file_1 = "";
	}
	
	if(atchFileListLength >= 2){
		if(cf_isEmpty(atchFileList[1].fileinfo)){
			info.atch_file_2 = atchFileList[1].fileId;
		} else {
			fileList.push(atchFileList[1].fileinfo);
			fileMappingInfo.push("atch_file_2");
			info.atch_file_2 = "";
		}
	} else {
		info.atch_file_2 = "";
	}
	
	if(atchFileListLength >= 3){
		if(cf_isEmpty(atchFileList[2].fileinfo)){
			info.atch_file_3 = atchFileList[2].fileId;
		} else {
			fileList.push(atchFileList[2].fileinfo);
			fileMappingInfo.push("atch_file_3");
			info.atch_file_3 = "";
		}
	} else {
		info.atch_file_3 = "";
	}
	
	if(atchFileListLength >= 4){
		if(cf_isEmpty(atchFileList[3].fileinfo)){
			info.atch_file_4 = atchFileList[3].fileId;
		} else {
			fileList.push(atchFileList[3].fileinfo);
			fileMappingInfo.push("atch_file_4");
			info.atch_file_4 = "";
		}
	} else {
		info.atch_file_4 = "";
	}
	
	if(atchFileListLength >= 5){
		if(cf_isEmpty(atchFileList[4].fileinfo)){
			info.atch_file_5 = atchFileList[4].fileId;
		} else {
			fileList.push(atchFileList[4].fileinfo);
			fileMappingInfo.push("atch_file_5");
			info.atch_file_5 = "";
		}
	} else {
		info.atch_file_5 = "";
	}
	info.fileMappingInfo = fileMappingInfo;
}

function cf_setFileList(fileList, info){
	if(!cf_isEmpty(info.atch_file_1)){
		var file = { fileId : info.atch_file_1, fileNm : info.atch_file_1_nm,  isImg : cf_isImgFileNm(info.atch_file_1_nm), }
		fileList.push(file)
	}
	if(!cf_isEmpty(info.atch_file_2)){
		var file = { fileId : info.atch_file_2, fileNm : info.atch_file_2_nm,  isImg : cf_isImgFileNm(info.atch_file_2_nm), }
		fileList.push(file)
	}
	if(!cf_isEmpty(info.atch_file_3)){
		var file = { fileId : info.atch_file_3, fileNm : info.atch_file_3_nm,  isImg : cf_isImgFileNm(info.atch_file_3_nm), }
		fileList.push(file)
	}
	if(!cf_isEmpty(info.atch_file_4)){
		var file = { fileId : info.atch_file_4, fileNm : info.atch_file_4_nm,  isImg : cf_isImgFileNm(info.atch_file_4_nm), }
		fileList.push(file)
	}
	if(!cf_isEmpty(info.atch_file_5)){
		var file = { fileId : info.atch_file_5, fileNm : info.atch_file_5_nm,  isImg : cf_isImgFileNm(info.atch_file_5_nm), }
		fileList.push(file)
	}
}

function cf_fileValidationImg(file){
	if(file.size > 2000000){
		alert("파일 사이즈 2MB까지 업로드 가능합니다.");
		return false;
	}
	var tmpext = file.name.ext();
	if(tmpext !== "jpg" && tmpext !== "jpeg" && tmpext !== "gif" && tmpext !== "png" 
			&& tmpext !== "bmp" ){
		alert("지원하지 않는형식의 파일입니다.");
		return false;
	}
	return true;
}

function cf_fileValidation(file){
	if(file.size > 100000000){
		alert("파일 사이즈 100MB까지 업로드 가능합니다.");
		return false;
	}
	var tmpext = file.name.ext();
	if(tmpext !== "jpg" && tmpext !== "jpeg" && tmpext !== "gif" && tmpext !== "png" 
			&& tmpext !== "bmp" && tmpext !== "doc" && tmpext !== "docx" && tmpext !== "hwp"
			&& tmpext !== "xls" && tmpext !== "xlsx" && tmpext !== "zip" && tmpext !== "pdf"
			&& tmpext !== "ppt" && tmpext !== "pptx"){
		alert("지원하지 않는형식의 파일입니다.");
		return false;
	}
	return true;
}

function cf_isImgFileNm(strsrc){
	var exttmp = strsrc.ext();
	if(exttmp === "png" || exttmp === "jpg"
		|| exttmp === "jpeg" || exttmp === "bmp"
		|| exttmp === "gif"){
		return true;
	} else {
		return false;
	}
}

Vue.mixin({
	methods : {
		allCheckToggle : function(datalist){
			
			var obj = event.target != undefined ? event.target : event.srcElement
			
			var chkval = obj.checked;
			for(var i=0; i<datalist.length; i++){
				datalist[i].chk=chkval;
			}
		},
		isImgFileNm : function(strsrc) {
			
			var exttmp = strsrc.ext();
			if(exttmp === "png" || exttmp === "jpg"
				|| exttmp === "jpeg" || exttmp === "bmp"
				|| exttmp === "gif"){
				return true;
			} else {
				return false;
			}
	    },
	    admin_atch_del_fil : function(target){
			if(target === '1') 		vueapp.info.atch_file_1 = "";
			else if(target === '2')	vueapp.info.atch_file_2 = "";
			else if(target === '3')	vueapp.info.atch_file_3 = "";
			else if(target === '4')	vueapp.info.atch_file_4 = "";
			else if(target === '5')	vueapp.info.atch_file_5 = "";
		},
	},
	directives : {
		/**
		 * 처음 페이지가 열릴때 포커스가 선택되게 하는 directive
		 */
		focus : {
		  // 바인딩 된 엘리먼트가 DOM에 삽입되었을 때...
		  inserted: function (el) {
		    // 엘리먼트에 포커스를 줍니다
		    el.focus()
		  }
		},
		/**
		 * 마우스가 선택될때 전체선택이 되도록 하는 directive
		 */
		select : function (el, binding, vnode) {
			el.addEventListener('click', function (event) {
				this.select();
			}, false);
		},
		/**
		 * 팝업을 열때 팝업의 Vue 인스턴스의 data 중 caller에 호출한 Vue 인스턴스를 넘기는 directive
		 */
		popupopen : function(el, binding, vnode) {
			el.addEventListener('click', function (event) {
				var classList = this.className.replaceAll('\t',' ').split(' ');
			    var classname = "";
			    for(var i=0; i<classList.length; i++){
			    	classname = classList[i];
			    	if(classname.length > 5 && classname.substring(classname.length-5) === "_open"){
			    		eval(classname.substring(0, classname.length-5) + "_app.caller = vnode.context.$root");
			    		break;
			    	}
			    }
			}, false);
		},
		/**
		 * 한글만 입력이 되도록 하는 directive
		 */
		hangle : function (el, binding, vnode) {
			
			var data = vnode.data.domProps.value;
				
			//한글만 입력가능
			data = data.replace(/[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g, "");
			
			var directives = vnode.data.directives;	
			var dataexpression = "";
			for(var i=0; i<directives.length; i++){
				if(directives[i].name === "model"){
					dataexpression = directives[i].expression;
					break;
				}
			}
//		 	vnode.elm.value = data; // 이부분은 IE에서 '한글' 등의 단어를 입력할때 오류가 있어서 코멘트 처리함.
			
			var arrtmp = dataexpression.split(".");
			if(arrtmp.length == 1){
				vnode.context.$root[arrtmp[0]] = data;
			} else if(arrtmp.length == 2){
				vnode.context.$root[arrtmp[0]][arrtmp[1]] = data;
			} else if(arrtmp.length == 3){
				vnode.context.$root[arrtmp[0]][arrtmp[1]][arrtmp[2]] = data;
			} else if(arrtmp.length == 4){
				vnode.context.$root[arrtmp[0]][arrtmp[1]][arrtmp[2]][arrtmp[3]] = data;
			} else if(arrtmp.length == 5){
				vnode.context.$root[arrtmp[0]][arrtmp[1]][arrtmp[2]][arrtmp[3]][arrtmp[4]] = data;
			} else if(arrtmp.length == 6){
				vnode.context.$root[arrtmp[0]][arrtmp[1]][arrtmp[2]][arrtmp[3]][arrtmp[4]][arrtmp[5]] = data;
			}
		},
		/**
		 * 숫자만 formating 입력이 되도록 하는 directive
		 */
		numform : function (el, binding, vnode) {
			
			var data = vnode.data.domProps.value;
			
			//숫자와 소수점만 입력가능
			data = (String(data)).replace(/[^-\.0-9]/g, "");
		    
		    var regx = new RegExp(/(-?\d+)(\d{3})/);
		    var bExists = data.indexOf(".", 0);//0번째부터 .을 찾는다.
		    var strArr = data.split('.');
		    while (regx.test(strArr[0])) {//문자열에 정규식 특수문자가 포함되어 있는지 체크
		        //정수 부분에만 콤마 달기 
		        strArr[0] = strArr[0].replace(regx, "$1,$2");//콤마추가하기
		    }
		    if (bExists > -1) {
		        //. 소수점 문자열이 발견되지 않을 경우 -1 반환
		    	data = strArr[0] + "." + strArr[1];
		    } else { //정수만 있을경우 //소수점 문자열 존재하면 양수 반환 
		    	data = strArr[0];
		    }
		    
			var directives = vnode.data.directives;	
			var dataexpression = "";
			for(var i=0; i<directives.length; i++){
				if(directives[i].name === "model"){
					dataexpression = directives[i].expression;
					break;
				}
			}
			vnode.elm.value = data;
			
			try{
				var arrtmp = dataexpression.split(".");
				if(arrtmp.length == 1){
					vnode.context.$root[arrtmp[0]] = data;
				} else if(arrtmp.length == 2){
					vnode.context.$root[arrtmp[0]][arrtmp[1]] = data;
				} else if(arrtmp.length == 3){
					vnode.context.$root[arrtmp[0]][arrtmp[1]][arrtmp[2]] = data;
				} else if(arrtmp.length == 4){
					vnode.context.$root[arrtmp[0]][arrtmp[1]][arrtmp[2]][arrtmp[3]] = data;
				} else if(arrtmp.length == 5){
					vnode.context.$root[arrtmp[0]][arrtmp[1]][arrtmp[2]][arrtmp[3]][arrtmp[4]] = data;
				} else if(arrtmp.length == 6){
					vnode.context.$root[arrtmp[0]][arrtmp[1]][arrtmp[2]][arrtmp[3]][arrtmp[4]][arrtmp[5]] = data;
				}
			}catch(error){
				console.log(error.message)
			}
			
		}
	}
});

function cf_getUrlParam(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var cv_sessionStorage = {
	setItem : function(key, val){
		if(cf_whatIsIt(val) === "object"){
			sessionStorage.setItem(key, JSON.stringify(val));
			return cv_sessionStorage;
		} else {
			sessionStorage.setItem(key, val);
			return cv_sessionStorage;
		}
	},
	getItem : function(key){
		try{
			return JSON.parse(sessionStorage.getItem(key));
		} catch(error){
			return sessionStorage.getItem(key);
		}
	},
	removeItem : function(key){
		sessionStorage.removeItem(key);
		return cv_sessionStorage;
	},
}

var cv_logConfig = {
	LOG_SVC_CD : "",
	LOG_SVC_LEVEL : "",
	init : function(){
		cv_logConfig.LOG_SVC_CD = "";
		cv_logConfig.LOG_SVC_LEVEL = "";
	},
}

var cv_pagingConfig = {
	func: null,
	func_back : null,
	pageNo: 1,
	hasPrePage: false,
	hasNextPage: false,
	totalPages: 1,
	totalCnt : 0,
	pageSlider : [],
	orders : [],
	limit : 10,
	init : function(){
		cv_pagingConfig.limit = 10;
		cv_pagingConfig.orders = [];
		cv_pagingConfig.pageNo = 1;
		cv_pagingConfig.func = null;
		cv_pagingConfig.func_back = null;
	},
	setInfo : function(pageInfo){

		if(cv_pagingConfig.pageNo > cv_pagingConfig.totalPages){
			cv_pagingConfig.pageNo = cv_pagingConfig.totalPages;
		}

		cv_pagingConfig.pageNo = pageInfo.page;
		cv_pagingConfig.hasPrePage = pageInfo.hasPrePage;
		cv_pagingConfig.hasNextPage = pageInfo.hasNextPage;
		cv_pagingConfig.totalPages = pageInfo.totalPages;
		cv_pagingConfig.pageSlider = pageInfo.pageSlider;
		cv_pagingConfig.totalCnt = pageInfo.totalCount
	},
	goPage : function(pageNo){
		cv_pagingConfig.pageNo = pageNo;
		cv_pagingConfig.func_back();
	},
	goPrevPage : function(){
		if (!cv_pagingConfig.hasPrePage) {
			//		alert("이전페이지가 존재하지 않습니다.");
			return;
		}
		cv_pagingConfig.pageNo -= 1;
		cv_pagingConfig.func_back();
	},
	goNextPage : function(){
		if (!cv_pagingConfig.hasNextPage) {
			//		alert("다음페이지가 존재하지 않습니다.");
			return;
		}
		cv_pagingConfig.pageNo += 1;
		cv_pagingConfig.func_back();
	},
	goPrevSlider : function(){
		
	},
	goNextSlider : function(){
		
	},
	goFirstPage : function(){
		cv_pagingConfig.pageNo = 1;
		cv_pagingConfig.func_back();
	},
	goLastPage : function(){
		cv_pagingConfig.pageNo = cv_pagingConfig.totalPages;
		cv_pagingConfig.func_back();
	},
	renderPagenation : function(mode){
		if(mode === "system"){
			pagenationHtmlSystem();
		} else if(mode === "system_pup01"){
			pagenationHtmlSystemPup01();
		} else if(mode === "system_pup02"){
			pagenationHtmlSystemPup02();
		} else if(mode === "asis_exdList"){
			pagenationHtmlAsisExdList();
		} else if(mode === "portal_01"){
			pagenationHtmlPortal01();
		} else if(mode === "portal_pop_01"){
			pagenationHtmlPortal_pop01();
		}
	},
}

function pagenationHtmlPortal01(){
	
	var pageSliderLength = cv_pagingConfig.pageSlider.length;
	
	var div_paginate_html = "";
	div_paginate_html += '			<a href="#wrap" onClick="cv_pagingConfig.goFirstPage()" class="btn first" title="처음 리스트 이동">';
	div_paginate_html += '				<span class="triangle first"></span>';
	div_paginate_html += '				<span class="triangle first"></span>';
	div_paginate_html += '			</a>';
	div_paginate_html += '			<a href="#wrap" onClick="cv_pagingConfig.goPrevPage()" class="btn prev" title="이전 리스트 이동">';
	div_paginate_html += '				<span class="triangle prev"></span>';
	div_paginate_html += '			</a>';
	for (var i = 0; i < pageSliderLength; i++) {
		if (cv_pagingConfig.pageNo == cv_pagingConfig.pageSlider[i]) {
			div_paginate_html += '	<span class="on">' + cv_pagingConfig.pageSlider[i] + '</span>';
		} else {
			div_paginate_html += '	<span style="cursor: pointer;" onclick="cv_pagingConfig.goPage(\'' + cv_pagingConfig.pageSlider[i] + '\')">' + cv_pagingConfig.pageSlider[i] + '</span>';
		}
	}
	div_paginate_html += '			<a href="#wrap" onClick="cv_pagingConfig.goNextPage()" class="btn next" title="다음 리스트 이동">';
	div_paginate_html += '				<span class="triangle next"></span>';
	div_paginate_html += '			</a>';
	div_paginate_html += '			<a href="#wrap" onClick="cv_pagingConfig.goLastPage()" class="btn last" title="마지막 리스트 이동">';
	div_paginate_html += '				<span class="triangle last"></span>';
	div_paginate_html += '				<span class="triangle last"></span>';
	div_paginate_html += '			</a>';
	
	$("#paginationdiv").html(div_paginate_html);
}

function pagenationHtmlPortal_pop01(){
	
	var pageSliderLength = cv_pagingConfig.pageSlider.length;
	
	var div_paginate_html = "";
	div_paginate_html += '			<a href="javascript:void(0)" onClick="cv_pagingConfig.goFirstPage()" class="btn first">';
	div_paginate_html += '				<span class="triangle first"></span>';
	div_paginate_html += '				<span class="triangle first"></span>';
	div_paginate_html += '			</a>';
	div_paginate_html += '			<a href="javascript:void(0)" onClick="cv_pagingConfig.goPrevPage()" class="btn prev">';
	div_paginate_html += '				<span class="triangle prev"></span>';
	div_paginate_html += '			</a>';
	for (var i = 0; i < pageSliderLength; i++) {
		if (cv_pagingConfig.pageNo == cv_pagingConfig.pageSlider[i]) {
			div_paginate_html += '	<span class="on">' + cv_pagingConfig.pageSlider[i] + '</span>';
		} else {
			div_paginate_html += '	<span style="cursor: pointer;" onclick="cv_pagingConfig.goPage(\'' + cv_pagingConfig.pageSlider[i] + '\')">' + cv_pagingConfig.pageSlider[i] + '</span>';
		}
	}
	div_paginate_html += '			<a href="javascript:void(0)" onClick="cv_pagingConfig.goNextPage()" class="btn next">';
	div_paginate_html += '				<span class="triangle next"></span>';
	div_paginate_html += '			</a>';
	div_paginate_html += '			<a href="javascript:void(0)" onClick="cv_pagingConfig.goLastPage()" class="btn last">';
	div_paginate_html += '				<span class="triangle last"></span>';
	div_paginate_html += '				<span class="triangle last"></span>';
	div_paginate_html += '			</a>';
	
	$("#paginationdiv_pop01").html(div_paginate_html);
}

function pagenationHtmlAsisExdList(){
	
	var pageSliderLength = cv_pagingConfig.pageSlider.length;
	
	var page_str = "";
	if(pageSliderLength > 0){
		page_str += '<div class="paging">';
		page_str += '	<ol>';
		page_str += '		<li class="first" onclick="cv_pagingConfig.goPrevPage()">〈</li>';
		for (var i = 0; i < pageSliderLength; i++) {
			if (cv_pagingConfig.pageNo == cv_pagingConfig.pageSlider[i]) {
				page_str += '<li class="active">' + cv_pagingConfig.pageSlider[i] + '</li>';
			} else {
				page_str += '<li onclick="cv_pagingConfig.goPage(\'' + cv_pagingConfig.pageSlider[i] + '\')">' + cv_pagingConfig.pageSlider[i] + '</li>';
			}
		}
		page_str += '		<li class="last" onclick="cv_pagingConfig.goNextPage()">〉</li>';
	    page_str += '	</ol>';
	    page_str += '</div>';
	} else {
		page_str += '<p>데이터가 존재하지 않습니다.</p>';
	}
	
    $(".listTable").append(page_str);
}

function pagenationHtmlSystem(){
	
	var div_paginate_html = "";
	div_paginate_html += '	<a class="paginate_button previous">Previous</a>';
	if(cv_pagingConfig.totalPages <= 1 ){
		div_paginate_html += '<span>';
		div_paginate_html += '	<a class="paginate_button current">1</a>';
		div_paginate_html += '</span>';
	} else {
		div_paginate_html += '<span>';
		var pageSliderLength = cv_pagingConfig.pageSlider.length;
		for (var i = 0; i < pageSliderLength; i++) {
			if (cv_pagingConfig.pageNo == cv_pagingConfig.pageSlider[i]) {
				div_paginate_html += '<a href="#gm" class="paginate_button current">' + cv_pagingConfig.pageSlider[i] + '</a>';
			} else {
				div_paginate_html += '<a href="#gm" class="paginate_button" onclick="cv_pagingConfig.goPage(\'' + cv_pagingConfig.pageSlider[i] + '\')">' + cv_pagingConfig.pageSlider[i] + '</a>';
			}
		}
		div_paginate_html += '</span>';
	}
	div_paginate_html += '<a class="paginate_button next">Next</a>';
	
	$("#div_paginate").html(div_paginate_html);
	
	
	if(!cv_pagingConfig.hasPrePage){
		$(".paginate_button.previous").addClass("disabled");
		$(".paginate_button.previous").css("cursor", "unset");
	} else {
		$(".paginate_button.previous").click(function(){
			cv_pagingConfig.goPrevPage();
		});
	}
	if(!cv_pagingConfig.hasNextPage){
		$(".paginate_button.next").addClass("disabled");
		$(".paginate_button.next").css("cursor", "unset");
	} else {
		$(".paginate_button.next").click(function(){
			cv_pagingConfig.goNextPage();
		});
	}
	
}

function pagenationHtmlSystemPup01(){
	
	var div_paginate_html = "";
	div_paginate_html += '		<ul class="pagination pagination-sm">';
	div_paginate_html += '			<li><a href="#none" onclick="cv_pagingConfig.goFirstPage()"><i class="entypo-left-open"></i></a></li>';
	div_paginate_html += '			<li><a href="#none" onclick="cv_pagingConfig.goPrevPage()"><i class="entypo-left-open-mini"></i></a></li>';
	var pageSliderLength = cv_pagingConfig.pageSlider.length;
	for (var i = 0; i < pageSliderLength; i++) {
		if (cv_pagingConfig.pageNo == cv_pagingConfig.pageSlider[i]) {
			div_paginate_html += '	<li class="active"><a href="#none">' + cv_pagingConfig.pageSlider[i] + '</a></li>';
		} else {
			div_paginate_html += '	<li><a href="#none" onclick="cv_pagingConfig.goPage(\'' + cv_pagingConfig.pageSlider[i] + '\')">' + cv_pagingConfig.pageSlider[i] + '</a></li>';
		}
	}
	div_paginate_html += '			<li><a href="#none" onclick="cv_pagingConfig.goNextPage()"><i class="entypo-right-open-mini"></i></a></li>';
	div_paginate_html += '			<li><a href="#none" onclick="cv_pagingConfig.goLastPage()"><i class="entypo-right-open"></i></a></li>';
	div_paginate_html += '		</ul>';
	
	$("#div_paginate").html(div_paginate_html);
}

function pagenationHtmlSystemPup02(){
	
	var div_paginate_html = "";
	div_paginate_html += '		<ul class="pagination pagination-sm">';
	div_paginate_html += '			<li><a href="#none" onclick="cv_pagingConfig.goFirstPage()"><i class="entypo-left-open"></i></a></li>';
	div_paginate_html += '			<li><a href="#none" onclick="cv_pagingConfig.goPrevPage()"><i class="entypo-left-open-mini"></i></a></li>';
	var pageSliderLength = cv_pagingConfig.pageSlider.length;
	for (var i = 0; i < pageSliderLength; i++) {
		if (cv_pagingConfig.pageNo == cv_pagingConfig.pageSlider[i]) {
			div_paginate_html += '	<li class="active"><a href="#none">' + cv_pagingConfig.pageSlider[i] + '</a></li>';
		} else {
			div_paginate_html += '	<li><a href="#none" onclick="cv_pagingConfig.goPage(\'' + cv_pagingConfig.pageSlider[i] + '\')">' + cv_pagingConfig.pageSlider[i] + '</a></li>';
		}
	}
	div_paginate_html += '			<li><a href="#none" onclick="cv_pagingConfig.goNextPage()"><i class="entypo-right-open-mini"></i></a></li>';
	div_paginate_html += '			<li><a href="#none" onclick="cv_pagingConfig.goLastPage()"><i class="entypo-right-open"></i></a></li>';
	div_paginate_html += '		</ul>';
	
	$("#div_paginate_pup02").html(div_paginate_html);
}

function cf_logout(){
	if(!confirm("로그아웃 하시겠습니까?")) return;
	
	cf_movePage("/login/logout");
}


function cf_movePage(url, params) {
	
	if(!url.startsWith("/login") 
			&& !url.startsWith("/error")
			&& !url.startsWith("/sample")
			&& !url.startsWith("/temp") ) {
	
		var authtargetmenu = auth_menulist.getElementFirst("menuUrl", url);
		if(!cf_isEmpty(authtargetmenu)){
			if("N" === authtargetmenu.useYn){
				alert("해당메뉴는 접근권한이 없습니다.");
				return;
			}
		}
	}
	
	var reqquery = "";
	if(!cf_isEmpty(params)){
		var paramskeys = Object.getOwnPropertyNames(params);
		for(var i=0; i<paramskeys.length; i++){
			if(!cf_isEmpty(params[paramskeys[i]])) {
				reqquery += "&" + paramskeys[i] + "=" + params[paramskeys[i]]; 
			}
		}
	}
	if(!cf_isEmpty(cv_logConfig.LOG_SVC_CD)){
		var logConfig = {
				LOG_SVC_CD : cv_logConfig.LOG_SVC_CD,
				LOG_SVC_LEVEL : cv_logConfig.LOG_SVC_LEVEL,
			}
		reqquery += "&logConfig=" + JSON.stringify(logConfig);
	}
	
	if(reqquery.length >= 1){
		reqquery = reqquery.substr(1);
		
		if(url.indexOf("?") == -1){
			url += "?" + reqquery;
		} else {
			url += "&" + reqquery;
		}
	}
	
	url = encodeURI(url);
	location.href = url;
}

function cf_excelDn(url, params, configExcelDn) {

	if (cf_isEmpty(configExcelDn)) {
		alert("엑셀다운 설정값이 존재하지 않습니다.");
		return;
	}
	
	if (cf_isEmpty(configExcelDn.fileName) || configExcelDn.fileName.trim() === "") {
		alert("엑셀파일명 'fileName'이 정의되지 않았습니다.");
		return;
	}

	if (cf_isEmpty(configExcelDn.sheetName) || configExcelDn.sheetName.trim() === "") {
		alert("엑셀 컬럼정보 'sheetName'이 정의되지 않았습니다.");
		return;
	}

	if (cf_isEmpty(configExcelDn.columnsInfo)) {
		alert("엑셀 컬럼정보 'columnsInfo'가 정의되지 않았습니다.");
		return;
	}

	var form = document.createElement("form");
	form.setAttribute("accept-charset", "UTF-8");
	form.setAttribute("method", "Post");
	form.setAttribute("action", url);

	var hiddenField_configExcelDn = document.createElement("input");
	hiddenField_configExcelDn.setAttribute("type", "hidden");
	hiddenField_configExcelDn.setAttribute("name", "configExcelDn");
	hiddenField_configExcelDn.setAttribute("value", encodeURI(JSON.stringify(configExcelDn), "UTF-8"));
	form.appendChild(hiddenField_configExcelDn);

	var hiddenField_params = document.createElement("input");
	hiddenField_params.setAttribute("type", "hidden");
	hiddenField_params.setAttribute("name", "params");
	hiddenField_params.setAttribute("value", encodeURI(JSON.stringify(params), "UTF-8"));
	form.appendChild(hiddenField_params);
		
	if(!cf_isEmpty(cv_logConfig.LOG_SVC_CD)){
		var logConfig = {
			LOG_SVC_CD : cv_logConfig.LOG_SVC_CD,
			LOG_SVC_LEVEL : cv_logConfig.LOG_SVC_LEVEL,
		}
		
		var hiddenField_logConfig = document.createElement("input");
		hiddenField_logConfig.setAttribute("type", "hidden");
		hiddenField_logConfig.setAttribute("name", "logConfig");
		hiddenField_logConfig.setAttribute("value", encodeURI(JSON.stringify(logConfig)));
		form.appendChild(hiddenField_logConfig);
	}

	document.body.appendChild(form);
	form.submit();
	form.remove();
}


var isloadingbar = true;

/**
 * ajax 통신함수
 * 
 * @param url
 * @param params
 * @param arg1
 * @param arg2
 * @returns
 */
var rsltFailArr = ['error', 'user-error', 'FAIL', 'sys-error'];
function cf_ajax(url, params, arg1, arg2) {
	
	var callback_func;
	let headers;
	
	if(arg1 === undefined && arg2 === undefined){
		callback_func = null;
		headers = {
				'Content-Type': 'application/json;charset=UTF-8',
				"Access-Control-Allow-Origin": "*",
			}
	} else if(arg2 === undefined){
		headers = {
				'Content-Type': 'application/json;charset=UTF-8',
				"Access-Control-Allow-Origin": "*",
			}
		callback_func = arg1;
	} else {
		headers = arg1;
		callback_func = arg2;
	}
	
	var arguments = {};
	
	headers.callfunc = "cf_ajax";
	
	var options = {
			headers: headers,
		}
	
	if(params == null) {
		arguments.params = {}
	} else {
		arguments.params = params;
	}
	
	if(!cf_isEmpty(cv_pagingConfig.func)){
		arguments.pagingConfig = {
			pageNo : cv_pagingConfig.pageNo,
			orders : cv_pagingConfig.orders,
			limit : cv_pagingConfig.limit,
		};
	}

	if(!cf_isEmpty(cv_logConfig.LOG_SVC_CD)){
		arguments.logConfig = {
			LOG_SVC_CD : cv_logConfig.LOG_SVC_CD,
			LOG_SVC_LEVEL : cv_logConfig.LOG_SVC_LEVEL,
		}
	}

	if (isloadingbar !== false) {
		cf_loadingbarShow();
	}

	axios.post(url, arguments, options)
		.then(function(response) {
			
			cf_loadingbarHide();
			cv_logConfig.init();
			
			if("gotomain" === response.data){
				location.href = "/";
				return;
			}
			
			if (rsltFailArr.includes(response.data.rsltStatus)) {
				if (response.data.rsltStatus == "user-error" && !cf_isEmpty(response.data.errMsg)) {
					alert(response.data.errMsg);
				} else {
					alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
				}
			} else {
				
				
				if (!cf_isEmpty(callback_func)) {
					if (cf_whatIsIt(response.data) === "string" && response.data.indexOf("<!DOCTYPE html>") != -1) {
						alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
					} else {
						if(!cf_isEmpty(cv_pagingConfig.func)){
							cv_pagingConfig.setInfo(response.data.pageInfo);
							cv_pagingConfig.func_back = cv_pagingConfig.func;
						}
						cv_pagingConfig.func = null;
						
						callback_func(response.data);
					}
				}
			}
		})
		.catch(function(error) {
			cv_pagingConfig.func = null;
			cf_loadingbarHide();
			console.log(error.message);
			if (error.message == "Network Error") {
				alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
			} else {
				alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
			}
			console.log(error);
		});
}

/**
 * 엑셀업로드 함수
 * @param url 호출url
 * @param elid 엑셀파일을 첨부하는 태그의 id
 * @param callback
 * @returns
 */
function cf_excelUp(url, configExcelUp, callback) {

	cf_loadingbarShow();

	var formData = new FormData();
	formData.append("excelFile", $("#" + configExcelUp.elId)[0].files[0]);

	var options = {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	};
	
	if(!cf_isEmpty(cv_logConfig.LOG_SVC_CD)){
		var logConfig = {
			LOG_SVC_CD : cv_logConfig.LOG_SVC_CD,
			LOG_SVC_LEVEL : cv_logConfig.LOG_SVC_LEVEL,
		}
		formData.append("logConfig", JSON.stringify(logConfig));	
	}

	axios.post(url, formData, options)
		.then(function(response) {
			
			cf_loadingbarHide();
			cv_logConfig.init();
			
			if (rsltFailArr.includes(response.data.rsltStatus)) {
				if (response.data.rsltStatus == "user-error" && !cf_isEmpty(response.data.errMsg)) {
					alert(response.data.errMsg);
				} else {
					alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
				}
			} else {
				if (callback != null) {
					if (cf_whatIsIt(response.data) === "string" && response.data.indexOf("<!DOCTYPE html>") != -1) {
						alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
					} else {
						callback(response.data);
					}
				}
			}
		})
		.catch(function(error) {
			cf_loadingbarHide();
			if (error.message == "Network Error") {
				alert("네트워크상태 또는 서버 구동상태를 확인해 주세요.");
			} else {
				alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
			}
			console.log(error);
		});

}

/**
 * 파일 업로드 함수
 * 
 * @param filesArr
 * @param param
 * @param callback
 * @returns
 */
function cf_ajaxWithFiles(url, fileList, params, callback_func) {
	
	cf_loadingbarShow();
	
	var options = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};

	var formData = new FormData();
	for (var i = 0; i < fileList.length; i++) {
		formData.append("fileList", fileList[i]);
	}
	
	if(cf_isEmpty(params)){
		params = {};
	}
	formData.append("params", JSON.stringify(params));
		
	if(!cf_isEmpty(cv_logConfig.LOG_SVC_CD)){
		var logConfig = {
			LOG_SVC_CD : cv_logConfig.LOG_SVC_CD,
			LOG_SVC_LEVEL : cv_logConfig.LOG_SVC_LEVEL,
		}
		formData.append("logConfig", JSON.stringify(logConfig));	
	}

	axios.post(url, formData, options)
		.then(function(response) {
			
			cf_loadingbarHide();
			cv_logConfig.init();
			
			if (rsltFailArr.includes(response.data.rsltStatus)) {
				if (response.data.rsltStatus == "user-error" && !cf_isEmpty(response.data.errMsg)) {
					alert(response.data.errMsg);
				} else {
					alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
				}
			} else {
				if (callback_func != null) {
					if (cf_whatIsIt(response.data) === "string" && response.data.indexOf("<!DOCTYPE html>") != -1) {
						alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
					} else {
						callback_func(response.data);
					}
				}
			}
		})
		.catch(function(error) {
			cf_loadingbarHide();
			if (error.message == "Network Error") {
				alert("네트워크상태 또는 서버 구동상태를 확인해 주세요.");
			} else {
				alert("처리중 오류가 발생했습니다. \n관리자에게 문의하세요.");
			}
			console.log(error);
		});
}

/**
 * 해당 파라메타가 비어있는지 확인
 * 
 * @param obj
 * @returns
 */
function cf_isEmpty(obj) {
	var objtyp = cf_whatIsIt(obj);
	if (objtyp == "null") return true;
	else if (objtyp == "undefined") return true;
	else if (objtyp == "string" && obj.trim() == "") return true;
	else if (objtyp == "object" && obj == {}) return true;
	return false;
}

function cf_defaultIfEmpty(obj, defaultVal){
	return cf_isEmpty(obj) ? defaultVal : obj;
}

/**
 * 해당객체의 타입명을 반환해주는 함수
 * 
 * @param obj
 * @returns
 */
function cf_whatIsIt(obj) {
	var arrayConstructor = [].constructor;
	var objectConstructor = {}.constructor;

	if (obj === null) {
		return "null";
	} else if (obj === undefined) {
		return "undefined";
	} else if (typeof obj === "string") {
		return "string";
	} else if (typeof obj === "number") {
		return "number";
	} else if (typeof obj === "function") {
		return "function";
	} else if (obj.constructor === arrayConstructor) {
		return "array";
	} else if (obj.constructor === objectConstructor) {
		return "object";
	} else if (obj.constructor === File) {
		return "file";
	} else {
		return "nothing";
	}
}

function cf_loadingbarShow() {
	var backHeight = $(document).height();
	var backGroundCover = "";
	
	if(!$("#back").length){
		backGroundCover += "<div id='back'>";
		backGroundCover += "	<img class='loadingImg' src='/static_resources/img/common/loading.gif' alt='로딩바 이미지' style='width: 50px; height: 50px;'>";
		backGroundCover += "</div>";
		$('body').append(backGroundCover);
	}
	$('#back').css({ width: '100%', height: backHeight, background: '#0000007a', position : 'absolute', top: '0px', 'z-index': '99999999999999999999' });
	$('.loadingImg').css({ left: '50%', top: '50%', position : 'absolute',transform: 'translate(-50%, -50%)' });
	$('#back').show();
}

function cf_loadingbarHide() {
	$('#back').hide();
}

/**
 * 
 * 32자리의 랜덤한 uuid 를 생성하는 javascript 함수
 * 예) b9e2e10b6aa2132779b9786d55e2b223
 * 
 * @returns
 */
function cf_genUUID(){
	return cf_genrandom()+cf_genrandom()+cf_genrandom()+cf_genrandom()+cf_genrandom()+cf_genrandom()+cf_genrandom()+cf_genrandom();
}


/**
 * 4자리의 랜덤한 영어및 숫자의 값을 생성한다.
 * 예) fbb1
 * @returns
 */
function cf_genrandom(){
	return ((1+Math.random()) * 0x10000 | 0).toString(16).substring(1);
}

function cf_isFileEmpty(id) {
	if ($("#" + id).length === 0 || $("#" + id)[0].files.length === 0) {
		return true;
	} else {
		return false;
	}
}

function cf_orgFileNm2Text(target_id, stor_file_nm){
	var params = {
		stor_file_nm: stor_file_nm,
	}
	cf_ajax("/getFileOrgNm", params, function(data) { $("#" + target_id).text(data.org_file_nm); });
}

function cf_fileDn(stor_file_nm) {
	var params = {
		stor_file_nm: stor_file_nm,
	}
	cf_ajax("/common/chkFileExist", params, function(data) {
			if (!data.isFileExist) {
				alert("파일이 존재하지 않습니다.");
				return;
			}
			cf_movePage("/common/fileDn?p=" + stor_file_nm);
		});
}

function cf_onlyNum(obj) {
	obj.value = obj.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
}

function cf_onlyNumFormat(obj) {
	var tmp = obj.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
	if (tmp === "") {
		obj.value = tmp;
	} else {
		obj.value = Number(tmp).numformat();
	}
}

function cf_setSortConf(obj, defaultSortTarget){
		
	var sortflag = 1;
	if($(obj).hasClass("sorting_desc")){
		sortflag = 2;
	} else if($(obj).hasClass("sorting_asc")){
		sortflag = 3;
	}
	
	$(obj).siblings().removeClass("sorting");
	$(obj).siblings().removeClass("sorting_asc");
	$(obj).siblings().removeClass("sorting_desc");
	$(obj).siblings().addClass("sorting");
	$(".nosort").removeClass("sorting");
	
	$(obj).removeClass("sorting");
	$(obj).removeClass("sorting_asc");
	$(obj).removeClass("sorting_desc");
	
	var temporder = {};
	if(sortflag == 1){
		$(obj).addClass("sorting_desc");
		temporder.target = $(obj).attr("sort_target");
		temporder.isAsc = false;
	} else if(sortflag == 2){
		$(obj).addClass("sorting_asc");
		temporder.target = $(obj).attr("sort_target");
		temporder.isAsc = true;
	} else {
		$(obj).addClass("sorting");
		temporder.target = defaultSortTarget;
		temporder.isAsc = false;
	}
	cv_pagingConfig.orders = [];
	cv_pagingConfig.orders.push(temporder);
	cv_pagingConfig.pageNo = 1;
}