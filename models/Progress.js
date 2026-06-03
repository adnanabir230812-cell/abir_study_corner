const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'question_id',
  },
  solved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  solvedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'solved_date',
  },
});

module.exports = Progress;
