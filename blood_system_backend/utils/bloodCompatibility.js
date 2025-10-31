// utils/bloodCompatibility.js

/**
 * Blood Donation Compatibility Rules
 * Returns true if donorBloodGroup can donate to recipientBloodGroup
 */
const canDonate = (donorBloodGroup, recipientBloodGroup) => {
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

module.exports = { canDonate };
