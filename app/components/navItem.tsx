import Link from 'next/link'
import styles from '../styles/nav.module.css'
import React from 'react'

const NavItem = ({ text, href, active }) => {
    return (
        <Link
            href={href}
            className={`${styles.nav_link} ${
                active ? styles.nav_link_active : ''
            }`}
        >
            {text}
        </Link>
    )
}

export default NavItem
