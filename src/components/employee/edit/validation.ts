import type {
  Employee,
  EmployeeCertification,
  EmployeeChild,
  EmployeeContact,
  EmployeeDocument,
  EmployeeEducation,
  EmployeeProfile,
  EmployeeProject
} from "@/types/employee";
import type { Language, EmployeeTechnicalSkill } from "@/types/skill";

// ========== Types ==========
export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};



export type ValidationError = Record<string, string>;

// ========== Regex Patterns ==========
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{8,15}$/,
  BANK_ACCOUNT: /^\d+$/,
  IDENTITY_CCCD: /^\d+$/,
  IDENTITY_OLD: /^\d+$/,
  TAX_ID: /^\d+$/,
  SOCIAL_INSURANCE: /^\d+$/,
  FACEBOOK: /^https:\/\/www\.facebook\.com\/.+$/,

} as const;

// ========== Individual Field Validators ==========

/**
 * Validate email format
 */
export const validateEmail = (email: string | null | undefined, fieldName = "email"): string | null => {
  if (!email || email.trim() === "") {
    return `${fieldName} is required`;
  }
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return `Invalid ${fieldName} format`;
  }
  return null;
};

/**
 * Validate optional email (only validates format if provided)
 */
export const validateOptionalEmail = (email: string | null | undefined, fieldName = "email"): string | null => {
  if (!email || email.trim() === "") {
    return null;
  }
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return `Invalid ${fieldName} format`;
  }
  return null;
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string | null | undefined, required = false): string | null => {
  if (!phone || phone.trim() === "") {
    return required ? "Phone number is required" : null;
  }
  if (!VALIDATION_PATTERNS.PHONE.test(phone)) {
    return "Invalid phone number format (8-15 digits)";
  }
  return null;
};

/**
 * Validate required text field
 */
