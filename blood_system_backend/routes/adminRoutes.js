// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');

// All admin routes require authentication
// Note: Add role checking middleware later if needed
router.get('/statistics', auth, adminController.getStatistics);
router.get('/reports', auth, adminController.generateReport);
router.get('/users', auth, adminController.getAllUsers);
router.patch('/users/:id/status', auth, adminController.toggleUserStatus);

module.exports = router;