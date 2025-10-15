import { validateCUIEmail, validateEmailDomainForCampus, getCampusFromEmail } from '../lib/auth';

describe('Campus Email Validation', () => {
  describe('validateCUIEmail', () => {
    it('should validate correct COMSATS email formats', () => {
      expect(validateCUIEmail('fa22-bse-105@cuilahore.edu.pk')).toBe(true);
      expect(validateCUIEmail('sp21-mcs-001@cuislamabad.edu.pk')).toBe(true);
      expect(validateCUIEmail('fa20-bba-050@cuiabbottabad.edu.pk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateCUIEmail('user@gmail.com')).toBe(false);
      expect(validateCUIEmail('fa22-bse-105@gmail.com')).toBe(false);
      expect(validateCUIEmail('fa22-bcs-105@cuilahore.edu.pk')).toBe(true); // This should be true as bcs is valid
      expect(validateCUIEmail('invalid@cuilahore.edu.pk')).toBe(false);
      expect(validateCUIEmail('fa22-bse-105@nonexistent.edu.pk')).toBe(false);
    });
  });

  describe('validateEmailDomainForCampus', () => {
    it('should validate email domain matches campus code', () => {
      expect(validateEmailDomainForCampus('fa22-bse-105@cuilahore.edu.pk', 'LHR')).toBe(true);
      expect(validateEmailDomainForCampus('sp21-mcs-001@cuislamabad.edu.pk', 'ISB')).toBe(true);
      expect(validateEmailDomainForCampus('fa20-bba-050@cuiabbottabad.edu.pk', 'ABD')).toBe(true);
    });

    it('should reject when email domain does not match campus code', () => {
      expect(validateEmailDomainForCampus('fa22-bse-105@cuilahore.edu.pk', 'ISB')).toBe(false);
      expect(validateEmailDomainForCampus('sp21-mcs-001@cuislamabad.edu.pk', 'LHR')).toBe(false);
    });

    it('should handle invalid inputs', () => {
      expect(validateEmailDomainForCampus('', 'LHR')).toBe(false);
      expect(validateEmailDomainForCampus('fa22-bse-105@cuilahore.edu.pk', '')).toBe(false);
      expect(validateEmailDomainForCampus('invalid-email', 'LHR')).toBe(false);
    });
  });

  describe('getCampusFromEmail', () => {
    it('should extract campus code from valid emails', () => {
      expect(getCampusFromEmail('fa22-bse-105@cuilahore.edu.pk')).toBe('LHR');
      expect(getCampusFromEmail('sp21-mcs-001@cuislamabad.edu.pk')).toBe('ISB');
      expect(getCampusFromEmail('fa20-bba-050@cuiabbottabad.edu.pk')).toBe('ABD');
    });

    it('should return null for invalid emails', () => {
      expect(getCampusFromEmail('user@gmail.com')).toBeNull();
      expect(getCampusFromEmail('invalid@nonexistent.edu.pk')).toBeNull();
      expect(getCampusFromEmail('')).toBeNull();
    });
  });
});