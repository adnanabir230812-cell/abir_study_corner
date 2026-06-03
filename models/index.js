const sequelize = require('../config/database');
const Course = require('./Course');
const Section = require('./Section');
const Topic = require('./Topic');
const Question = require('./Question');
const Progress = require('./Progress');
const Note = require('./Note');
const Pdf = require('./Pdf');
const Exam = require('./Exam');

// Define relationships
Course.hasMany(Section, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Section.belongsTo(Course, { foreignKey: 'courseId' });

Section.hasMany(Topic, { foreignKey: 'sectionId', onDelete: 'CASCADE' });
Topic.belongsTo(Section, { foreignKey: 'sectionId' });

Section.hasOne(Note, { foreignKey: 'sectionId', onDelete: 'CASCADE' });
Note.belongsTo(Section, { foreignKey: 'sectionId' });

Section.hasOne(Pdf, { foreignKey: 'sectionId', onDelete: 'CASCADE' });
Pdf.belongsTo(Section, { foreignKey: 'sectionId' });

Topic.hasMany(Question, { foreignKey: 'topicId', onDelete: 'CASCADE' });
Question.belongsTo(Topic, { foreignKey: 'topicId' });

Question.hasOne(Progress, { foreignKey: 'questionId', onDelete: 'CASCADE' });
Progress.belongsTo(Question, { foreignKey: 'questionId' });

module.exports = {
  sequelize,
  Course,
  Section,
  Topic,
  Question,
  Progress,
  Note,
  Pdf,
  Exam,
};

