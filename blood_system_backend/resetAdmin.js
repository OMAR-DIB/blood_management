// backend/resetAdmin.js
// This script resets the admin password to: Admin@123

const bcrypt = require('bcrypt');
const db = require('./config/db');

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...');
    
    const email = 'admin@bloodbank.com';
    const password = 'Admin@123';
    const fullName = 'System Administrator';
    const phone = '1234567890';
    
    // Generate password hash
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hash generated');
    
    // Check if admin exists
    const [existingAdmin] = await db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingAdmin.length > 0) {
      // Update existing admin
      await db.query(
        'UPDATE users SET password = ?, is_active = TRUE WHERE email = ?',
        [hashedPassword, email]
      );
      console.log('✅ Admin password updated successfully!');
    } else {
      // Create new admin
      await db.query(
        'INSERT INTO users (full_name, email, password, phone, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [fullName, email, hashedPassword, phone, 'admin', true]
      );
      console.log('✅ Admin user created successfully!');
    }
    
    // Verify
    const [admin] = await db.query(
      'SELECT user_id, full_name, email, role, is_active FROM users WHERE email = ?',
      [email]
    );
    
    console.log('\n📋 Admin Details:');
    console.log('Email:', admin[0].email);
    console.log('Password: Admin@123');
    console.log('Role:', admin[0].role);
    console.log('Active:', admin[0].is_active);
    console.log('\n✅ You can now login with these credentials!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();