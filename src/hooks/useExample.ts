import { useState, useEffect } from 'react';

export default function useExample() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    // Voorbeeld: Simuleer data ophalen
    setTimeout(() => {
      setData("Hallo, wereld!");
    }, 1000);
  }, []);

  return data;
}
