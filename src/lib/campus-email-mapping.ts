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
  'bcs': 'CS',
  'bscs': 'CS',
  'mscs': 'CS',
  'phdcs': 'CS',
  
  // Software Engineering
  'bse': 'SE',
  'bsse': 'SE',
  'msse': 'SE',
  'phdse': 'SE',
  
  // Electrical Engineering
  'bee': 'EE',
  'bsee': 'EE',
  'msee': 'EE',
  'phdee': 'EE',
  
  // Electronics Engineering
  'bele': 'ELE',
  'bsele': 'ELE',
  'msele': 'ELE',
  'phdele': 'ELE',
  
  // Telecom Engineering
  'bte': 'TE',
  'bste': 'TE',
  'mste': 'TE',
  'phdte': 'TE',
  
  // Business Administration
  'bba': 'BBA',
  'mba': 'BBA',
  'phdba': 'BBA',
  
  // Mathematics
  'bmath': 'MATH',
  'bsmath': 'MATH',
  'msmath': 'MATH',
  'phdmath': 'MATH',
  
  // Physics
  'bphy': 'PHY',
  'bsphy': 'PHY',
  'msphy': 'PHY',
  'phdphy': 'PHY',
  
  // Chemistry
  'bchem': 'CHEM',
  'bschem': 'CHEM',
  'mschem': 'CHEM',
  'phdchem': 'CHEM',
  
  // Computer Engineering
  'bcpe': 'CPE',
  'bscpe': 'CPE',
  'mscpe': 'CPE',
  'phdcpe': 'CPE',
  
  // Mechanical Engineering
  'bme': 'ME',
  'bsme': 'ME',
  'msme': 'ME',
  'phdme': 'ME',
  
  // Civil Engineering
  'bce': 'CE',
  'bsce': 'CE',
  'msce': 'CE',
  'phdce': 'CE',
  
  // Biotechnology
  'bbt': 'BT',
  'bsbt': 'BT',
  'msbt': 'BT',
  'phdbt': 'BT',
  
  // Environmental Sciences
  'benv': 'ENV',
  'bsenv': 'ENV',
  'msenv': 'ENV',
  'phdenv': 'ENV',
  
  // Architecture
  'barch': 'ARCH',
  'bsarch': 'ARCH',
  'msarch': 'ARCH',
  'phdarch': 'ARCH',
  
  // Economics
  'becon': 'ECON',
  'bsecon': 'ECON',
  'msecon': 'ECON',
  'phdecon': 'ECON',
  
  // Pharmacy
  'bpharm': 'PHARM',
  'pharmd': 'PHARM',
  'mspharm': 'PHARM',
  'phdpharm': 'PHARM',
  
  // Management Sciences
  'bmgt': 'MGT',
  'bsmgt': 'MGT',
  'msmgt': 'MGT',
  'phdmgt': 'MGT',
  
  // Humanities
  'bhum': 'HUM',
  'bshum': 'HUM',
  'mshum': 'HUM',
  'phdhum': 'HUM'
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