export const validateRequired = (value: string | null | undefined, fieldName: string): string | null => {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate date field
 */
export const validateRequiredDate = (date: string | Date | null | undefined, fieldName: string): string | null => {
  if (!date) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate date logic (e.g., join date must be after birth date)
 */
export const validateDateAfter = (
  dateAfter: string | Date | null | undefined,
  dateBefore: string | Date | null | undefined,
  afterFieldName: string,
  beforeFieldName: string
): string | null => {
  if (!dateAfter || !dateBefore) {
    return null;
  }

  const after = new Date(dateAfter);
  const before = new Date(dateBefore);

  if (after < before) {
    return `${afterFieldName} cannot be earlier than ${beforeFieldName}`;
  }
  return null;
};

// ========== Document Validators ==========

/**
 * Validate bank name
 */
export const validateBankName = (bankName: string | null | undefined): string | null => {
  return validateRequired(bankName, "Bank name");
};

/**
 * Validate bank account number
 */
export const validateBankAccount = (accountNumber: string | null | undefined, required = false): string | null => {
  if (!accountNumber || accountNumber.trim() === "") {
    return required ? "Bank account number is required" : null;
  }
  if (!VALIDATION_PATTERNS.BANK_ACCOUNT.test(accountNumber)) {
    return "Bank account number must only digits";
  }
  return null;
};

/**
 * Validate CCCD (12 digits)
 */
export const validateIdentityNumber = (identityNumber: string | null | undefined, required = false): string | null => {
  if (!identityNumber || identityNumber.trim() === "") {
    return required ? "Identity number is required" : null;
  }
  if (!VALIDATION_PATTERNS.IDENTITY_CCCD.test(identityNumber)) {
    return "Identity number (CCCD) must only digits";
  }
  return null;
};

/**
 * Validate old identity number (9 digits)
 */
export const validateOldIdentityNumber = (oldIdentityNumber: string | null | undefined): string | null => {
  if (!oldIdentityNumber || oldIdentityNumber.trim() === "") {
    return null;
  }
  if (!VALIDATION_PATTERNS.IDENTITY_OLD.test(oldIdentityNumber)) {
    return "Old identity number must only digits";
  }
  return null;
};

/**
 * Validate tax ID (10 or 13 digits)
 */
export const validateTaxId = (taxId: string | null | undefined, required = false): string | null => {
  if (!taxId || taxId.trim() === "") {
    return required ? "Tax ID is required" : null;
  }
  if (!VALIDATION_PATTERNS.TAX_ID.test(taxId)) {
    return "Tax ID (MST) must only digits";
  }
  return null;
};

/**
 * Validate social insurance number (10 digits)
 */
export const validateSocialInsurance = (socialInsurance: string | null | undefined, required = false): string | null => {
  if (!socialInsurance || socialInsurance.trim() === "") {
    return required ? "Social insurance number is required" : null;
  }
  if (!VALIDATION_PATTERNS.SOCIAL_INSURANCE.test(socialInsurance)) {
    return "Social insurance number (BHXH) must noly digits";
  }
  return null;
};


// ========== Collection Validators ==========

/**
 * Validate employee contacts
 */
export const validateContacts = (contacts: EmployeeContact[]): ValidationError => {
  const errors: ValidationError = {};

  contacts.forEach((contact, idx) => {
    if (!contact.name || contact.name.trim() === "") {
      errors[`contacts[${idx}].name`] = "Contact name is required";
    }
    if (!contact.phone || contact.phone.trim() === "") {
      errors[`contacts[${idx}].phone`] = "Contact phone is required";
    } else {
      const phoneError = validatePhone(contact.phone, true);
      if (phoneError) {
        errors[`contacts[${idx}].phone`] = phoneError;
      }
    }
  });

  return errors;
};

/**
 * Validate employee educations
 */
export const validateEducations = (educations: EmployeeEducation[]): ValidationError => {
  const errors: ValidationError = {};

  educations.forEach((edu, idx) => {
    if (!edu.school_name || edu.school_name.trim() === "") {
      errors[`educations[${idx}].school_name`] = "School name is required";
    }
    if (!edu.degree || edu.degree.trim() === "") {
      errors[`educations[${idx}].degree`] = "Degree is required";
    }
  });

  return errors;
};

/**
 * Validate employee certifications
 */
export const validateCertifications = (certifications: EmployeeCertification[]): ValidationError => {
  const errors: ValidationError = {};

  certifications.forEach((cert, idx) => {
    if (!cert.certificate_name || cert.certificate_name.trim() === "") {
      errors[`certifications[${idx}].name`] = "Certification name is required";
    }
  });

  return errors;
};

/**
 * Validate children list
 */
export const validateChildren = (childrenList: EmployeeChild[]): ValidationError => {
  const errors: ValidationError = {};

  childrenList.forEach((child, idx) => {
    if (!child.full_name || child.full_name.trim() === "") {
      errors[`children[${idx}].full_name`] = "Child's name is required";
    }
    if (!child.date_of_birth) {
      errors[`children[${idx}].date_of_birth`] = "Child's date of birth is required";
    }
  });

  return errors;
};

// ========== Employee Basic Info Validator ==========

/**
 * Validate basic employee information
 */
export const validateEmployeeBasicInfo = (employee: Partial<Employee>): ValidationError => {
  const errors: ValidationError = {};

  // Full name
  const fullNameError = validateRequired(employee.full_name, "Full name");
  if (fullNameError) errors.full_name = fullNameError;

  // Email
  const emailError = validateEmail(employee.email, "Email");
  if (emailError) errors.email = emailError;

  // Personal email (optional)
  const personalEmailError = validateOptionalEmail(employee.personal_email, "Personal email");
  if (personalEmailError) errors.personal_email = personalEmailError;

  // Phone (optional but validate format if provided)
  const phoneError = validatePhone(employee.phone, false);
  if (phoneError) errors.phone = phoneError;

  // Date of birth
  const dobError = validateRequiredDate(employee.date_of_birth, "Date of birth");
  if (dobError) errors.date_of_birth = dobError;

  // Join date
  const joinDateError = validateRequiredDate(employee.join_date, "Join date");
  if (joinDateError) errors.join_date = joinDateError;

  // Current position
  const positionError = validateRequired(employee.current_position, "Current position");
  if (positionError) errors.current_position = positionError;

  // Date logic validation
  const dateLogicError = validateDateAfter(
    employee.join_date,
    employee.date_of_birth,
    "Join date",
    "Date of birth"
  );
  if (dateLogicError) errors.join_date = dateLogicError;

  return errors;
};

// ========== Employee Document Validator ==========

/**
 * Validate employee document information
 */
export const validateEmployeeDocument = (document: Partial<EmployeeDocument>): ValidationError => {
  const errors: ValidationError = {};

  // Bank name (required)
  const bankNameError = validateBankName(document.bank_name);
  if (bankNameError) errors.bank_name = bankNameError;

  // Bank account number
  const bankAccountError = validateBankAccount(document.account_bank_number, false);
  if (bankAccountError) errors.account_bank_number = bankAccountError;

  // Identity number (CCCD)
  const identityError = validateIdentityNumber(document.identity_number, false);
  if (identityError) errors.identity_number = identityError;

  // Old identity number
  const oldIdentityError = validateOldIdentityNumber(document.old_identity_number);
  if (oldIdentityError) errors.old_identity_number = oldIdentityError;

  // Tax ID
  const taxIdError = validateTaxId(document.tax_id_number, false);
  if (taxIdError) errors.tax_id_number = taxIdError;

  // Social insurance
  const socialInsuranceError = validateSocialInsurance(document.social_insurance_number, false);
  if (socialInsuranceError) errors.social_insurance_number = socialInsuranceError;

  

  return errors;
};

export const normalizeFacebookLink = (link: string | null | undefined): string => {
  if (isEmpty(link)) {
    return "";
  }

  let normalized = link!.trim();

  // Find "facebook.com" and keep from there
  const fbIndex = normalized.indexOf("facebook.com");
  if (fbIndex !== -1) {
    normalized = normalized.substring(fbIndex);
  }

  // Add https:// if not present
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = "https://" + normalized;
  }

  // Ensure it starts with https://www.
  if (!normalized.startsWith("https://www.")) {
    normalized = normalized.replace("https://", "https://www.");
  }

  return normalized;
};

export const validateFacebookLink = (link: string | null | undefined, fieldName = "Facebook link"): string | null => {
  if (isEmpty(link)) {
    return null;
  }

  const normalized = normalizeFacebookLink(link);

  if (!VALIDATION_PATTERNS.FACEBOOK.test(normalized)) {
    return `${fieldName} must be a valid Facebook profile URL`;
  }

  return null;
};
// ========== Complete Employee Validator ==========

/**
 * Validate complete new employee data
 */
export const validateNewEmployee = (data: {
  employee: Partial<Employee>;
  contacts: EmployeeContact[];
  document: Partial<EmployeeDocument>;
  educations: EmployeeEducation[];
  certifications: EmployeeCertification[];
  profile: Partial<EmployeeProfile>;
  languages: Language[];
  technicalSkills: EmployeeTechnicalSkill[];
  projects: EmployeeProject[];
  childrenList: EmployeeChild[];
}): ValidationResult => {
  const errors: ValidationError = {};

  // Validate basic employee info
  Object.assign(errors, validateEmployeeBasicInfo(data.employee));

  // Validate document
  Object.assign(errors, validateEmployeeDocument(data.document));

  // Validate contacts
  Object.assign(errors, validateContacts(data.contacts));

  // Validate educations
  Object.assign(errors, validateEducations(data.educations));

  // Validate certifications
  Object.assign(errors, validateCertifications(data.certifications));

  // Validate children
  Object.assign(errors, validateChildren(data.childrenList));

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// ========== Utility Functions ==========

/**
 * Check if validation result has errors
 */
export const hasValidationErrors = (result: ValidationResult): boolean => {
  return !result.valid;
};

/**
 * Get first error message from validation result
 */
export const getFirstError = (errors: ValidationError): string | null => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};

/**
 * Format error messages for display
 */
export const formatErrorMessages = (errors: ValidationError): string[] => {
  return Object.entries(errors).map(([field, message]) => {
    return `${field}: ${message}`;
  });
};

function isEmpty(link: string | null | undefined): boolean {
  return !link || link.trim() === "";
}

