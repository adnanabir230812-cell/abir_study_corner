const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Topic = sequelize.define('Topic', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Topic;
