document.addEventListener('DOMContentLoaded', function() {
    getLocation();
});

function getLocation() {

	console.log("위치 함수 호출");

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(sendLocationToServer, handleLocationError);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
	
}

function handleLocationError(error) {
	console.error('Location error: ' + error.message);
	alert('위치 정보 접근에 문제가 발생했습니다.');
}


function sendLocationToServer(position) {
    var latitude = position.coords.latitude;
	console.log("latitude = " + latitude);
	
    var longitude = position.coords.longitude;
	console.log("longitude = " + longitude);

	$.ajax({
		async: false, //값을 리턴시 해당코드를 추가하여 동기로 변경 false : 동기, true : 비동기
		url: '/ajax/getWeatherInfo',
		type: "GET",
		dataType: "Json", // 서버에서 보내주는 데이터를 어떤 타입으로 받을건지 EX) "json", "String" 
		data : {
			latitude: latitude,
			longitude: longitude,
		},
		headers: {
			"Accept-Language": "ko-KR", // 한글을 지원하는 언어 코드로 설정

			/** 헤더 추가 START */
			'Content-Type': 'application/json;charset=UTF-8',
			"Access-Control-Allow-Origin": "*",
			/** 헤더 추가 END */
		},
		
		success: function(response) {
			console.log("response : " + response);
			console.log("response.message : " + response.message);
			console.log("response.message.date : " + response.message.date);

// 문자열을 파싱하여 객체로 변환
var parts = response.message.slice(1, -1).split(", "); // 대괄호 제거 후 분리
var jsonObject = {};
for (var i = 0; i < parts.length; i++) {
    var keyValue = parts[i].split("=");
    // JSON 키와 값을 추가
    jsonObject[keyValue[0]] = keyValue[1];
}

// 객체를 JSON 문자열로 변환
var jsonString = JSON.stringify(jsonObject);

// 결과 출력
console.log(jsonString);

// JSON 문자열을 JavaScript 객체로 파싱
var jsonObject = JSON.parse(jsonString);
// 각 항목의 값을 가져와서 HTML에 표시
document.getElementById("dateElement").innerText = jsonObject.date;
document.getElementById("timeElement").innerText = jsonObject.time;
document.getElementById("weatherElement").innerText = jsonObject.weather;
document.getElementById("temperaturesElement").innerText = jsonObject.Temperatures;
document.getElementById("humidityElement").innerText = jsonObject.humidity;


		},
		
		error: function(xhr, status, error) {
			console.log("ajax 통신 실패");
			console.error("에러 발생:", xhr, status, error);
			console.log("서버 응답 상세:", xhr.responseText);
		},
		
		complete : function(response) {
			console.log("완료후 로직 실행되는 로직");
			
		},
		 // 추가: charset 옵션을 설정
		beforeSend: function(xhr) {
			xhr.overrideMimeType("text/plain; charset=utf-8");
		}
	});		    
}


