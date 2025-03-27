// app/page.tsx
'use client'; // Vereist voor interactieve elementen en hooks

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const servicesRef = useRef<HTMLElement>(null);

  // Voorbeeld data - vervang dit door echte data fetching (API, CMS, etc.)
  const servicesData = [
    {
      title: "Service 1",
      description: "Beschrijving van service 1"
    },
    {
      title: "Service 2",
      description: "Beschrijving van service 2"
    },
    {
      title: "Service 3",
      description: "Beschrijving van service 3"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
      }
    };
  }, []);

  return (
    <main className="front-page">
      {/* Full Screen Hero Section */}
      <section className="fullscreen-hero">
        <div className="mission-statement">
          <h1 className="text-5xl font-bold mb-6 text-white">Helping you integrate AI with clarity & confidence</h1>
            <p className="text-lg text-gray-300">
            AI and data reshape our world at a relentless speed, yet most find themselves caught between possibility and complexity. We are here to help you identify what truly gives that competitive advantage.</p>
          
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="services-section">
        <div className="section-inner">
          <h2>Onze Diensten</h2>
          <div className="service-grid">
            {servicesData.map((service, index) => (
              <div key={index} className="service-card">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}