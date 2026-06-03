const { sequelize, Course, Section, Topic, Question, Progress, Note, Exam } = require('../models');
const fs = require('fs');
const path = require('path');

async function seed() {
  try {
    console.log('Syncing database...');
    await sequelize.sync({ force: true });
    console.log('Database synced. Seeding database with actual academic structures...');

    // Ensure uploads directory exists
    const uploadsDir = path.resolve(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // ==========================================
    // 1. Create the 5 Actual Courses
    // ==========================================
    const c1 = await Course.create({ name: 'Plant Pathology', code: '3201' });
    const c2 = await Course.create({ name: 'Crop Ecology', code: '3203' });
    const c3 = await Course.create({ name: 'Research Methodology', code: '3255' });
    const c4 = await Course.create({ name: 'Olericulture', code: '3207' });
    const c5 = await Course.create({ name: 'Extension', code: '3205' });

    // ==========================================
    // 2. Create Sections with Instructors
    // ==========================================
    // Course 1
    const c1SecA = await Section.create({ courseId: c1.id, name: 'Section A', teacherName: 'Sabiha Mam' });
    const c1SecB = await Section.create({ courseId: c1.id, name: 'Section B', teacherName: 'Rezaul Sir' });
    
    // Course 2
    const c2SecA = await Section.create({ courseId: c2.id, name: 'Section A', teacherName: 'Debesh Sir' });
    const c2SecB = await Section.create({ courseId: c2.id, name: 'Section B', teacherName: 'Sarwar Sir' });

    // Course 3
    const c3SecA = await Section.create({ courseId: c3.id, name: 'Section A', teacherName: 'Mannan Sir' });
    const c3SecB = await Section.create({ courseId: c3.id, name: 'Section B', teacherName: 'Sarwar Sir' });

    // Course 4
    const c4SecA = await Section.create({ courseId: c4.id, name: 'Section A', teacherName: 'Mannan Sir' });
    const c4SecB = await Section.create({ courseId: c4.id, name: 'Section B', teacherName: 'Yamin Sir' });

    // Course 5
    const c5SecA = await Section.create({ courseId: c5.id, name: 'Section A', teacherName: 'Matiul Sir' });
    const c5SecB = await Section.create({ courseId: c5.id, name: 'Section B', teacherName: 'Bashir Sir' });

    // ==========================================
    // 3. Create Exam Routine
    // ==========================================
    await Exam.create({ subjectName: 'Plant Pathology (3201)', examDate: new Date('2026-06-09T10:00:00') });
    await Exam.create({ subjectName: 'Crop Ecology (3203)', examDate: new Date('2026-06-14T10:00:00') });
    await Exam.create({ subjectName: 'Research Methodology (3255)', examDate: new Date('2026-06-21T10:00:00') });
    await Exam.create({ subjectName: 'Olericulture (3207)', examDate: new Date('2026-06-28T10:00:00') });
    await Exam.create({ subjectName: 'Extension (3205)', examDate: new Date('2026-07-02T10:00:00') });


    // ==========================================
    // 4. Seed Mock Data for Plant Pathology Section A (For initial testing)
    // ==========================================
    const tIntro = await Topic.create({ sectionId: c1SecA.id, name: 'Introduction to Plant Pathogens' });
    const tFungi = await Topic.create({ sectionId: c1SecA.id, name: 'Fungal Plant Diseases' });

    const q1 = await Question.create({
      topicId: tIntro.id,
      questionText: 'Define Plant Pathology and list the major classification of plant pathogens.',
      answerText: `Plant Pathology (Phytopathology) is the scientific study of diseases in plants caused by pathogens (infectious organisms) and environmental factors (physiological factors).

### Major Classes of Plant Pathogens:
* **Fungi:** Responsible for the majority of infectious plant diseases (e.g., Rust, Smut).
* **Bacteria:** Single-celled prokaryotes (e.g., Bacterial leaf blight).
* **Viruses:** Sub-microscopic entities (e.g., Tobacco Mosaic Virus).
* **Nematodes:** Microscopic roundworms (e.g., Root-knot nematodes).

Here is a quick summary of pathogens:

| Pathogen Class | Cellular Structure | Primary Mode of Dissemination |
| :--- | :--- | :--- |
| **Fungi** | Eukaryotic | Spores (Wind/Water) |
| **Bacteria** | Prokaryotic | Water splash, vectors |
| **Viruses** | Non-cellular | Insects (vectors), mechanical |`
    });

    const q2 = await Question.create({
      topicId: tFungi.id,
      questionText: 'Explain the Disease Triangle concept in Plant Pathology.',
      answerText: `The **Disease Triangle** is a fundamental concept in plant pathology. It states that infectious disease is result of three essential components interacting over time:

1. **Susceptible Host:** The plant must be in a condition that allows infection.
2. **Virulent Pathogen:** The organism must be active and capable of causing disease.
3. **Conducive Environment:** Environmental conditions (temp, humidity) must favor the pathogen.

*Note:* If any of these three factors is missing or minimized, disease will not occur.`
    });

    // Create progress rows for Course 1 Section A mock questions
    await Progress.create({ questionId: q1.id, solved: false });
    await Progress.create({ questionId: q2.id, solved: false });

    // Seed notes for Course 1 Section A
    await Note.create({
      sectionId: c1SecA.id,
      content: `# Course Study Notes: Plant Pathology (3201)
      
Welcome to the study vault for Plant Pathology (Section A - Sabiha Mam).

## Section 1: History & Introduction
Plant diseases have shaped human history, notably the Irish Potato Famine in the 1840s caused by the oomycete *Phytophthora infestans*.

### Symptoms vs. Signs:
- **Symptom:** The host plant's reaction to the pathogen (e.g., wilting, leaf spots, chlorosis).
- **Sign:** The physical structures of the pathogen itself (e.g., fungal mycelium, bacterial ooze, spores).

---

## Section 2: Fungal Pathogenesis

Fungi infect plants using specialized structures:
- **Appressorium:** A swollen structure that exerts mechanical pressure to penetrate host cells.
- **Haustorium:** A specialized branch inside plant cells that absorbs nutrients without killing the cell.`,
      imageRefs: []
    });

    // ==========================================
    // 5. Seed Placeholders for other courses
    // ==========================================
    const placeholderCourses = [
      { section: c1SecB, name: 'Plant Pathology', code: '3201', teacher: 'Rezaul Sir' },
      { section: c2SecA, name: 'Crop Ecology', code: '3203', teacher: 'Debesh Sir' },
      { section: c2SecB, name: 'Crop Ecology', code: '3203', teacher: 'Sarwar Sir' },
      { section: c3SecA, name: 'Research Methodology', code: '3255', teacher: 'Mannan Sir' },
      { section: c3SecB, name: 'Research Methodology', code: '3255', teacher: 'Sarwar Sir' },
      { section: c4SecA, name: 'Olericulture', code: '3207', teacher: 'Mannan Sir' },
      { section: c4SecB, name: 'Olericulture', code: '3207', teacher: 'Yamin Sir' },
      { section: c5SecA, name: 'Extension', code: '3205', teacher: 'Matiul Sir' },
      { section: c5SecB, name: 'Extension', code: '3205', teacher: 'Bashir Sir' },
    ];

    for (const p of placeholderCourses) {
      // Seed default welcoming note shell
      await Note.create({
        sectionId: p.section.id,
        content: `# Study Notes: ${p.name} (${p.code})
        
Notes for **${p.section.name}** taught by **${p.teacher}** will appear here.

Once you upload the slides or PDFs, I will extract, structure, and seed the notes into this shell.`,
        imageRefs: []
      });

      // Seed default topic & welcome question
      const defaultTopic = await Topic.create({ sectionId: p.section.id, name: 'Course Orientation' });
      const defaultQ = await Question.create({
        topicId: defaultTopic.id,
        questionText: 'When will study questions be uploaded?',
        answerText: `Questions & Answers for **${p.name}** taught by **${p.teacher}** will appear here once you provide slides and exam pictures in Phase 2.`
      });
      await Progress.create({ questionId: defaultQ.id, solved: false });
    }

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seed();
