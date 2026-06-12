const fs = require('fs');
const path = require('path');
const { Course, Section, Topic, Question, Note, Pdf } = require('../models');

async function test() {
  try {
    const sec = 3;
    const courseId = 2;
    const course = await Course.findByPk(courseId);
    const section = await Section.findByPk(sec);
    
    console.log('Course found:', !!course);
    console.log('Section found:', !!section);
    console.log('Section Topics count:', section.Topics ? section.Topics.length : 'undefined');
    
    section.Topics.forEach((t, tIdx) => {
      console.log(`Topic [${tIdx}]: ${t.name}, Questions exists:`, !!t.Questions);
      if (t.Questions) {
        console.log(`  Questions count:`, t.Questions.length);
        t.Questions.forEach((q, qIdx) => {
          if (!q.questionText) console.log(`    Missing questionText at Q [${qIdx}]`);
          if (!q.answerText) console.log(`    Missing answerText at Q [${qIdx}]`);
        });
      }
    });
    
    console.log('Test completed successfully');
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

test();
