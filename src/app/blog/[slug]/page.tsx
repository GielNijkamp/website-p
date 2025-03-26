export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <article>
      <h2>Blog Post: {params.slug}</h2>
      <p>Content for the blog post.</p>
    </article>
  );
}
