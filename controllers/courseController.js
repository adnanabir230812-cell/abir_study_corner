const { Course, Section, Topic, Question, Progress, Note, Pdf, Exam } = require('../models');
const { marked } = require('marked');

// Helper to parse solved question IDs from cookie
const getSolvedFromCookie = (req) => {
  if (!req.headers.cookie) return [];
  const match = req.headers.cookie.match(/solved_questions=([^;]+)/);
  if (!match) return [];
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch (e) {
    return [];
  }
};

// Helper to inject progress states dynamically into course questions
const injectProgress = (courses, solvedIds) => {
  courses.forEach(c => {
    c.Sections.forEach(s => {
      s.Topics.forEach(t => {
        t.Questions.forEach(q => {
          if (solvedIds.includes(q.id)) {
            q.Progress = { solved: true };
          } else {
            q.Progress = null;
          }
        });
      });
    });
  });
};

// Curated Islamic motivational quotes in Bengali (selected dynamically by date)
const islamicQuotes = [
  { text: "নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।", source: "সূরা আল-ইনশিরাহ (৯৪:৬)" },
  { text: "এবং যে আল্লাহকে ভয় করে - তিনি তার জন্য উত্তরণের পথ তৈরি করে দেবেন, এবং তাকে এমন উৎস থেকে রিযিক দেবেন যা সে কল্পনাও করতে পারেনি।", source: "সূরা আত-তালাক (৬৫:২-৩)" },
  { text: "আমার সাফল্য কেবল আল্লাহর সাহায্যে। তাঁরই ওপর আমি ভরসা করি এবং তাঁরই দিকে আমি প্রত্যাবর্তন করি।", source: "সূরা হুদ (১১:৮৮)" },
  { text: "এবং আল্লাহ সর্বোত্তম পরিকল্পনাকারী।", source: "সূরা আলি 'ইমরান (৩:৫৪)" },
  { text: "এবং আল্লাহর ওপর ভরসা করো; আর কর্মবিধায়করূপে আল্লাহই যথেষ্ট।", source: "সূরা আল-আহযাব (৩৩:৩)" },
  { text: "তিনি অন্তরের বিষয়বস্তু সম্পর্কে সম্পূর্ণ অবগত।", source: "সূরা আল-মুলক (৬7:১৩)" },
  { text: "তোমরা হতাশ হয়ো না এবং দুঃখ করো না।", source: "সূরা আলি 'ইমরান (৩:১৩৯)" },
  { text: "তোমরা আমাকে ডাকো, আমি তোমাদের ডাকে সাড়া দেব।", source: "সূরা গাফির (৪০:৬০)" },
  { text: "আল্লাহ কাউকে তার সাধ্যের অতিরিক্ত বোঝা চাপিয়ে দেন না।", source: "সূরা আল-বাকারাহ (২:২৮৬)" },
  { text: "নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।", source: "সূরা আল-বাকারাহ (২:১৫৩)" },
  { text: "তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি, যে নিজে কুরআন শেখে এবং অন্যকে শেখায়।", source: "সহীহ আল-বukhari" },
  { text: "এবং মানুষের সাথে সুন্দরভাবে কথা বলো।", source: "সূরা আল-বাকারাহ (২:৮৩)" },
  { text: "যদি তোমরা কৃতজ্ঞতা প্রকাশ করো, তবে আমি অবশ্যই তোমাদের নেয়ামত বাড়িয়ে দেব।", source: "সূরা ইব্রাহিম (১৪:৭)" },
  { text: "এবং তিনি আপনাকে পথহারা পেয়ে পথপ্রদর্শন করেছেন।", source: "সূরা আদ-দুহা (৯৩:৭)" },
  { text: "ধৈর্য ধারণ করুন, নিশ্চয়ই আল্লাহ সৎকর্মশীলদের প্রতিদান বিনষ্ট করেন না।", source: "সূরা হুদ (১১:১১৫)" }
];



