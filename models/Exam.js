const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'subject_name',
  },
  examDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'exam_date',
  },
});

module.exports = Exam;
