// controllers/donorController.js
const db = require('../config/db');

// Get all donors with filters
exports.getAllDonors = async (req, res) => {
  try {
    const { blood_group, city, is_available } = req.query;
    
    let query = `
      SELECT 
        d.donor_id,
        d.blood_group,
        d.city,
        d.state,
        d.is_available,
        d.last_donation_date,
        u.full_name,
        u.phone,
        u.email
      FROM donors d
      JOIN users u ON d.user_id = u.user_id
      WHERE u.is_active = TRUE
    `;
    
    const params = [];

    if (blood_group) {
      query += ' AND d.blood_group = ?';
      params.push(blood_group);
    }

    if (city) {
      query += ' AND d.city LIKE ?';
      params.push(`%${city}%`);
    }

    if (is_available !== undefined) {
      query += ' AND d.is_available = ?';
      params.push(is_available === 'true' ? 1 : 0);
    }

    query += ' ORDER BY d.created_at DESC';

    const [donors] = await db.query(query, params);

    res.json({
      success: true,
      count: donors.length,
      donors
    });
  } catch (error) {
    console.error('Get donors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donors'
    });
  }
};

// Get donor by ID
exports.getDonorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [donors] = await db.query(
      `SELECT 
        d.*,
        u.full_name,
        u.email,
        u.phone
      FROM donors d
      JOIN users u ON d.user_id = u.user_id
      WHERE d.donor_id = ? AND u.is_active = TRUE`,
      [id]
    );

    if (donors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.json({
      success: true,
      donor: donors[0]
    });
  } catch (error) {
    console.error('Get donor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donor'
    });
  }
};

// Update donor profile
exports.updateDonor = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;

    // Check authorization
    const [donors] = await db.query(
      'SELECT user_id FROM donors WHERE donor_id = ?',
      [id]
    );

    if (donors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // Only allow donor to update their own profile or admin
    if (donors[0].user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      blood_group,
      date_of_birth,
      gender,
      weight,
      city,
      state,
      address,
      last_donation_date,
      is_available,
      medical_conditions
    } = req.body;

    const updates = [];
    const params = [];

    if (blood_group) {
      updates.push('blood_group = ?');
      params.push(blood_group);
    }
    if (date_of_birth) {
      updates.push('date_of_birth = ?');
      params.push(date_of_birth);
    }
    if (gender) {
      updates.push('gender = ?');
      params.push(gender);
    }
    if (weight) {
      updates.push('weight = ?');
      params.push(weight);
    }
    if (city) {
      updates.push('city = ?');
      params.push(city);
    }
    if (state) {
      updates.push('state = ?');
      params.push(state);
    }
    if (address) {
      updates.push('address = ?');
      params.push(address);
    }
    if (last_donation_date) {
      updates.push('last_donation_date = ?');
      params.push(last_donation_date);
    }
    if (is_available !== undefined) {
      updates.push('is_available = ?');
      params.push(is_available);
    }
    if (medical_conditions !== undefined) {
      updates.push('medical_conditions = ?');
      params.push(medical_conditions);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(id);

    await db.query(
      `UPDATE donors SET ${updates.join(', ')} WHERE donor_id = ?`,
      params
    );

    res.json({
      success: true,
      message: 'Donor profile updated successfully'
    });
  } catch (error) {
    console.error('Update donor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update donor profile'
    });
  }
};

// Delete donor
exports.deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete donors'
      });
    }

    const [donors] = await db.query(
      'SELECT user_id FROM donors WHERE donor_id = ?',
      [id]
    );

    if (donors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // Delete user (cascade will delete donor)
    await db.query('DELETE FROM users WHERE user_id = ?', [donors[0].user_id]);

    res.json({
      success: true,
      message: 'Donor deleted successfully'
    });
  } catch (error) {
    console.error('Delete donor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete donor'
    });
  }
};