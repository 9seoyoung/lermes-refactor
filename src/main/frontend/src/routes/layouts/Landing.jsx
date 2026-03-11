import SuperHeader from "../../components/ui/headerModule/SuperHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SearchBox } from "../../components/module/SearchBox";

function Landing() {
  return (
    <div style={{display: "grid", gridTemplateColumns: "100%", gridTemplateRows: "repeat(4, auto)", gap: "32px", width: "100%"}}>
      <header className="flex">
        <SuperHeader />
      </header>
      <form role="search" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <SearchBox></SearchBox>
      </form>

      <main>
        <section>
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            loop={true}
            speed={800}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            navigation
            pagination={{ clickable: true }}
            onSlideChange={(swiper) => console.log("현재 슬라이드:", swiper.realIndex)}
            onAutoplayStart={() => console.log("autoplay start")}
            onAutoplayStop={() => console.log("autoplay stop")}
          >
            <SwiperSlide>
              <div style={{ height: "300px" }}>배너 1</div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ height: "300px" }}>배너 2</div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ height: "300px" }}>배너 3</div>
            </SwiperSlide>
          </Swiper>
        </section>

        <section>
          <h2>활성 그룹</h2>
        </section>
        <section>
          <h2>신규 강좌</h2>
        </section>
        <section>
          <h2>강좌 top10</h2>
        </section>
      </main>

      <footer></footer>
    </div>
  );
}

export default Landing;