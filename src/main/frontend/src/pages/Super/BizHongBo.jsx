// 페이지찾기 - 회사홍보
import styles from "../../styles/superDetails.module.css"
import React from "react";
import {useNavigate} from "react-router-dom";

export default function BizHongBo() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <section className={styles.imgCont}>
                <div>
                    <img
                        src={process.env.PUBLIC_URL + '/img/loginBg.png'}
                        alt="bg"
                    />
                    <button
                        type="button"
                        className="start-btn"
                        onClick={() => {
                            navigate('/welcome/tenantJoin');
                        }}
                        style={{
                            position:"absolute",
                            left:"56px",
                            bottom: "10px"
                        }}
                    >
                        시작하기
                    </button>
                </div>
                <div>
                    {/*<img*/}
                    {/*    src={process.env.PUBLIC_URL + '/img/bgDetail.png'}*/}
                    {/*    alt="bgDetail"*/}
                    {/*/>*/}
                </div>
            </section>
            <h2>복잡한 교육 운영, 이제 한 플랫폼에서 관리하세요</h2>
            <div className={styles.detailContainer}>
            <section className={styles.detailBox}>
                <h2 style={{color: "var(--font-color-red1)"}}>All-in-one</h2>
                <h3>"권한별로 연결된 통합 학습 플랫폼"</h3>
                <p>
                    <span noborder={"no"}>설문과 면담, 피드백으로 학습자의 상태를 이해하고,</span>
                    <span noborder={"no"}>일정과 과정을 유기적으로 조율합니다.</span>
                </p>
            </section>
            <section className={styles.detailBox}>
                <h2 style={{color: "var(--font-color-blue2)"}}>대시보드 분리 구조</h2>
                <h3>"권한 기반으로 설계된 맞춤형 대시보드"</h3>
                <p>
                    <span noborder={"no"}>관리자는 전체 운영 현황을, 강사는 강의와 피드백을,</span>
                    <span noborder={"no"}>수강생은 학습 진도와 출석을 한눈에 확인합니다.</span>
                </p>
            </section>
            <section className={styles.detailBox}>
                <h2 >교육 + 홍보 + 브랜드 구축</h2>
                <h3>"교육은 내부에서, 홍보는 자연스럽게 외부로"</h3>
                <p>
                    <span noborder={"no"}>방문객은 공개 콘텐츠를 통해 교육과정의 전문성을 확인하고</span>
                    <span noborder={"no"}>그 경험이 새로운 참여로 이어집니다.</span>
                </p>
            </section>
            </div>
            <section style={{height:'10rem', width:'100%', display: "flex", justifyContent: "center", alignItems: "flex-start"}}>
                <p style={{fontSize: "2rem", marginBottom: "2rem"}}><span style={{fontWeight:"bold", color:"var(--font-color-red1)"}} noborder={"no"}>LERMES</span>는 학습의 결과가 곧 브랜드가 되는 순간을 만듭니다.</p>
            </section>
        </div>
    )
}