// Helper to configure marked options
marked.setOptions({
  breaks: true, // translate \n to <br>
  gfm: true     // GitHub Flavored Markdown
});

exports.getDashboard = async (req, res) => {
  try {
    const courses = await Course.findAll();

    // Fetch all scheduled exams ordered by date
    const exams = await Exam.findAll();

    // Inject solved question states dynamically from cookies
    const solvedIds = getSolvedFromCookie(req);
    injectProgress(courses, solvedIds);

    let totalCourses = courses.length;
    let totalTopics = 0;
    let totalQuestions = 0;
    let solvedQuestions = 0;

    const courseData = courses.map(course => {
      let courseTopicsCount = 0;
      let courseQuestionsCount = 0;
      let courseSolvedCount = 0;

      course.Sections.forEach(section => {
        section.Topics.forEach(topic => {
          courseTopicsCount++;
          totalTopics++;
          topic.Questions.forEach(q => {
            courseQuestionsCount++;
            totalQuestions++;
            if (q.Progress && q.Progress.solved) {
              courseSolvedCount++;
              solvedQuestions++;
            }
          });
        });
      });

      const percentage = courseQuestionsCount > 0 
        ? Math.round((courseSolvedCount / courseQuestionsCount) * 100) 
        : 0;

      return {
        id: course.id,
        name: course.name,
        code: course.code,
        sections: course.Sections,
        topicsCount: courseTopicsCount,
        questionsCount: courseQuestionsCount,
        solvedQuestionsCount: courseSolvedCount,
        percentage
      };
    });


    const overallPercentage = totalQuestions > 0 
      ? Math.round((solvedQuestions / totalQuestions) * 100) 
      : 0;

    // Pick dynamic quote based on calendar date of the month
    const todayIndex = new Date().getDate() % islamicQuotes.length;
    const dailyQuote = islamicQuotes[todayIndex];

    res.render('index', {
      title: 'Dashboard',
      courses: courseData,
      exams: exams,
      quote: dailyQuote,
      stats: {
        totalCourses,
        totalTopics,
        totalQuestions,
        solvedQuestions,
        overallPercentage
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};


exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).send('Course not found');
    }

    // Inject solved question states dynamically from cookies
    const solvedIds = getSolvedFromCookie(req);
    injectProgress([course], solvedIds);

    // Process section statistics
    const sections = course.Sections.map(section => {
      let totalCount = 0;
      let solvedCount = 0;

      section.Topics.forEach(topic => {
        topic.Questions.forEach(q => {
          totalCount++;
          if (q.Progress && q.Progress.solved) {
            solvedCount++;
          }
        });
      });

      const percentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

      return {
        id: section.id,
        name: section.name,
        teacherName: section.teacherName,
        totalCount,
        solvedCount,
        percentage
      };
    });

    res.render('course', {
      title: course.name,
      course: {
        id: course.id,
        name: course.name,
        Sections: sections
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getTopics = async (req, res) => {
  try {
    const { sectionId } = req.query;
    const course = await Course.findByPk(req.params.id);
    const section = await Section.findByPk(sectionId);

    if (!course || !section) {
      return res.status(404).send('Course or Section not found');
    }

    const topics = await Topic.findAll({
      where: { sectionId },
      include: [Question]
    });

    res.render('topics', {
      title: `${course.name} - Topics`,
      course,
      section,
      topics
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getQA = async (req, res) => {
  try {
    const { sec } = req.query;
    const course = await Course.findByPk(req.params.id);
    const section = await Section.findByPk(sec);

    if (!course || !section) {
      return res.status(404).send('Course or Section not found');
    }

    // Inject solved question states dynamically from cookies
    const solvedIds = getSolvedFromCookie(req);
    section.Topics.forEach(t => {
      t.Questions.forEach(q => {
        if (solvedIds.includes(q.id)) {
          q.Progress = { solved: true };
        } else {
          q.Progress = null;
        }
      });
    });

    // Process progress and parse answers
    let totalCount = 0;
    let solvedCount = 0;

    const topics = section.Topics.map(topic => {
      const questions = topic.Questions.map(q => {
        totalCount++;
        if (q.Progress && q.Progress.solved) {
          solvedCount++;
        }

        // Render Markdown to HTML and preserve original line breaks
        const parsedAnswer = marked.parse(q.answerText);

        return {
          id: q.id,
          questionText: q.questionText,
          Progress: q.Progress,
          parsedAnswer
        };
      });

      return {
        id: topic.id,
        name: topic.name,
        Questions: questions
      };
    });

    const percentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

    res.render('qa', {
      title: `${course.name} - Q&A`,
      course,
      section: {
        id: section.id,
        name: section.name,
        teacherName: section.teacherName,
        totalCount,
        solvedCount,
        percentage
      },
      topics
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { sectionId } = req.query;
    const course = await Course.findByPk(req.params.id);
    const section = await Section.findByPk(sectionId);

    if (!course || !section) {
      return res.status(404).send('Course or Section not found');
    }

    const note = await Note.findOne({ where: { sectionId } });
    let parsedContent = '';
    
    if (note) {
      parsedContent = marked.parse(note.content);
    }

    res.render('notes', {
      title: `${course.name} - Course Content`,
      course,
      section,
      note: note ? { ...note.toJSON(), parsedContent } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getSearch = async (req, res) => {
  try {
    const rawQuery = req.query.q || '';
    const query = rawQuery.trim().toLowerCase();
    if (!query) {
      return res.render('search', { title: 'Search', query: rawQuery, results: { courses: [], topics: [], questions: [] } });
    }

    const allCourses = await Course.findAll();
    const courses = allCourses.filter(c => c.name.toLowerCase().includes(query));

    const topics = [];
    const questions = [];

    allCourses.forEach(c => {
      c.Sections.forEach(s => {
        s.Topics.forEach(t => {
          if (t.name.toLowerCase().includes(query)) {
            const tCopy = JSON.parse(JSON.stringify(t));
            tCopy.Section = { ...s, Course: c };
            topics.push(tCopy);
          }

          t.Questions.forEach(q => {
            if (q.questionText.toLowerCase().includes(query) || q.answerText.toLowerCase().includes(query)) {
              const qCopy = JSON.parse(JSON.stringify(q));
              qCopy.Topic = { ...t, Section: { ...s, Course: c } };
              questions.push(qCopy);
            }
          });
        });
      });
    });

    res.render('search', {
      title: 'Search Results',
      query: rawQuery,
      results: { courses, topics, questions }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.apiSearch = async (req, res) => {
  try {
    const rawQuery = req.query.q || '';
    const query = rawQuery.trim().toLowerCase();
    if (!query) {
      return res.json({ courses: [], topics: [], questions: [] });
    }

    const allCourses = await Course.findAll();
    const courses = allCourses.filter(c => c.name.toLowerCase().includes(query)).slice(0, 5);

    const topics = [];
    const questions = [];

    for (const c of allCourses) {
      for (const s of c.Sections) {
        for (const t of s.Topics) {
          if (t.name.toLowerCase().includes(query) && topics.length < 5) {
            const tCopy = JSON.parse(JSON.stringify(t));
            tCopy.Section = { ...s, Course: c };
            topics.push(tCopy);
          }

          for (const q of t.Questions) {
            if ((q.questionText.toLowerCase().includes(query) || q.answerText.toLowerCase().includes(query)) && questions.length < 5) {
              const qCopy = JSON.parse(JSON.stringify(q));
              qCopy.Topic = { ...t, Section: { ...s, Course: c } };
              questions.push(qCopy);
            }
          }
        }
      }
    }

    res.json({ courses, topics, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
};
