// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from '../styles/Header.module.css'

interface NavLink {
  name: string
  path: string
}

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  const links: NavLink[] = [
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
      document.documentElement.style.setProperty(
        '--header-current-height', 
        window.scrollY > 10 ? 'var(--header-height-scrolled)' : 'var(--header-height)'
      )
    }
    
    // Initialize on mount
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      style={{
        height: 'var(--header-current-height, var(--header-height))'
      }}
    >
      <div className={styles['header-container']}>
        <nav className={styles['nav-menu']} aria-label="Main navigation">
          <ul role="list">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`${styles['nav-link']} ${
                    pathname === link.path ? styles.active : ''
                  }`}
                  aria-current={pathname === link.path ? 'page' : undefined}
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