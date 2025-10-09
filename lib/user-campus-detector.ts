import { EMAIL_DOMAIN_TO_CAMPUS_CODE, EMAIL_PREFIX_TO_DEPARTMENT_CODE } from './campus-email-mapping';

/**
 * Detect campus code from user email address
 * @param email User's email address
 * @returns Campus code or null if not detected
 */
export function detectCampusFromEmail(email: string | undefined): string | null {
  if (!email) return null;
  
  const emailParts = email.split('@');
  if (emailParts.length !== 2) return null;
  
  const domain = emailParts[1];
  return EMAIL_DOMAIN_TO_CAMPUS_CODE[domain] || null;
}

/**
 * Detect department code from user email address
 * @param email User's email address
 * @returns Department code or null if not detected
 */
export function detectDepartmentFromEmail(email: string | undefined): string | null {
  if (!email) return null;
  
  const emailParts = email.split('@');
  if (emailParts.length !== 2) return null;
  
  const localPart = emailParts[0].toLowerCase();
  
  // Try to match the longest prefix first
  const sortedKeys = Object.keys(EMAIL_PREFIX_TO_DEPARTMENT_CODE).sort((a, b) => b.length - a.length);
  
  for (const prefix of sortedKeys) {
    if (localPart.startsWith(prefix)) {
      return EMAIL_PREFIX_TO_DEPARTMENT_CODE[prefix];
    }
  }
  
  return null;
}

/**
 * Automatically set user preferences based on email address
 * @param email User's email address
 * @param supabase Supabase client instance
 * @returns Promise that resolves when preferences are set
 */
export async function autoSetUserPreferencesFromEmail(email: string | undefined, supabase: any) {
  if (!email) return;
  
  const campusCode = detectCampusFromEmail(email);
  const departmentCode = detectDepartmentFromEmail(email);
  
  if (!campusCode && !departmentCode) return;
  
  try {
    // Get campus and department IDs
    let campusId = null;
    let departmentId = null;
    
    if (campusCode) {
      const { data: campusData, error: campusError } = await supabase
        .from('campuses')
        .select('id')
        .eq('code', campusCode)
        .single();
      
      if (!campusError && campusData) {
        campusId = campusData.id;
      }
    }
    
    if (departmentCode && campusId) {
      const { data: departmentData, error: departmentError } = await supabase
        .from('departments')
        .select('id')
        .eq('code', departmentCode)
        .eq('campus_id', campusId)
        .single();
      
      if (!departmentError && departmentData) {
        departmentId = departmentData.id;
      }
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // Update user preferences
    const { error: updateError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        campus_id: campusId,
        department_id: departmentId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (updateError) {
      console.error('Failed to auto-set user preferences:', updateError);
    }
  } catch (error) {
    console.error('Error in autoSetUserPreferencesFromEmail:', error);
  }
}