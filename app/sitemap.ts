import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://summitclean.example', lastModified: new Date() },
    { url: 'https://summitclean.example/services', lastModified: new Date() },
    { url: 'https://summitclean.example/about', lastModified: new Date() },
    { url: 'https://summitclean.example/service-areas', lastModified: new Date() },
    { url: 'https://summitclean.example/contact', lastModified: new Date() },
    { url: 'https://summitclean.example/quote', lastModified: new Date() },
    { url: 'https://summitclean.example/privacy', lastModified: new Date() },
    { url: 'https://summitclean.example/terms', lastModified: new Date() },
  ]
}
