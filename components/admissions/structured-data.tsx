import Script from 'next/script'

export function AdmissionsStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": "COMSATS University Admission Guidance",
    "description": "Peer-to-peer admission guidance for COMSATS University students including mentoring, NTS preparation, merit calculation, and study resources",
    "provider": {
      "@type": "Organization",
      "name": "CampusAxis",
      "url": "https://campusaxis.site"
    },
    "occupationalCategory": "Education",
    "offers": {
      "@type": "Offer",
      "category": "EducationalOccupationalProgram",
      "price": 0,
      "priceCurrency": "PKR"
    },
    "programPrerequisites": "Intermediate education or equivalent",
    "educationalCredentialAwarded": "University Admission",
    "occupationalCredentialAwarded": "Educational Support Services"
  }

  return (
    <Script
      id="admissions-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}