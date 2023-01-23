import Link from "next/link";
import React, { useEffect, useState } from "react";
import NavItem from "./navitem";
import { useSession, signOut } from 'next-auth/react';
import styles from '../styles/navbar.module.css';

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "About Us", href: "/about" },
  { text: "Contact", href: "/contact" },
];
const Navbar = () => {
  const { data } = useSession();
  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [showLogout, setShowLogout] = useState(data !== null && data?.status === 'authenticated');

  useEffect(() => {
    console.log(data?.status === 'authenticated')
    setShowLogout(data !== null && data?.status === 'authenticated');
    console.log(showLogout)
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
          {MENU_LIST.map((menu, idx) => (
            <div
              onClick={() => {
                setActiveIdx(idx);
                setNavActive(false);
              }}
              key={menu.text}
            >
              <NavItem active={activeIdx === idx} {...menu} />
            </div>
          ))}
         {showLogout ? <div
              onClick={() => {
                signOut({ callbackUrl: '/login' });
              }}
              key="Sign out"
            ><button className={styles.nav__link}>Sign out</button></div> : null}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;