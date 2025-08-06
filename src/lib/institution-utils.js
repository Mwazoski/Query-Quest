import { prisma } from './prisma';

/**
 * Analyzes an email address to determine the user's role and institution
 * @param {string} email - The email address to analyze
 * @returns {Promise<{institution: Object|null, isTeacher: boolean, isStudent: boolean}>}
 */
export async function analyzeEmailDomain(email) {
  if (!email || typeof email !== 'string') {
    return {
      institution: null,
      isTeacher: false,
      isStudent: false
    };
  }

  const emailLower = email.toLowerCase();
  
  // Get all institutions with their email suffixes
  const institutions = await prisma.institution.findMany({
    select: {
      id: true,
      name: true,
      studentEmailSuffix: true,
      teacherEmailSuffix: true
    }
  });

  // Check each institution's email suffixes
  for (const institution of institutions) {
    // Check if email matches student suffix
    if (institution.studentEmailSuffix && emailLower.endsWith(institution.studentEmailSuffix.toLowerCase())) {
      return {
        institution,
        isTeacher: false,
        isStudent: true
      };
    }

    // Check if email matches teacher suffix
    if (institution.teacherEmailSuffix && emailLower.endsWith(institution.teacherEmailSuffix.toLowerCase())) {
      return {
        institution,
        isTeacher: true,
        isStudent: false
      };
    }
  }

  // No matching institution found
  return {
    institution: null,
    isTeacher: false,
    isStudent: false
  };
}

/**
 * Validates if an email domain is allowed for registration
 * @param {string} email - The email address to validate
 * @returns {Promise<{isValid: boolean, message: string, institution: Object|null, role: string|null}>}
 */
export async function validateEmailDomain(email) {
  const analysis = await analyzeEmailDomain(email);
  
  if (!analysis.institution) {
    return {
      isValid: false,
      message: "Email domain not recognized. Only registered institutions can access this platform.",
      institution: null,
      role: null
    };
  }

  return {
    isValid: true,
    message: `Email verified for ${analysis.institution.name} (${analysis.isTeacher ? 'Teacher' : 'Student'})`,
    institution: analysis.institution,
    role: analysis.isTeacher ? 'teacher' : 'student'
  };
} 