const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pdf = sequelize.define('Pdf', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'section_id',
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'file_path',
  },
  generatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'generated_at',
  },
});

module.exports = Pdf;
