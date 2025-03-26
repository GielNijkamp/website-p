export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <header>
        <h1>Blog</h1>
      </header>
      {children}
    </section>
  );
}
