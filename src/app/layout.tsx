// app/layout.tsx
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer'; // 👈 Als je een footer hebt
import NeuralScene from './three/NeuralCore';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* 1. Three.js Achtergrond - EERSTE in de body! */}
        <div className="fixed-background">
          <NeuralScene />
        </div>

        {/* 2. ALLE Content (header, main, footer) in een wrapper */}
        <div className="content-wrapper">
          <Header />
          
          <main className="main-content">
            {children}
          </main>

          <Footer /> {/* 👈 Voeg deze toe als je een footer hebt */}
        </div>
      </body>
    </html>
  )
}