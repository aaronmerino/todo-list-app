'use client'

import styles from './navbar-styles.module.css'
import Link from 'next/link'

export function NavBar() { 


  return (
    <nav className={styles.navbar}>
      <ul>
        <li><Link href="/home">home</Link></li>
        <li><Link href="/account">account</Link></li>
      </ul>
    </nav>
  );
}