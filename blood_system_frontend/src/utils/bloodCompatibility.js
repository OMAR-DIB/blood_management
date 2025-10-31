// src/utils/bloodCompatibility.js

/**
 * Blood Donation Compatibility Rules
 * Returns true if donorBloodGroup can donate to recipientBloodGroup
 */
export const canDonate = (donorBloodGroup, recipientBloodGroup) => {
  const compatibility = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'] // Can only donate to AB+
  };

  return compatibility[donorBloodGroup]?.includes(recipientBloodGroup) || false;
};

/**
 * Get compatible blood types that can donate to recipient
 */
export const getCompatibleDonors = (recipientBloodGroup) => {
  const allBloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  return allBloodGroups.filter(donorType => canDonate(donorType, recipientBloodGroup));
};

/**
 * Get compatible recipients for a donor
 */
export const getCompatibleRecipients = (donorBloodGroup) => {
  const compatibility = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
  };

  return compatibility[donorBloodGroup] || [];
};
