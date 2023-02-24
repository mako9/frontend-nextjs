import Link from "next/link";
import React, { useEffect, useState } from "react";
import NavItem from "./navItem";
import { useSession, signOut } from 'next-auth/react';
import styles from '../styles/nav.module.css';
import { useTranslation } from 'next-i18next';
import { useStateValue } from "./context";

const NavBar = () => {
  const { t } = useTranslation('common');
  const { data } = useSession();
  const [navActive, setNavActive] = useState(false);
  const { state, setState } = useStateValue();
  const [isLoggedIn, setIsLoggedIn] = useState(data !== null && data?.status === 'authenticated');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  var menuList = [
    { text: t('navBar.home'), href: "/" },
    { text: t('navBar.about'), href: "/about" },
    { text: t('navBar.contact'), href: "/contact" },
  ];
  if (isLoggedIn) menuList.push({ text: t('navBar.myArea'), href: "/my-area" })

  useEffect(() => {
    console.log(data?.status === 'authenticated')
    setIsLoggedIn(data !== null && data?.status === 'authenticated');
    console.log(isLoggedIn)
  }, [data]);

  return (
    <header className={styles.nav_header}>
      <nav className={styles.nav}>
        <div className={styles.nav_list}>
            <Link className={`${navActive ? styles.nav_element_hide : ''}`} href={"/"}>
                <img className={styles.nav_img} src="/images/quokka_logo.png" />
            </Link>
            <Link className={styles.nav_title} href={"/"}>
                <h1 className="logo">ComShare</h1>
            </Link>
        </div>
        <div className={styles.nav_list}>
        <div className={`${styles.nav_menu_list} ${navActive ? styles.nav_menu_list_show : ''}`}>
          {menuList.map((menu, idx) => (
            <div
              onClick={() => {
                state.selectedNavbarIndex = idx;
                setState(state);
                setNavActive(false);
              }}
              key={menu.text}
            >
              <NavItem active={state?.selectedNavbarIndex === idx} {...menu} />
            </div>
          ))}
          </div>
          <div
          onClick={() => setNavActive(!navActive)}
          className={styles.nav_menu_bar}
        >
          <img className={styles.nav_img} src="/icons/hamburger_menu.svg" />
        </div>
         {isLoggedIn ?
         <div
            className={`${styles.dropdown_button} ${navActive ? styles.nav_element_hide : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img className={styles.nav_img} src="/icons/user_profile.svg" />
            {isMenuOpen && (
            <div className={styles.dropdown_container}>
              <div className={styles.dropdown_menu}>
                <li>
                  <Link href="/settings">
                    Settings
                  </Link>
                </li>
                <li onClick={() => { signOut({ callbackUrl: '/login' }) }} key="Sign out">{t('navBar.signout')}</li>
              </div>
            </div>
          )}
          </div> : null}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;