const mongoose = require('mongoose');
const seedDefaultAdmin = require('../utils/seedAdmin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Auto seed initial admin if not existing
    await seedDefaultAdmin();
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
