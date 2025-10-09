// Email domain to campus mapping for COMSATS universities
export const EMAIL_DOMAIN_TO_CAMPUS_CODE: Record<string, string> = {
  // Lahore Campus
  'cuilahore.edu.pk': 'LHR',
  
  // Islamabad Campus
  'comsats.edu.pk': 'ISB',
  
  // Abbottabad Campus
  'cuiatd.edu.pk': 'ATK',
  
  // Attock Campus
  'cuiatk.edu.pk': 'ATK2',
  
  // Sahiwal Campus
  'cuisahiwal.edu.pk': 'SWL',
  
  // Vehari Campus
  'cuivehari.edu.pk': 'VEH',
  
  // Wah Campus
  'wah.comsats.edu.pk': 'WAH',
  
  // Virtual Campus
  'virtual.comsats.edu.pk': 'VRT'
};

// Department code mapping from email prefixes
export const EMAIL_PREFIX_TO_DEPARTMENT_CODE: Record<string, string> = {
  // Computer Science
  'bse': 'CS',
  'bscs': 'CS',
  'mscs': 'CS',
  'phdcs': 'CS',
  
  // Software Engineering
  'bsse': 'SE',
  
  // Electrical Engineering
  'bsee': 'EE',
  'msee': 'EE',
  
  // Electronics Engineering
  'bsele': 'ELE',
  
  // Telecom Engineering
  'bste': 'TE',
  
  // Business Administration
  'bba': 'BBA',
  'mba': 'BBA',
  
  // Mathematics
  'bsmath': 'MATH',
  'msmath': 'MATH',
  
  // Physics
  'bsphy': 'PHY',
  'msphy': 'PHY',
  
  // Chemistry
  'bschem': 'CHEM',
  'mschem': 'CHEM',
  
  // Computer Engineering
  'bscpe': 'CPE',
  'mscpe': 'CPE',
  
  // Mechanical Engineering
  'bsme': 'ME',
  'msme': 'ME',
  
  // Civil Engineering
  'bsce': 'CE',
  'msce': 'CE',
  
  // Biotechnology
  'bsbt': 'BT',
  'msbt': 'BT',
  
  // Environmental Sciences
  'bsenv': 'ENV',
  'msenv': 'ENV',
  
  // Architecture
  'bsarch': 'ARCH',
  'msarch': 'ARCH',
  
  // Economics
  'bsecon': 'ECON',
  'msecon': 'ECON',
  
  // Pharmacy
  'pharmd': 'PHARM',
  'mspharm': 'PHARM',
  
  // Management Sciences
  'bsmgt': 'MGT',
  'msmgt': 'MGT',
  
  // Humanities
  'bshum': 'HUM',
  'mshum': 'HUM'
};

// Reverse mapping for campus codes to names
export const CAMPUS_CODE_TO_NAME: Record<string, string> = {
  'LHR': 'COMSATS Lahore',
  'ISB': 'COMSATS Islamabad',
  'ATK': 'COMSATS Abbottabad',
  'ATK2': 'COMSATS Attock',
  'SWL': 'COMSATS Sahiwal',
  'VEH': 'COMSATS Vehari',
  'WAH': 'COMSATS Wah',
  'VRT': 'COMSATS Virtual'
};