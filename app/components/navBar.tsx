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
  const [navActive, setNavActive] = useState(null);
  const { state, setState } = useStateValue();
  const [isLoggedIn, setIsLoggedIn] = useState(data !== null && data?.status === 'authenticated');

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
    <header className={styles.nav__header}>
      <nav className={styles.nav}>
        <div className={styles.nav__menu_list}>
            <Link href={"/"}>
                <img className={styles.nav__img} src="/images/quokka_logo.png" />
            </Link>
            <Link href={"/"}>
                <h1 className="logo">ComShare</h1>
            </Link>
        </div>
        <div
          onClick={() => setNavActive(!navActive)}
          className={styles.nav__menu_bar}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.nav__menu_list}>
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
         {isLoggedIn ? <div
              onClick={() => {
                signOut({ callbackUrl: '/login' });
              }}
              key="Sign out"
            ><button className={styles.nav__link}>{t('navBar.signout')}</button></div> : null}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;