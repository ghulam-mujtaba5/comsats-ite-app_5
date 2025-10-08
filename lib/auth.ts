// Authentication utilities and types
// Note: The primary User type and AuthState are now managed within AuthContext.

// All COMSATS campus email domains
export const CAMPUS_DOMAINS = [
  'cuilahore.edu.pk',      // Lahore
  'cuislamabad.edu.pk',    // Islamabad
  'cuiabbottabad.edu.pk',  // Abbottabad
  'cuiattock.edu.pk',      // Attock
  'cuisahiwal.edu.pk',     // Sahiwal
  'cuivehari.edu.pk',      // Vehari
  'cuiwah.edu.pk',         // Wah
  'comsats.edu.pk',        // Virtual Campus
] as const

export type CampusDomain = typeof CAMPUS_DOMAINS[number]

// Map campus code to domain
export const CAMPUS_CODE_TO_DOMAIN: Record<string, CampusDomain> = {
  'LHR': 'cuilahore.edu.pk',
  'ISB': 'cuislamabad.edu.pk',
  'ABD': 'cuiabbottabad.edu.pk',
  'ATK': 'cuiattock.edu.pk',
  'SWL': 'cuisahiwal.edu.pk',
  'VEH': 'cuivehari.edu.pk',
  'WAH': 'cuiwah.edu.pk',
  'VRT': 'comsats.edu.pk',
}

// Map domain to campus code
export const DOMAIN_TO_CAMPUS_CODE: Record<string, string> = {
  'cuilahore.edu.pk': 'LHR',
  'cuislamabad.edu.pk': 'ISB',
  'cuiabbottabad.edu.pk': 'ABD',
  'cuiattock.edu.pk': 'ATK',
  'cuisahiwal.edu.pk': 'SWL',
  'cuivehari.edu.pk': 'VEH',
  'cuiwah.edu.pk': 'WAH',
  'comsats.edu.pk': 'VRT',
}

export const validateCUIEmail = (email: string): boolean => {
  // Enforce full university email format like: fa22-bse-105@cuilahore.edu.pk
  // pattern: <term><yy>-<program>-<roll>@<campus-domain>
  // - term: 2+ letters (e.g., fa, sp, su)
  // - yy: two digits
  // - program: 2-5 letters (e.g., bse, bscs, bba)
  // - roll: three digits
  // - campus-domain: any valid COMSATS campus domain
  
  // Check if email matches the pattern with any campus domain
  const domainPattern = CAMPUS_DOMAINS.map(d => d.replace(/\./g, '\\.')).join('|')
  const strict = new RegExp(`^[a-zA-Z]{2}\\d{2}-[a-zA-Z]{2,5}-\\d{3}@(${domainPattern})$`)
  return strict.test(email)
}

// Validate a registration number like fa22-bse-105
export const validateCUIRegistration = (regNo: string): boolean => {
  const strict = /^[a-zA-Z]{2}\d{2}-[a-zA-Z]{2,5}-\d{3}$/
  return strict.test(regNo)
}

// Extract campus code from email
export const getCampusFromEmail = (email: string): string | null => {
  if (!validateCUIEmail(email)) return null
  const domain = email.split('@')[1]
  return DOMAIN_TO_CAMPUS_CODE[domain] || null
}

// Convert registration number to institutional email (campus-specific)
export const regNoToEmail = (regNo: string, campusCode: string = 'LHR'): string | null => {
  if (!validateCUIRegistration(regNo)) return null
  const domain = CAMPUS_CODE_TO_DOMAIN[campusCode] || CAMPUS_CODE_TO_DOMAIN['LHR']
  return `${regNo.toLowerCase()}@${domain}`
}
