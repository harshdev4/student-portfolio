import React, { useEffect } from 'react'
import styles from './Loader.module.css'

const Loader = () => {

    useEffect(()=>{
        document.body.classList.add(`${styles.noScroll}`);
        return () => {
            document.body.classList.remove(`${styles.noScroll}`);
        }
    })

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  )
}

export default Loader
