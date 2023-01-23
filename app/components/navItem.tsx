import Link from "next/link";
import styles from '../styles/nav.module.css';

const NavItem = ({ text, href, active }) => {
  return (
    <Link href={href}
        className={`${styles.nav__link} ${active ? styles.nav__link_active : ''}`}
      >
        {text}
    </Link>
  );
};

export default NavItem;