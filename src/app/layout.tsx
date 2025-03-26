import './globals.css'
import Header from '@/components/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="pt-[70px] min-h-screen"> {/* Add padding-top equal to header height */}
          {children}
        </main>
      </body>
    </html>
  )
}