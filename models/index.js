const fs = require('fs');
const path = require('path');

// Mock Sequelize connection object for server.js startup checks
const sequelize = {
  authenticate: async () => Promise.resolve(),
  sync: async () => Promise.resolve(),
};

// Load static database content into memory
let database = { courses: [], exams: [] };
try {
  const dbPath = path.join(process.cwd(), 'database.json');
  if (fs.existsSync(dbPath)) {
    database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log(`Loaded ${database.courses.length} courses and ${database.exams.length} exams from database.json`);
  } else {
    console.warn('database.json not found at:', dbPath);
  }
} catch (err) {
  console.error('Failed to load database.json:', err);
}

// Deep copy helper that attaches a dummy .toJSON() method for controllers
function addHelpers(obj) {
  if (!obj) return obj;
  if (typeof obj !== 'object') return obj;
  
  const copy = JSON.parse(JSON.stringify(obj));
  
  Object.defineProperty(copy, 'toJSON', {
    value: function() {
      return this;
    },
    enumerable: false
  });
  
  return copy;
}

// Course mock queries
class Course {
  static async findAll(options = {}) {
    return database.courses.map(c => addHelpers(c));
  }

  static async findByPk(id, options = {}) {
    const course = database.courses.find(c => c.id == id);
    return course ? addHelpers(course) : null;
  }
}

// Section mock queries
class Section {
  static async findByPk(id, options = {}) {
    for (const c of database.courses) {
      const s = c.Sections.find(sec => sec.id == id);
      if (s) return addHelpers(s);
    }
    return null;
  }
}

// Topic mock queries
class Topic {
  static async findAll(options = {}) {
    const { sectionId } = options.where || {};
    let topics = [];
    for (const c of database.courses) {
      for (const s of c.Sections) {
        if (!sectionId || s.id == sectionId) {
          topics = topics.concat(s.Topics);
        }
      }
    }
    return topics.map(t => addHelpers(t));
  }
}

// Question mock queries
class Question {
  static async findByPk(id, options = {}) {
    for (const c of database.courses) {
      for (const s of c.Sections) {
        for (const t of s.Topics) {
          const q = t.Questions.find(ques => ques.id == id);
          if (q) {
            // Include Topic and Section nested details if requested
            const qCopy = addHelpers(q);
            qCopy.Topic = addHelpers({
              id: t.id,
              sectionId: t.sectionId,
              name: t.name,
              Section: addHelpers(s)
            });
            return qCopy;
          }
        }
      }
    }
    return null;
  }

  static async findAll(options = {}) {
    // Return all questions
    let questions = [];
    for (const c of database.courses) {
      for (const s of c.Sections) {
        for (const t of s.Topics) {
          questions = questions.concat(t.Questions);
        }
      }
    }
    return questions.map(q => addHelpers(q));
  }
}

// Note mock queries
class Note {
  static async findOne(options = {}) {
    const { sectionId } = options.where || {};
    for (const c of database.courses) {
      for (const s of c.Sections) {
        if (s.id == sectionId && s.Note) {
          return addHelpers(s.Note);
        }
      }
    }
    return null;
  }
}

// PDF mock queries
class Pdf {
  static async findOne(options = {}) {
    const { sectionId } = options.where || {};
    // Return mock pdf details so pdfController is routed to serve static PDFs
    return { sectionId, filePath: path.join(process.cwd(), 'pdfs', `section_${sectionId}.pdf`), generatedAt: new Date() };
  }

  static async create(data) {
    return addHelpers(data);
  }
}

// Exam mock queries
class Exam {
  static async findAll(options = {}) {
    return database.exams.map(e => addHelpers(e));
  }
}

// Progress mock queries (unused in DB but kept for interface compatibility)
class Progress {
  static async findOne() {
    return null;
  }
  static async create(data) {
    return addHelpers(data);
  }
}

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
