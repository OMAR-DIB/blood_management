// src/utils/helpers.js
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getUrgencyColor = (urgency) => {
  const colors = {
    Critical: 'red',
    Urgent: 'yellow',
    Normal: 'blue'
  };
  return colors[urgency] || 'gray';
};

export const getStatusColor = (status) => {
  const colors = {
    Open: 'green',
    Fulfilled: 'blue',
    Closed: 'gray'
  };
  return colors[status] || 'gray';
};

export const canDonate = (lastDonationDate, minDaysBetweenDonations = 90) => {
  if (!lastDonationDate) return true;
  
  const lastDonation = new Date(lastDonationDate);
  const today = new Date();
  const daysSinceLastDonation = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
  
  return daysSinceLastDonation >= minDaysBetweenDonations;
};

export const isEligibleDonor = (donor) => {
  const age = calculateAge(donor.date_of_birth);
  const weight = donor.weight;
  const canDonateBasedOnLastDonation = canDonate(donor.last_donation_date);
  
  return (
    age >= 18 &&
    age <= 65 &&
    weight >= 50 &&
    canDonateBasedOnLastDonation &&
    donor.is_available
  );
};

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

const BLOOD_GROUP_COMPATIBILITY = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

export const getCompatibleBloodGroups = (bloodGroup) => {
  return BLOOD_GROUP_COMPATIBILITY[bloodGroup] || [];
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getDaysUntil = (date) => {
  if (!date) return null;
  
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getUrgencyBadgeClass = (urgency) => {
  const classes = {
    Critical: 'badge-danger',
    Urgent: 'badge-warning',
    Normal: 'badge-info'
  };
  return classes[urgency] || 'badge-info';
};

export const getStatusBadgeClass = (status) => {
  const classes = {
    Open: 'badge-success',
    Fulfilled: 'badge-info',
    Closed: 'badge-warning'
  };
  return classes[status] || 'badge-info';
};

export const exportToJSON = (data, filename) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (data, filename) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header];
        return typeof cell === 'string' && cell.includes(',') 
          ? `"${cell}"` 
          : cell;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
