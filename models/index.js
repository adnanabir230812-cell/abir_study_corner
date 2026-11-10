const fs = require('fs');
const path = require('path');

// Mock Sequelize connection object for server.js startup checks
const sequelize = {
  authenticate: async () => Promise.resolve(),
  sync: async () => Promise.resolve(),
};

// Academic Terms Configuration (1-1 to 4-2)
const TERMS_CONFIG = [
  {
    id: '1-1',
    year: 1,
    semester: 1,
    name: 'Term 1-1',
    fullTitle: 'Year 1 • Term 1',
    bnTitle: '১ম বর্ষ • ১ম টার্ম',
    codeSeries: '1100 Series',
    status: 'semester',
    badgeText: '1st Year',
    theme: 'sky'
  },
  {
    id: '1-2',
    year: 1,
    semester: 2,
    name: 'Term 1-2',
    fullTitle: 'Year 1 • Term 2',
    bnTitle: '১ম বর্ষ • ২য় টার্ম',
    codeSeries: '1200 Series',
    status: 'semester',
    badgeText: '1st Year',
    theme: 'cyan'
  },
  {
    id: '2-1',
    year: 2,
    semester: 1,
    name: 'Term 2-1',
    fullTitle: 'Year 2 • Term 1',
    bnTitle: '২য় বর্ষ • ১ম টার্ম',
    codeSeries: '2100 Series',
    status: 'semester',
    badgeText: '2nd Year',
    theme: 'teal'
  },
  {
    id: '2-2',
    year: 2,
    semester: 2,
    name: 'Term 2-2',
    fullTitle: 'Year 2 • Term 2',
    bnTitle: '২য় বর্ষ • ২য় টার্ম',
    codeSeries: '2200 Series',
    status: 'semester',
    badgeText: '2nd Year',
    theme: 'emerald'
  },
  {
    id: '3-1',
    year: 3,
    semester: 1,
    name: 'Term 3-1',
    fullTitle: 'Year 3 • Term 1',
    bnTitle: '৩য় বর্ষ • ১ম টার্ম',
    codeSeries: '3100 Series',
    status: 'semester',
    badgeText: '3rd Year',
    theme: 'violet'
  },
  {
    id: '3-2',
    year: 3,
    semester: 2,
    name: 'Term 3-2',
    fullTitle: 'Year 3 • Term 2',
    bnTitle: '৩য় বর্ষ • ২য় টার্ম (আগের টার্ম)',
    codeSeries: '3200 Series',
    status: 'previous',
    badgeText: 'Previous Term • Archive',
    theme: 'indigo'
  },
  {
    id: '4-1',
    year: 4,
    semester: 1,
    name: 'Term 4-1',
    fullTitle: 'Year 4 • Term 1',
    bnTitle: '৪র্থ বর্ষ • ১ম টার্ম (চলমান টার্ম)',
    codeSeries: '4100 Series',
    status: 'current',
    badgeText: 'Current Active Term',
    theme: 'amber'
  },
  {
    id: '4-2',
    year: 4,
    semester: 2,
    name: 'Term 4-2',
    fullTitle: 'Year 4 • Term 2',
    bnTitle: '৪র্থ বর্ষ • ২য় টার্ম',
    codeSeries: '4200 Series',
    status: 'upcoming',
    badgeText: 'Final Term',
    theme: 'rose'
  }
];

const DEFAULT_CURRENT_TERM = '4-1';

// Load static database content into memory
let database = { courses: [], exams: [] };
try {
  const dbPath = path.join(process.cwd(), 'database.json');
  if (fs.existsSync(dbPath)) {
    database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    // Normalize term field on all courses and exams (defaulting legacy entries to '3-2')
    database.courses.forEach(c => {
      if (!c.term) c.term = '3-2';
    });
    database.exams.forEach(e => {
      if (!e.term) e.term = '3-2';
    });
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
    const { term } = options.where || {};
    let list = database.courses;
    if (term) {
      list = list.filter(c => (c.term || '3-2') === term);
    }
    return list.map(c => addHelpers(c));
  }

  static async findByPk(id, options = {}) {
    const course = database.courses.find(c => c.id == id);
    if (!course) return null;
    const copy = addHelpers(course);
    if (!copy.term) copy.term = '3-2';
    return copy;
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
    const { term } = options.where || {};
    let list = database.exams;
    if (term) {
      list = list.filter(e => (e.term || '3-2') === term);
    }
    return list.map(e => addHelpers(e));
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
  TERMS_CONFIG,
  DEFAULT_CURRENT_TERM,
  Course,
  Section,
  Topic,
  Question,
  Progress,
  Note,
  Pdf,
  Exam,
};
