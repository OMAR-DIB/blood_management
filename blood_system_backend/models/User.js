// models/User.js
const db = require('../config/db');

class User {
  // Find user by email
  static async findByEmail(email) {
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return users[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [users] = await db.query(
        'SELECT user_id, full_name, email, phone, role, is_active, created_at FROM users WHERE user_id = ?',
        [id]
      );
      return users[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { full_name, email, password, phone, role } = userData;
      const [result] = await db.query(
        'INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        [full_name, email, password, phone, role || 'donor']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, userData) {
    try {
      const fields = [];
      const values = [];

      Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(userData[key]);
        }
      });

      if (fields.length === 0) {
        return false;
      }

      values.push(id);
      const [result] = await db.query(
        `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM users WHERE user_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT user_id, full_name, email, phone, role, is_active, created_at FROM users WHERE 1=1';
      const params = [];

      if (filters.role) {
        query += ' AND role = ?';
        params.push(filters.role);
      }

      if (filters.is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.is_active);
      }

      query += ' ORDER BY created_at DESC';

      const [users] = await db.query(query, params);
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Toggle user active status
  static async toggleActive(id, isActive) {
    try {
      const [result] = await db.query(
        'UPDATE users SET is_active = ? WHERE user_id = ?',
        [isActive, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Check if email exists
  static async emailExists(email) {
    try {
      const [users] = await db.query(
        'SELECT user_id FROM users WHERE email = ?',
        [email]
      );
      return users.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get user count by role
  static async countByRole() {
    try {
      const [results] = await db.query(
        'SELECT role, COUNT(*) as count FROM users WHERE is_active = TRUE GROUP BY role'
      );
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;