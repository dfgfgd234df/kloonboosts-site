import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kloonboosts - Premium Discord Server Upgrades',
    short_name: 'Kloonboosts',
    description: 'Enhance your Discord server with premium boosts, member growth solutions, and reaction services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f1e',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/logo.png',
        sizes: '456x485',
        type: 'image/png',
      },
    ],
  }
}
