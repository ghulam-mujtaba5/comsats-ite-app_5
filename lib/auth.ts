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
