const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

let sequelize;

if (isTest) {
  // Use SQLite in-memory for testing
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false
  });
} else {
  // Use MySQL for development/production
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: false, // turn off logging or set to console.log
    }
  );
}

module.exports = sequelize;
