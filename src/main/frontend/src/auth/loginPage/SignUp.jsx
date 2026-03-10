import styles from '../../styles/SignUp.module.css';
import icon from '../../webapp/img/penIcon.png';
import bg from '../../webapp/img/loginBg.png';

function signUp() {
  return (
    <>
      <div className={styles.section}>
        {/* 왼쪽 영역 */}
        <img className={styles.left_section}
             src={bg}
             alt="icon"
        >
          <h1 style={{ marginTop: '90px' }}></h1>
          <h1></h1>
          <p className={styles.subText}>

          </p>
          <button className={styles.startBtn}>시작하기</button>
        </img>
        {/* 오른쪽 영역 */}
        <div>
          <div className={styles.form}>
            <h2 className={styles.signUpText}>회원가입</h2>
            <div className={styles.logo}>
              <div className={styles.logoImg}>
                <span>LOGO</span>
                <button className={styles.logoAdd}>
                  <img
                    src={icon}
                    alt="icon"
                    style={{ width: '16px', height: '16px' }}
                  />
                </button>
              </div>
              <span className={styles.imgCaption}>
                *이미지 크기 180px X 60px
              </span>
            </div>
            <input
              className={styles.input}
              placeholder="이름을 입력하세요. (국문 표기)"
            />
            <div className={styles.emailWrapper}>
              <input
                className={styles.input}
                placeholder="이메일을 입력하세요. ex) abc123@example.com"
              />
              <button className={styles.verifyBtn}>인증</button>
            </div>
            <input
              className={styles.input}
              placeholder="인증 번호를 입력하세요."
            />
            <input className={styles.input} placeholder="비밀번호 입력" />
            <input className={styles.input} placeholder="비밀번호 확인" />
            <hr />
            <input
              className={styles.input}
              placeholder="상호명을 입력하세요. (국문 표기)"
            />
            <input
              className={styles.input}
              placeholder="사업자 번호를 입력하세요. xxx-xx-xxxxx"
            />
            <button className={styles.signUpBtn}>회원 가입</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default signUp;
