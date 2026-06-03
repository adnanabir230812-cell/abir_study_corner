const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public folder (CSS, JS, standard designs)
app.use(express.static(path.join(__dirname, 'public')));

// Secure endpoint for serving uploaded diagrams/images (outside public web root)
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  // Sanitize filename to prevent directory traversal attacks (e.g. ../../../etc/passwd)
  const safeFilename = path.basename(filename);
  const filePath = path.join(__dirname, 'uploads', safeFilename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// App Routes
app.use('/', routes);

// Database Sync and Server Startup
async function initDb() {
  try {
    console.log('Connecting to SQLite database...');
    // Sync models - creates tables if they don't exist without dropping existing data
    await sequelize.sync();
    console.log('SQLite database synchronized.');

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      try {
        fs.mkdirSync(uploadsDir);
      } catch (err) {
        console.warn('Could not create uploads directory in read-only filesystem:', err.message);
      }
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Initialize database connection
initDb();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`Abir's Study Corner is running at:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`===============================================`);
  });
}

module.exports = app;
