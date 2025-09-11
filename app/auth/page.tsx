// Server component wrapper for auth page to allow metadata export.
import AuthClient from "./auth-client"

export const metadata = {
  title: 'Student Login & Sign Up – COMSATS Portal Access',
  description: 'Sign in to CampusAxis to access COMSATS past papers, GPA calculators, fee challan guide, faculty reviews and student resources. Create a free account or log in securely.',
  alternates: { canonical: (process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site') + '/auth' },
  openGraph: {
    title: 'Student Login & Sign Up – COMSATS Portal Access',
    description: 'Log in to CampusAxis for COMSATS student tools: past papers, GPA calculators, fee challan assistance and more.',
    url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site') + '/auth',
  },
  twitter: {
    title: 'Student Login & Sign Up – COMSATS Portal Access',
    description: 'Access COMSATS student tools on CampusAxis. Secure login or create a free account.',
  }
}

export default function AuthPage() {
  return <AuthClient />
}
