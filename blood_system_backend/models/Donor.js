// models/Donor.js
const db = require('../config/db');

class Donor {
  // Create donor profile
  static async create(donorData) {
    try {
      const {
        user_id,
        blood_group,
        date_of_birth,
        gender,
        weight,
        city,
        state,
        address
      } = donorData;

      const [result] = await db.query(
        `INSERT INTO donors 
        (user_id, blood_group, date_of_birth, gender, weight, city, state, address) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, blood_group, date_of_birth, gender, weight, city, state, address]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find donor by ID
  static async findById(id) {
    try {
      const [donors] = await db.query(
        `SELECT d.*, u.full_name, u.email, u.phone 
        FROM donors d
        JOIN users u ON d.user_id = u.user_id
        WHERE d.donor_id = ?`,
        [id]
      );
      return donors[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find donor by user ID
  static async findByUserId(userId) {
    try {
      const [donors] = await db.query(
        `SELECT d.*, u.full_name, u.email, u.phone 
        FROM donors d
        JOIN users u ON d.user_id = u.user_id
        WHERE d.user_id = ?`,
        [userId]
      );
      return donors[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get all donors with filters
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          d.donor_id,
          d.blood_group,
          d.city,
          d.state,
          d.is_available,
          d.last_donation_date,
          d.gender,
          d.weight,
          u.full_name,
          u.phone,
          u.email
        FROM donors d
        JOIN users u ON d.user_id = u.user_id
        WHERE u.is_active = TRUE
      `;
      const params = [];

      if (filters.blood_group) {
        query += ' AND d.blood_group = ?';
        params.push(filters.blood_group);
      }

      if (filters.city) {
        query += ' AND d.city LIKE ?';
        params.push(`%${filters.city}%`);
      }

      if (filters.is_available !== undefined) {
        query += ' AND d.is_available = ?';
        params.push(filters.is_available);
      }

      query += ' ORDER BY d.created_at DESC';

      const [donors] = await db.query(query, params);
      return donors;
    } catch (error) {
      throw error;
    }
  }

  // Update donor
  static async update(id, donorData) {
    try {
      const fields = [];
      const values = [];

      Object.keys(donorData).forEach(key => {
        if (donorData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(donorData[key]);
        }
      });

      if (fields.length === 0) {
        return false;
      }

      values.push(id);
      const [result] = await db.query(
        `UPDATE donors SET ${fields.join(', ')} WHERE donor_id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete donor
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM donors WHERE donor_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get donors by blood group
  static async findByBloodGroup(bloodGroup) {
    try {
      const [donors] = await db.query(
        `SELECT d.*, u.full_name, u.email, u.phone 
        FROM donors d
        JOIN users u ON d.user_id = u.user_id
        WHERE d.blood_group = ? AND d.is_available = TRUE AND u.is_active = TRUE`,
        [bloodGroup]
      );
      return donors;
    } catch (error) {
      throw error;
    }
  }

  // Get donor statistics
  static async getStatistics() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_donors,
          SUM(CASE WHEN is_available = TRUE THEN 1 ELSE 0 END) as available_donors,
          blood_group,
          COUNT(*) as count_per_group
        FROM donors
        GROUP BY blood_group
      `);
      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Get donors by city
  static async findByCity(city) {
    try {
      const [donors] = await db.query(
        `SELECT d.*, u.full_name, u.email, u.phone 
        FROM donors d
        JOIN users u ON d.user_id = u.user_id
        WHERE d.city LIKE ? AND d.is_available = TRUE AND u.is_active = TRUE`,
        [`%${city}%`]
      );
      return donors;
    } catch (error) {
      throw error;
    }
  }

  // Update availability
  static async updateAvailability(id, isAvailable) {
    try {
      const [result] = await db.query(
        'UPDATE donors SET is_available = ? WHERE donor_id = ?',
        [isAvailable, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Count donors by blood group
  static async countByBloodGroup() {
    try {
      const [results] = await db.query(`
        SELECT blood_group, COUNT(*) as donor_count
        FROM donors
        WHERE is_available = TRUE
        GROUP BY blood_group
        ORDER BY blood_group
      `);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Donor;