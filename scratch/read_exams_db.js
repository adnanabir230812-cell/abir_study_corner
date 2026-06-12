const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'database.json');
if (fs.existsSync(jsonPath)) {
  const db = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log('--- Database.json keys ---', Object.keys(db));
  if (db.Exams || db.exams) {
    console.log('Exams found in database.json:');
    console.log(db.Exams || db.exams);
  }
} else {
  console.log('database.json does not exist!');
}

// Let's also check if we can query database.sqlite using sqlite3 or sequelize
const sqlitePath = path.join(__dirname, '..', 'database.sqlite');
if (fs.existsSync(sqlitePath)) {
  console.log('database.sqlite exists at ' + sqlitePath);
  try {
    const { sequelize, Exam } = require('../models');
    Exam.findAll().then(exams => {
      console.log('Exams from database.sqlite:');
      exams.forEach(e => {
        console.log(`- Course ID: ${e.courseId || e.courseName}, Date: ${e.date || e.examDate}, Name: ${e.name || e.courseTitle}`);
      });
      process.exit(0);
    }).catch(err => {
      console.error('Error querying Exam model:', err);
      process.exit(1);
    });
  } catch (err) {
    console.log('Could not require models or query sequelize:', err.message);
  }
} else {
  console.log('database.sqlite does not exist!');
}
