const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || 'database.sqlite');

// Vercel serverless environment check - copy sqlite file to writable /tmp directory
if (process.env.VERCEL) {
  const tempDbPath = path.join('/tmp', 'database.sqlite');
  try {
    if (fs.existsSync(dbPath)) {
      if (!fs.existsSync(tempDbPath)) {
        fs.copyFileSync(dbPath, tempDbPath);
        console.log('Successfully copied SQLite DB to writable /tmp storage.');
      } else {
        console.log('SQLite DB already exists in /tmp storage.');
      }
    }
    dbPath = tempDbPath;
  } catch (err) {
    console.error('Failed to copy SQLite database to /tmp:', err);
  }
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // set to console.log for debugging query performance
  define: {
    timestamps: true,
    underscored: true,
  }
});

module.exports = sequelize;
