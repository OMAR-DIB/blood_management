// middleware/roleCheck.js

/**
 * Role-based authorization middleware
 * Use this middleware after the auth middleware to check user roles
 */

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user exists in request (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login first.'
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to access this resource.',
        requiredRoles: allowedRoles,
        yourRole: req.user.role
      });
    }

    // User has the required role, proceed to next middleware
    next();
  };
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

/**
 * Middleware to check if user is hospital
 */
const isHospital = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'hospital') {
    return res.status(403).json({
      success: false,
      message: 'Hospital access required'
    });
  }

  next();
};

/**
 * Middleware to check if user is donor
 */
const isDonor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'donor') {
    return res.status(403).json({
      success: false,
      message: 'Donor access required'
    });
  }

  next();
};

/**
 * Middleware to check if user is hospital or admin
 */
const isHospitalOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'hospital' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Hospital or Admin access required'
    });
  }

  next();
};

/**
 * Middleware to check if user owns the resource or is admin
 */
const isOwnerOrAdmin = (userIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const resourceUserId = parseInt(req.params[userIdParam]);
    const currentUserId = req.user.user_id;
    const isAdmin = req.user.role === 'admin';

    if (currentUserId !== resourceUserId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

module.exports = {
  checkRole,
  isAdmin,
  isHospital,
  isDonor,
  isHospitalOrAdmin,
  isOwnerOrAdmin
};