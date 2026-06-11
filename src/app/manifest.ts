import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mission Control',
    short_name: 'Mission Control',
    description: 'Exam Preparation Operating System for CDS, AFCAT, CAPF',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#3B82F6',
    icons: [
      {
        src: '/icons/192x192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/512x512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple touch icon',
      },
    ],
  };
}
