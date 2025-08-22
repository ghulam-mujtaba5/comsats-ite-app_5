// Authentication utilities and types
// Note: The primary User type and AuthState are now managed within AuthContext.

export const validateCUIEmail = (email: string): boolean => {
  return email.endsWith("@cuilahore.edu.pk")
}
