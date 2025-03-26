import { notFound } from 'next/navigation'

interface PageProps {
  params: { slug: string }
}

export default function BlogPostPage({ params }: PageProps) {
  // Test with hardcoded slugs first
  const validSlugs = ['post-1', 'post-2']
  
  if (!validSlugs.includes(params.slug)) {
    notFound()
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">
        Post: {params.slug}
      </h1>
      <p className="mt-4">
        Basic content for {params.slug}
      </p>
    </main>
  )
}