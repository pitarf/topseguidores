import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://viralizareels.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Proteção de área administrativa
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
