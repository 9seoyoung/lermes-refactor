import React from 'react'
import styles from "./docs.module.css";
import { Outlet } from 'react-router-dom';

function DocumentPage() {
  return (
    <>
      <section className={styles.navi}>
        경로 뜰 자리
      </section>
      <section className={styles.contentWrapper}>
        <div>여백</div> 
        <div className={styles.cont}>
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default DocumentPage