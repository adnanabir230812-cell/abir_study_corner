const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageRefs: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    field: 'image_refs',
  },
});

module.exports = Note;
