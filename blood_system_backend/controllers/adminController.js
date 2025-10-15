// controllers/adminController.js
const db = require('../config/db');

// Get dashboard statistics
exports.getStatistics = async (req, res) => {
  try {
    // Total users by role
    const [userStats] = await db.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      WHERE is_active = TRUE 
      GROUP BY role
    `);

    // Total donors by blood group
    const [donorsByBloodGroup] = await db.query(`
      SELECT blood_group, COUNT(*) as count 
      FROM donors 
      WHERE is_available = TRUE 
      GROUP BY blood_group 
      ORDER BY blood_group
    `);

    // Blood requests by status
    const [requestsByStatus] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM blood_requests 
      GROUP BY status
    `);

    // Blood requests by urgency
    const [requestsByUrgency] = await db.query(`
      SELECT urgency, COUNT(*) as count 
      FROM blood_requests 
      WHERE status = 'Open'
      GROUP BY urgency
    `);

    // Recent registrations (last 30 days)
    const [recentRegistrations] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Top cities with donors
    const [topCities] = await db.query(`
      SELECT city, COUNT(*) as donor_count 
      FROM donors 
      WHERE is_available = TRUE 
      GROUP BY city 
      ORDER BY donor_count DESC 
      LIMIT 10
    `);

    // Get total counts
    const [totalCounts] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as total_users,
        (SELECT COUNT(*) FROM donors WHERE is_available = TRUE) as total_available_donors,
        (SELECT COUNT(*) FROM blood_requests WHERE status = 'Open') as open_requests,
        (SELECT COUNT(*) FROM blood_requests WHERE status = 'Fulfilled') as fulfilled_requests
    `);

    res.json({
      success: true,
      statistics: {
        totalCounts: totalCounts[0],
        usersByRole: userStats,
        donorsByBloodGroup,
        requestsByStatus,
        requestsByUrgency,
        recentRegistrations,
        topCities
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

// Generate reports
exports.generateReport = async (req, res) => {
  try {
    const { type, start_date, end_date } = req.query;

    let reportData = {};

    switch (type) {
      case 'donors':
        const [donorReport] = await db.query(`
          SELECT 
            d.donor_id,
            u.full_name,
            u.email,
            u.phone,
            d.blood_group,
            d.city,
            d.state,
            d.is_available,
            d.last_donation_date,
            d.created_at
          FROM donors d
          JOIN users u ON d.user_id = u.user_id
          WHERE d.created_at BETWEEN ? AND ?
          ORDER BY d.created_at DESC
        `, [start_date || '2000-01-01', end_date || new Date().toISOString().split('T')[0]]);
        
        reportData = {
          title: 'Donor Report',
          data: donorReport,
          summary: {
            total: donorReport.length,
            available: donorReport.filter(d => d.is_available).length
          }
        };
        break;

      case 'requests':
        const [requestReport] = await db.query(`
          SELECT 
            br.*,
            u.full_name as hospital_contact_name
          FROM blood_requests br
          JOIN users u ON br.hospital_id = u.user_id
          WHERE br.created_at BETWEEN ? AND ?
          ORDER BY br.created_at DESC
        `, [start_date || '2000-01-01', end_date || new Date().toISOString().split('T')[0]]);
        
        reportData = {
          title: 'Blood Request Report',
          data: requestReport,
          summary: {
            total: requestReport.length,
            open: requestReport.filter(r => r.status === 'Open').length,
            fulfilled: requestReport.filter(r => r.status === 'Fulfilled').length,
            closed: requestReport.filter(r => r.status === 'Closed').length
          }
        };
        break;

      case 'blood_group_analysis':
        const [bloodGroupAnalysis] = await db.query(`
          SELECT 
            d.blood_group,
            COUNT(DISTINCT d.donor_id) as total_donors,
            COUNT(DISTINCT CASE WHEN d.is_available = TRUE THEN d.donor_id END) as available_donors,
            COUNT(DISTINCT br.request_id) as total_requests,
            COUNT(DISTINCT CASE WHEN br.status = 'Open' THEN br.request_id END) as open_requests
          FROM donors d
          LEFT JOIN blood_requests br ON d.blood_group = br.blood_group
          GROUP BY d.blood_group
          ORDER BY d.blood_group
        `);
        
        reportData = {
          title: 'Blood Group Analysis',
          data: bloodGroupAnalysis
        };
        break;

      case 'city_analysis':
        const [cityAnalysis] = await db.query(`
          SELECT 
            d.city,
            d.state,
            COUNT(DISTINCT d.donor_id) as total_donors,
            COUNT(DISTINCT CASE WHEN d.is_available = TRUE THEN d.donor_id END) as available_donors,
            COUNT(DISTINCT br.request_id) as total_requests
          FROM donors d
          LEFT JOIN blood_requests br ON d.city = br.city
          GROUP BY d.city, d.state
          ORDER BY total_donors DESC
        `);
        
        reportData = {
          title: 'City-wise Analysis',
          data: cityAnalysis
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type. Use: donors, requests, blood_group_analysis, or city_analysis'
        });
    }

    res.json({
      success: true,
      report: reportData,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        user_id,
        full_name,
        email,
        phone,
        role,
        is_active,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await db.query(
      'UPDATE users SET is_active = ? WHERE user_id = ?',
      [is_active, id]
    );

    res.json({
      success: true,
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};