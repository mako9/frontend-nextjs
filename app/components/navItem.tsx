import Link from "next/link";
import styles from '../styles/navbar.module.css';

const NavItem = ({ text, href, active }) => {
  return (
    <Link href={href}
        className={styles.nav__link}
      >
        {text}
    </Link>
  );
};

export default NavItem;