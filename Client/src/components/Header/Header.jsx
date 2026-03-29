import React, { useRef } from 'react'
import styles from './Header.module.css'
import { IoPersonSharp, IoMenu, IoClose } from "react-icons/io5";
import { TbNewSection } from "react-icons/tb";
import { IoMdLogIn, IoMdLogOut, IoMdSearch } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import useLogoutQuery from '../../queries/logoutMutation.queries';
import { useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const slidingMenuRef = useRef(null);
  const {theme, toggleTheme} = useTheme();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    if (slidingMenuRef) {
      slidingMenuRef.current.classList.toggle(`${styles.slidingMenuOpen}`);
    }
  }

  const {mutate} = useLogoutQuery();

  const logout = () => {
    toggleMenu();
    mutate();
  }

  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.headerHeading} title='Student Portfolio'><Link to="/" className={styles.headerHeadingLink}>Student Portfolio</Link></h1>
      <nav className={`${styles.nav} ${styles.desktopHeader}`}>
        <ul className={styles.navUl}>
          <li className={styles.navLi} title='Profile'><Link to="/" className={`${styles.navLink}`}><IoPersonSharp /></Link></li>
          <li className={styles.navLi} title='Create Profile'><Link to="create-profile" className={`${styles.navLink}`}><TbNewSection /></Link></li>
          <li className={styles.navLi} title='Search'><Link to="search" className={`${styles.navLink}`}><IoMdSearch /></Link></li>
        </ul>
      </nav>
      <div className={`${styles.headerButtonContainer} ${styles.desktopHeader}`}>
        <button className={styles.headerButton} title='Toggle Theme' onClick={toggleTheme}>{theme === 'light' ? <MdDarkMode /> : <MdLightMode />}</button>
        {user?.userId ? <button className={styles.headerButton} title='Logout' onClick={()=> mutate()}><IoMdLogOut /></button> : <button className={styles.headerButton} title='Login' onClick={()=>navigate('/login')}><IoMdLogIn /></button>}
      </div>

      {/* mobile view */}
      <button className={`${styles.menuBar} ${styles.headerButton} ${styles.mobileHeader}`} onClick={toggleMenu}><IoMenu /></button>

      <div ref={slidingMenuRef} className={`${styles.slidingMenu} ${styles.mobileHeader}`}>
        <button className={`${styles.headerButtonMobile} ${styles.closeMenu}`} onClick={toggleMenu}><IoClose /></button>
        <nav className={`${styles.navMobile}`}>
          <ul className={styles.navUlMobile}>
            <li className={styles.navLiMobile} title='Profile'><Link to="/" className={`${styles.navLink}`} onClick={toggleMenu}><IoPersonSharp /> <span>Profile</span></Link></li>
            <li className={styles.navLiMobile} title='Create Profile'><Link to="create-profile" className={`${styles.navLink}`} onClick={toggleMenu}><TbNewSection /> <span>Create</span></Link></li>
            <li className={styles.navLiMobile} title='Search'><Link to="search" className={`${styles.navLink}`} onClick={toggleMenu}><IoMdSearch /> <span>Search</span></Link></li>
          </ul>
        </nav>
        <div className={`${styles.headerButtonContainerMobile}`}>
          <button className={styles.headerButtonMobile} title='Toggle Theme' onClick={toggleTheme}>{theme === 'light' ? <MdDarkMode /> : <MdLightMode />} <span>Theme</span></button>
          {user?.userId ? <button className={styles.headerButtonMobile} title='Logout' onClick={logout}><IoMdLogOut /> <span>Logout</span></button> : <button className={styles.headerButtonMobile} title='Login' onClick={()=>navigate('/login')}><IoMdLogIn /> <span>Login</span></button>}
        </div>
      </div>
    </header>
  )
}
export default Header;
