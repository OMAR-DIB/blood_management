const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validateBloodGroup = (bloodGroup) => {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validGroups.includes(bloodGroup);
};

const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potential SQL injection characters
  return input
    .replace(/[<>]/g, '')
    .trim();
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateBloodGroup,
  validateDate,
  validateRequiredFields,
  sanitizeInput
};