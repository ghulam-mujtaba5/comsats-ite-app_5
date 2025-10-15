import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CampusAxis - COMSATS Student Portal',
    short_name: 'CampusAxis',
    description: 'Academic resources, past papers, GPA calculator, and community for COMSATS students',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e40af',
    icons: [
      {
        src: '/Campus Axis 1.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ]
  }
}
