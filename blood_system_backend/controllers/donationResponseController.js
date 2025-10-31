// controllers/donationResponseController.js
const db = require('../config/db');
const { canDonate } = require('../utils/bloodCompatibility');

// Create a donation response (donor responds to a request)
exports.createResponse = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      request_id,
      response_type,
      response_message,
      appointment_date
    } = req.body;

    // Validation
    if (!request_id || !response_type) {
      return res.status(400).json({
        success: false,
        message: 'Request ID and response type are required'
      });
    }

    // Get donor_id and blood_group from user_id
    const [donors] = await db.query(
      'SELECT donor_id, blood_group FROM donors WHERE user_id = ?',
      [userId]
    );

    if (donors.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Only donors can respond to requests'
      });
    }

    const donor_id = donors[0].donor_id;
    const donorBloodGroup = donors[0].blood_group;

    // Check if request exists and get blood group
    const [requests] = await db.query(
      'SELECT status, blood_group FROM blood_requests WHERE request_id = ?',
      [request_id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    if (requests[0].status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: 'This request is no longer open'
      });
    }

    const requestBloodGroup = requests[0].blood_group;

    // Check blood compatibility
    if (!canDonate(donorBloodGroup, requestBloodGroup)) {
      return res.status(400).json({
        success: false,
        message: `Blood type incompatible. Your blood type (${donorBloodGroup}) cannot donate to ${requestBloodGroup}`
      });
    }

    // Check if donor already responded to this request
    const [existingResponse] = await db.query(
      'SELECT response_id FROM donation_responses WHERE request_id = ? AND donor_id = ?',
      [request_id, donor_id]
    );

    if (existingResponse.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already responded to this request'
      });
    }

    // Create response
    const [result] = await db.query(
      `INSERT INTO donation_responses
      (request_id, donor_id, response_type, response_message, appointment_date)
      VALUES (?, ?, ?, ?, ?)`,
      [request_id, donor_id, response_type, response_message, appointment_date]
    );

    res.status(201).json({
      success: true,
      message: 'Response submitted successfully',
      response_id: result.insertId
    });
  } catch (error) {
    console.error('Create response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit response'
    });
  }
};

// Get responses for a specific request (for hospitals to see who responded)
exports.getResponsesByRequest = async (req, res) => {
  try {
    const { request_id } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;

    console.log('Getting responses for request_id:', request_id);
    console.log('User ID:', userId, 'Role:', userRole);

    // Check if request exists
    const [requests] = await db.query(
      'SELECT hospital_id FROM blood_requests WHERE request_id = ?',
      [request_id]
    );

    console.log('Request found:', requests.length > 0 ? 'Yes' : 'No');
    if (requests.length > 0) {
      console.log('Request hospital_id:', requests[0].hospital_id);
    }

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    // Only hospital that created the request or admin can view responses
    if (requests[0].hospital_id !== userId && userRole !== 'admin') {
      console.log('Access denied: hospital_id mismatch');
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const [responses] = await db.query(
      `SELECT
        dr.*,
        d.blood_group,
        d.city,
        d.state,
        d.availability_days,
        d.availability_time_start,
        d.availability_time_end,
        d.preferred_contact_method,
        u.full_name as donor_name,
        u.email as donor_email,
        u.phone as donor_phone
      FROM donation_responses dr
      JOIN donors d ON dr.donor_id = d.donor_id
      JOIN users u ON d.user_id = u.user_id
      WHERE dr.request_id = ?
      ORDER BY dr.created_at DESC`,
      [request_id]
    );

    console.log('Responses found:', responses.length);
    console.log('Response data:', JSON.stringify(responses, null, 2));

    res.json({
      success: true,
      count: responses.length,
      responses
    });
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch responses',
      error: error.message
    });
  }
};

// Get donor's own responses
exports.getMyResponses = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [donors] = await db.query(
      'SELECT donor_id FROM donors WHERE user_id = ?',
      [userId]
    );

    if (donors.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Only donors can view responses'
      });
    }

    const donor_id = donors[0].donor_id;

    const [responses] = await db.query(
      `SELECT
        dr.*,
        br.patient_name,
        br.blood_group,
        br.hospital_name,
        br.city,
        br.contact_person,
        br.contact_phone,
        br.status as request_status
      FROM donation_responses dr
      JOIN blood_requests br ON dr.request_id = br.request_id
      WHERE dr.donor_id = ?
      ORDER BY dr.created_at DESC`,
      [donor_id]
    );

    res.json({
      success: true,
      count: responses.length,
      responses
    });
  } catch (error) {
    console.error('Get my responses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your responses'
    });
  }
};

// Update response status
exports.updateResponse = async (req, res) => {
  try {
    const { response_id } = req.params;
    const userId = req.user.user_id;
    const {
      response_type,
      response_message,
      appointment_date,
      donation_completed,
      donation_date
    } = req.body;

    // Get donor_id
    const [donors] = await db.query(
      'SELECT donor_id FROM donors WHERE user_id = ?',
      [userId]
    );

    if (donors.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Only donors can update responses'
      });
    }

    const donor_id = donors[0].donor_id;

    // Check if response belongs to this donor
    const [responses] = await db.query(
      'SELECT donor_id FROM donation_responses WHERE response_id = ?',
      [response_id]
    );

    if (responses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }

    if (responses[0].donor_id !== donor_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updates = [];
    const params = [];

    if (response_type) {
      updates.push('response_type = ?');
      params.push(response_type);
    }
    if (response_message !== undefined) {
      updates.push('response_message = ?');
      params.push(response_message);
    }
    if (appointment_date) {
      updates.push('appointment_date = ?');
      params.push(appointment_date);
    }
    if (donation_completed !== undefined) {
      updates.push('donation_completed = ?');
      params.push(donation_completed);
    }
    if (donation_date) {
      updates.push('donation_date = ?');
      params.push(donation_date);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(response_id);

    await db.query(
      `UPDATE donation_responses SET ${updates.join(', ')} WHERE response_id = ?`,
      params
    );

    res.json({
      success: true,
      message: 'Response updated successfully'
    });
  } catch (error) {
    console.error('Update response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update response'
    });
  }
};

// Delete response (cancel)
exports.deleteResponse = async (req, res) => {
  try {
    const { response_id } = req.params;
    const userId = req.user.user_id;

    const [donors] = await db.query(
      'SELECT donor_id FROM donors WHERE user_id = ?',
      [userId]
    );

    if (donors.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Only donors can delete responses'
      });
    }

    const donor_id = donors[0].donor_id;

    const [responses] = await db.query(
      'SELECT donor_id FROM donation_responses WHERE response_id = ?',
      [response_id]
    );

    if (responses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }

    if (responses[0].donor_id !== donor_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await db.query('DELETE FROM donation_responses WHERE response_id = ?', [response_id]);

    res.json({
      success: true,
      message: 'Response cancelled successfully'
    });
  } catch (error) {
    console.error('Delete response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel response'
    });
  }
};
