// Authentication utilities and types
// Note: The primary User type and AuthState are now managed within AuthContext.

export const validateCUIEmail = (email: string): boolean => {
  // Enforce full university email format like: fa22-bse-105@cuilahore.edu.pk
  // pattern: <term><yy>-<program>-<roll>
  // - term: 2+ letters (e.g., fa, sp, su)
  // - yy: two digits
  // - program: 2-5 letters (e.g., bse, bscs, bba)
  // - roll: three digits
  const strict = /^[a-zA-Z]{2}\d{2}-[a-zA-Z]{2,5}-\d{3}@cuilahore\.edu\.pk$/
  return strict.test(email)
}

// Validate a COMSATS registration number like: fa22-bse-105
export const validateCUIRegistration = (reg: string): boolean => {
  const strict = /^[a-zA-Z]{2}\d{2}-[a-zA-Z]{2,5}-\d{3}$/
  return strict.test(reg)
}

// Convert a registration number (fa22-bse-105) into the institutional email
export const regNoToEmail = (reg: string): string | null => {
  if (!validateCUIRegistration(reg)) return null
  return `${reg.toLowerCase()}@cuilahore.edu.pk`
}
