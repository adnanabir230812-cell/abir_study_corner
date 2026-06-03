const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'topic_id',
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'question_text',
  },
  answerText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'answer_text',
  },
});

module.exports = Question;
