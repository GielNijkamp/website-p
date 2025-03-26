export async function fetchData(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Fout bij ophalen van data');
  }
  return res.json();
}
