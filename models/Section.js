const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teacherName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'teacher_name',
  },
});

module.exports = Section;
