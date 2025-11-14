export const isChanged = (oldVal: unknown, newVal: unknown): boolean => {
  return JSON.stringify(oldVal) !== JSON.stringify(newVal);
};

export const formatLabel = (label: string): string => {
  return label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Count the number of sections/fields that have changes
 * This provides a more accurate count of actual changes
 * Only compares fields that exist in EmployeeDraft (excludes email, avatar_*, media_url, etc.)
 */
export const countChanges = (original: any, draft: any): number => {
  if (!original || !draft) return 0;
  
  let totalChanges = 0;
  const changedFields: string[] = []; // 🔍 DEBUG: Track what changed

  // Only compare fields that exist in BOTH Employee and EmployeeDraft
  // Exclude: email, avatar_path, avatar_url, avatar_id, media_url, created_at, updated_at
  const basicFields = [
    'full_name', 
    'personal_email', 
    'phone', 
    'date_of_birth', 
    'gender', 
    'marital_status', 
    'current_address', 
    'permanent_address',
    'current_position', 
    'join_date', 
    'summary',
    'status' // Added status field
  ];

  basicFields.forEach(field => {
    if (isChanged(original[field], draft[field])) {
      totalChanges++;
      changedFields.push(`✏️ ${field}: "${original[field]}" → "${draft[field]}"`);
    }
  });

  // Count document section as 1 change if any document field changed
  // Remove id and employee_id from comparison
  if (original.document || draft.document) {
    const origDoc = original.document ? { ...original.document } : null;
    const draftDoc = draft.document ? { ...draft.document } : null;
    
    // Remove metadata fields before comparison
    if (origDoc) {
      delete origDoc.id;
      delete origDoc.employee_id;
    }
    if (draftDoc) {
      delete draftDoc.id;
      delete draftDoc.employee_id;
    }
    
    if (isChanged(origDoc, draftDoc)) {
      totalChanges++;
      changedFields.push('📄 document section');
    }
  }

  // Count profile section as 1 change if any profile field changed
  if (original.profile || draft.profile) {
    const origProfile = original.profile ? { ...original.profile } : null;
    const draftProfile = draft.profile ? { ...draft.profile } : null;
    
    // Remove metadata fields before comparison
    if (origProfile) {
      delete origProfile.id;
      delete origProfile.employee_id;
    }
    if (draftProfile) {
      delete draftProfile.id;
      delete draftProfile.employee_id;
    }
    
    if (isChanged(origProfile, draftProfile)) {
      totalChanges++;
      changedFields.push('👤 profile section');
    }
  }

  // Count each array section that has changes as 1
  const arrayFields = [
    'educations', 'languages', 'technical_skills', 
    'certifications', 'projects', 'contacts', 'children'
  ];

  arrayFields.forEach(arrayField => {
    const origArray = (original[arrayField] || []).map((item: any) => {
      const { id, employee_id, ...rest } = item;
      return rest;
    });
    const draftArray = (draft[arrayField] || []).map((item: any) => {
      const { id, employee_id, ...rest } = item;
      return rest;
    });
    
    if (isChanged(origArray, draftArray)) {
      totalChanges++;
      changedFields.push(`📋 ${arrayField} (${origArray.length} → ${draftArray.length} items)`);
    }
  });

  // 🔍 DEBUG: Log all changes to console
  console.group('🔍 Profile Comparison ');
  console.log('📊 Total changes :', totalChanges);
  console.log('📝 Changed :');
  changedFields.forEach(field => console.log('  ', field));
  console.groupEnd();

  return totalChanges;
};