// src/utils/constants.js
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const URGENCY_LEVELS = {
  CRITICAL: 'Critical',
  URGENT: 'Urgent',
  NORMAL: 'Normal'
};

export const REQUEST_STATUS = {
  OPEN: 'Open',
  FULFILLED: 'Fulfilled',
  CLOSED: 'Closed'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  HOSPITAL: 'hospital',
  DONOR: 'donor'
};

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const BLOOD_GROUP_COMPATIBILITY = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal donor
};

export const DONATION_ELIGIBILITY = {
  MIN_AGE: 18,
  MAX_AGE: 65,
  MIN_WEIGHT: 50, // kg
  DONATION_INTERVAL: 90 // days
};