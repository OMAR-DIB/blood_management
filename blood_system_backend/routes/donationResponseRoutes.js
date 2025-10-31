// routes/donationResponseRoutes.js
const express = require('express');
const router = express.Router();
const responseController = require('../controllers/donationResponseController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Donor routes
router.post('/', responseController.createResponse);
router.get('/my-responses', responseController.getMyResponses);
router.put('/:response_id', responseController.updateResponse);
router.delete('/:response_id', responseController.deleteResponse);

// Hospital/Admin routes - get responses for a specific request
router.get('/request/:request_id', responseController.getResponsesByRequest);

module.exports = router;
