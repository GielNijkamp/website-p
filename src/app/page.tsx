// src/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <nav className="mt-4">
        <Link href="/blog" className="text-blue-600 hover:underline">
          View Blog
        </Link>
      </nav>
    </main>
  )
}