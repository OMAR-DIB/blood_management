// routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);

// Protected routes - hospitals and admins can create
router.post('/', auth, requestController.createRequest);
router.put('/:id', auth, requestController.updateRequest);
router.delete('/:id', auth, requestController.deleteRequest);

module.exports = router;