import React from 'react';

interface CardProps {
  title: string;
  content: string;
}

export default function Card({ title, content }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}
