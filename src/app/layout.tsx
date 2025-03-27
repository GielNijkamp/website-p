// src/app/layout.tsx
import './globals.css'
import Header from '@/components/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-primary text-text">
        <Header />
        <main className="min-h-[calc(100vh-var(--header-height))] pt-[var(--header-height)]">
          {children}
        </main>
      </body>
    </html>
  )
}