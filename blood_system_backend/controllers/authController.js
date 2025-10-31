// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register new user
exports.register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      role,
      blood_group,
      date_of_birth,
      gender,
      weight,
      city,
      state,
      address
    } = req.body;

    // Validation
    if (!full_name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user exists
    const [existingUser] = await db.query(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [userResult] = await db.query(
      'INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, hashedPassword, phone, role || 'donor']
    );

    const userId = userResult.insertId;

    // If registering as donor, add to donors table
    if (role === 'donor') {  // ← Remove "|| !role"
  if (!blood_group || !city) {
    return res.status(400).json({
      success: false,
      message: 'Blood group and city are required for donors'
    });
  }

      await db.query(
        'INSERT INTO donors (user_id, blood_group, date_of_birth, gender, weight, city, state, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, blood_group, date_of_birth, gender, weight, city, state, address]
      );
    }

    // Generate token
    const token = jwt.sign(
      { userId, role: role || 'donor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        user_id: userId,
        full_name,
        email,
        role: role || 'donor'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Get user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [users] = await db.query(
      'SELECT user_id, full_name, email, phone, role, created_at FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let profile = users[0];

    // If donor, get donor details
    if (profile.role === 'donor') {
      const [donors] = await db.query(
        'SELECT * FROM donors WHERE user_id = ?',
        [userId]
      );

      if (donors.length > 0) {
        profile = { ...profile, ...donors[0] };
      }
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// Update user profile (name, phone, email)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { full_name, phone, email } = req.body;

    const updates = [];
    const params = [];

    if (full_name) {
      updates.push('full_name = ?');
      params.push(full_name);
    }
    if (phone) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (email) {
      // Check if email is already taken by another user
      const [existingUser] = await db.query(
        'SELECT user_id FROM users WHERE email = ? AND user_id != ?',
        [email, userId]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another account'
        });
      }

      updates.push('email = ?');
      params.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(userId);

    await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
      params
    );

    // Get updated profile
    const [updatedUser] = await db.query(
      'SELECT user_id, full_name, email, phone, role FROM users WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Delete user account (self-deletion)
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { password } = req.body;

    // Require password confirmation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Get user and verify password
    const [users] = await db.query(
      'SELECT password FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, users[0].password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Delete user (cascade will delete related donor/hospital data)
    await db.query('DELETE FROM users WHERE user_id = ?', [userId]);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};