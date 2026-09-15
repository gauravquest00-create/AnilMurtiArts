const User = require('../models/User');

const seedDefaultAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('[Seed] No admin account detected. Creating primary admin user...');
      const admin = await User.create({
        name: 'Anil Murti Art Admin',
        email: 'admin@anilmurtiart.com',
        password: 'Admin@12345',
        phone: '+91 98290 12345',
        role: 'admin'
      });
      console.log(`[Seed] Default admin created: ${admin.email} (Password: Admin@12345)`);
    }
  } catch (error) {
    console.error(`[Seed Error] Could not seed admin: ${error.message}`);
  }
};

module.exports = seedDefaultAdmin;
