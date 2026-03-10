// src/App.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCurrentTime, registerUser } from "../services/sampleService";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

import { Autoplay, Pagination } from 'swiper/modules';

function Home() {
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const slides = [
    { id: 1, src: '/img/slide1.jpg', alt: 'Slide 1' },
    { id: 2, src: '/img/slide2.jpg', alt: 'Slide 2' },
    { id: 3, src: '/img/slide3.jpg', alt: 'Slide 3' },
  ];

  useEffect(() => {
    const fetchTime = () => {
      fetchCurrentTime()
        .then(response => setCurrentTime(response.data))
        .catch(error => console.error('API 호출 중 오류 발생:', error));
    };

    fetchTime();
    const intervalId = setInterval(fetchTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRegister = async () => {
    const data = { name, email, age: parseInt(age) };

    try {
      const res = await registerUser(data);
      alert("등록 성공: " + res.data.message);
    } catch (err) {
      alert("등록 실패");
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h2>GSITM 부트캠프 입소를 환영합니다.</h2>

      <h3>서버에 데이터보내기</h3>
      <input placeholder="이름" value={name} onChange={e => setName(e.target.value)} />
      <br />
      <input placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} />
      <br />
      <input placeholder="나이" type="number" value={age} onChange={e => setAge(e.target.value)} />
      <br />
      <button onClick={handleRegister}>전송</button>

      <br /><br />

      <img src="/img/lion.jpg" alt="라이언 이미지" style={{ width: '50px', height: 'auto' }} />
      <h1>현재 시간</h1>
      <p>{currentTime}</p>
      <br /><br />
      <button onClick={() => navigate('/about')}>About 페이지로 이동</button>

      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        style={{ height: '300px', width: '100%' }}
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>

      <br />

      <Swiper pagination={true} modules={[Pagination]} className="mySwiper" style={{ height: '300px' }}>
        {slides.map(({ id, src, alt }) => (
          <SwiperSlide key={id}>
            <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function SampleApp() {
  // // 여기 handleLogin 함수 정의 (로그인 시도 처리)
  // const handleLogin = ({ email, password }) => {
  //   console.log("로그인 시도:", email, password);
  // };

  return <Home></Home>;
}

export default SampleApp;
