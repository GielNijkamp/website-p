// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from '../styles/Header.module.css'

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Projects', path: '/projects' },
    { name: 'Newsletter', path: '/newsletter' },
    { name: 'Contact', path: '/contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles['header-container']}>
        <nav className={styles['nav-menu']}>
          <ul>
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`${pathname === link.path ? styles.active : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

// src/components/Header.tsx
export const HEADER_HEIGHT = 70;
export const HEADER_HEIGHT_SCROLLED = 60;

// Then in your layout:
<main className={`pt-[${HEADER_HEIGHT}px] min-h-screen`}></main>