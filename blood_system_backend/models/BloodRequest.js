// models/BloodRequest.js
const db = require('../config/db');

class BloodRequest {
  // Create new blood request
  static async create(requestData) {
    try {
      const {
        hospital_id,
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
      } = requestData;

      const [result] = await db.query(
        `INSERT INTO blood_requests 
        (hospital_id, patient_name, blood_group, units_required, urgency, 
         hospital_name, hospital_address, city, state, contact_person, 
         contact_phone, required_by, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hospital_id,
          patient_name,
          blood_group,
          units_required,
          urgency || 'Normal',
          hospital_name,
          hospital_address,
          city,
          state,
          contact_person,
          contact_phone,
          required_by,
          description
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find request by ID
  static async findById(id) {
    try {
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
      return requests[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get all requests with filters
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          br.*,
          u.full_name as hospital_contact_name
        FROM blood_requests br
        JOIN users u ON br.hospital_id = u.user_id
        WHERE 1=1
      `;
      const params = [];

      if (filters.blood_group) {
        query += ' AND br.blood_group = ?';
        params.push(filters.blood_group);
      }

      if (filters.city) {
        query += ' AND br.city LIKE ?';
        params.push(`%${filters.city}%`);
      }

      if (filters.status) {
        query += ' AND br.status = ?';
        params.push(filters.status);
      }

      if (filters.urgency) {
        query += ' AND br.urgency = ?';
        params.push(filters.urgency);
      }

      if (filters.hospital_id) {
        query += ' AND br.hospital_id = ?';
        params.push(filters.hospital_id);
      }

      query += ' ORDER BY br.urgency DESC, br.created_at DESC';

      const [requests] = await db.query(query, params);
      return requests;
    } catch (error) {
      throw error;
    }
  }

  // Update request
  static async update(id, requestData) {
    try {
      const fields = [];
      const values = [];

      Object.keys(requestData).forEach(key => {
        if (requestData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(requestData[key]);
        }
      });

      if (fields.length === 0) {
        return false;
      }

      values.push(id);
      const [result] = await db.query(
        `UPDATE blood_requests SET ${fields.join(', ')} WHERE request_id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete request
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM blood_requests WHERE request_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get requests by hospital
  static async findByHospital(hospitalId) {
    try {
      const [requests] = await db.query(
        `SELECT br.*, u.full_name as hospital_contact_name
        FROM blood_requests br
        JOIN users u ON br.hospital_id = u.user_id
        WHERE br.hospital_id = ?
        ORDER BY br.created_at DESC`,
        [hospitalId]
      );
      return requests;
    } catch (error) {
      throw error;
    }
  }

  // Get urgent requests
  static async findUrgent() {
    try {
      const [requests] = await db.query(
        `SELECT br.*, u.full_name as hospital_contact_name
        FROM blood_requests br
        JOIN users u ON br.hospital_id = u.user_id
        WHERE br.status = 'Open' AND br.urgency IN ('Critical', 'Urgent')
        ORDER BY 
          CASE br.urgency 
            WHEN 'Critical' THEN 1 
            WHEN 'Urgent' THEN 2 
          END,
          br.created_at DESC`
      );
      return requests;
    } catch (error) {
      throw error;
    }
  }

  // Update status
  static async updateStatus(id, status) {
    try {
      const [result] = await db.query(
        'UPDATE blood_requests SET status = ? WHERE request_id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get request statistics
  static async getStatistics() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_requests,
          SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open_requests,
          SUM(CASE WHEN status = 'Fulfilled' THEN 1 ELSE 0 END) as fulfilled_requests,
          SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed_requests,
          SUM(CASE WHEN urgency = 'Critical' THEN 1 ELSE 0 END) as critical_requests
        FROM blood_requests
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Count by status
  static async countByStatus() {
    try {
      const [results] = await db.query(`
        SELECT status, COUNT(*) as count
        FROM blood_requests
        GROUP BY status
      `);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Count by urgency
  static async countByUrgency() {
    try {
      const [results] = await db.query(`
        SELECT urgency, COUNT(*) as count
        FROM blood_requests
        WHERE status = 'Open'
        GROUP BY urgency
      `);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Get requests by blood group
  static async findByBloodGroup(bloodGroup) {
    try {
      const [requests] = await db.query(
        `SELECT br.*, u.full_name as hospital_contact_name
        FROM blood_requests br
        JOIN users u ON br.hospital_id = u.user_id
        WHERE br.blood_group = ? AND br.status = 'Open'
        ORDER BY br.urgency DESC, br.created_at DESC`,
        [bloodGroup]
      );
      return requests;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BloodRequest;