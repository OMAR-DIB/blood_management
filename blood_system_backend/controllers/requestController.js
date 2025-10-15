// controllers/requestController.js
const db = require('../config/db');

// Get all blood requests
exports.getAllRequests = async (req, res) => {
  try {
    const { blood_group, city, status, urgency } = req.query;
    
    let query = `
      SELECT 
        br.*,
        u.full_name as hospital_contact_name
      FROM blood_requests br
      JOIN users u ON br.hospital_id = u.user_id
      WHERE 1=1
    `;
    
    const params = [];

    if (blood_group) {
      query += ' AND br.blood_group = ?';
      params.push(blood_group);
    }

    if (city) {
      query += ' AND br.city LIKE ?';
      params.push(`%${city}%`);
    }

    if (status) {
      query += ' AND br.status = ?';
      params.push(status);
    }

    if (urgency) {
      query += ' AND br.urgency = ?';
      params.push(urgency);
    }

    query += ' ORDER BY br.urgency DESC, br.created_at DESC';

    const [requests] = await db.query(query, params);

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blood requests'
    });
  }
};

// Get request by ID
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [requests] = await db.query(
      `SELECT 
        br.*,
        u.full_name as hospital_contact_name,
        u.email as hospital_email
      FROM blood_requests br
      JOIN users u ON br.hospital_id = u.user_id
      WHERE br.request_id = ?`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    res.json({
      success: true,
      request: requests[0]
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blood request'
    });
  }
};

// Create blood request
exports.createRequest = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      patient_name,
      blood_group,
      units_required,
      urgency,
      hospital_name,
      hospital_address,
      city,
      state,
      contact_person,
      contact_phone,
      required_by,
      description
    } = req.body;

    // Validation
    if (!patient_name || !blood_group || !units_required || !hospital_name || 
        !hospital_address || !city || !contact_person || !contact_phone || !required_by) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const [result] = await db.query(
      `INSERT INTO blood_requests 
      (hospital_id, patient_name, blood_group, units_required, urgency, hospital_name, 
       hospital_address, city, state, contact_person, contact_phone, required_by, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, patient_name, blood_group, units_required, urgency || 'Normal', 
       hospital_name, hospital_address, city, state, contact_person, contact_phone, 
       required_by, description]
    );

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      request_id: result.insertId
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blood request'
    });
  }
};

// Update blood request
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;

    // Check if request exists and belongs to user
    const [requests] = await db.query(
      'SELECT hospital_id FROM blood_requests WHERE request_id = ?',
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    // Only allow hospital to update their own request or admin
    if (requests[0].hospital_id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      patient_name,
      blood_group,
      units_required,
      urgency,
      hospital_name,
      hospital_address,
      city,
      state,
      contact_person,
      contact_phone,
      required_by,
      status,
      description
    } = req.body;

    const updates = [];
    const params = [];

    if (patient_name) {
      updates.push('patient_name = ?');
      params.push(patient_name);
    }
    if (blood_group) {
      updates.push('blood_group = ?');
      params.push(blood_group);
    }
    if (units_required) {
      updates.push('units_required = ?');
      params.push(units_required);
    }
    if (urgency) {
      updates.push('urgency = ?');
      params.push(urgency);
    }
    if (hospital_name) {
      updates.push('hospital_name = ?');
      params.push(hospital_name);
    }
    if (hospital_address) {
      updates.push('hospital_address = ?');
      params.push(hospital_address);
    }
    if (city) {
      updates.push('city = ?');
      params.push(city);
    }
    if (state) {
      updates.push('state = ?');
      params.push(state);
    }
    if (contact_person) {
      updates.push('contact_person = ?');
      params.push(contact_person);
    }
    if (contact_phone) {
      updates.push('contact_phone = ?');
      params.push(contact_phone);
    }
    if (required_by) {
      updates.push('required_by = ?');
      params.push(required_by);
    }
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(id);

    await db.query(
      `UPDATE blood_requests SET ${updates.join(', ')} WHERE request_id = ?`,
      params
    );

    res.json({
      success: true,
      message: 'Blood request updated successfully'
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blood request'
    });
  }
};

// Delete blood request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;

    const [requests] = await db.query(
      'SELECT hospital_id FROM blood_requests WHERE request_id = ?',
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    // Only allow hospital to delete their own request or admin
    if (requests[0].hospital_id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await db.query('DELETE FROM blood_requests WHERE request_id = ?', [id]);

    res.json({
      success: true,
      message: 'Blood request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blood request'
    });
  }
};