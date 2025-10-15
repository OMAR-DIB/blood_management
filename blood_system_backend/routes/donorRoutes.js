// routes/donorRoutes.js
const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/', donorController.getAllDonors);
router.get('/:id', donorController.getDonorById);

// Protected routes
router.put('/:id', auth, donorController.updateDonor);
router.delete('/:id', auth, donorController.deleteDonor);

module.exports = router;