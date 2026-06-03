const fs = require('fs');
const path = require('path');
const { Note, Section, Course } = require('../models');

// Paths
const EXTRACTED_DIR = path.resolve(__dirname, '..', 'extracted_raw');
const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');

// Ordered list of lectures to merge
const LECTURE_FILES = [
  { file: '1.0 Introduction and History of Plant Pathology.md', title: '1.0 Introduction and History of Plant Pathology' },
  { file: '1.1 Pathogenesis.md', title: '1.1 Pathogenesis & Infection Process' },
  { file: '1.2 Toxin.md', title: '1.2 Toxin and Host Defense' },
  { file: '1.3 Effects of Pathogens on Plant Physiological Functions.md', title: '1.3 Effects of Pathogens on Plant Physiological Functions' },
  { file: '2.1 Dessimination of the Pathogen.md', title: '2.1 Dissemination of Pathogens' },
  { file: '2.2 Epidemiology.md', title: '2.2 Epidemiology of Plant Diseases' },
  { file: '2.2 EpidemiologyIMPORTANT.md', title: '2.2 Epidemiology - Core/Important Concepts' },
  { file: '3.1 Method of Plant Disease Control.md', title: '3.1 Methods of Plant Disease Control' },
  { file: '3.2 Biological Control.md', title: '3.2 Biological Control of Plant Diseases' },
  { file: '3.3 Chemical Control.md', title: '3.3 Chemical Control & Fungicides' }
];

async function importNotes() {
  try {
    console.log('Finding Section A for Plant Pathology (3201)...');
    
    // Find Plant Pathology course
    const course = await Course.findOne({ where: { code: '3201' } });
    if (!course) {
      throw new Error('Course 3201 not found. Please seed the database first.');
    }
    
    // Find Sabiha Mam's section (Section A)
    const section = await Section.findOne({
      where: {
        courseId: course.id,
        name: 'Section A'
      }
    });
    
    if (!section) {
      throw new Error('Section A for Plant Pathology not found.');
    }
    
    console.log(`Found Section: ID ${section.id} (${section.name} - ${section.teacherName})`);
    
    // 1. Build Table of Contents
    let mergedMarkdown = `# Study Notes: Plant Pathology (3201) - Section A (Sabiha Mam)\n\n`;
    mergedMarkdown += `Welcome to your comprehensive study notes. Navigate directly to any lecture below:\n\n`;
    mergedMarkdown += `### 📂 Table of Contents\n`;
    
    LECTURE_FILES.forEach((lec, idx) => {
      const anchor = lec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      mergedMarkdown += `- [Lecture ${lec.title}](#${anchor})\n`;
    });
    
    mergedMarkdown += `\n---\n\n`;
    
    // 2. Read and append each file
    const imageRefs = [];
    
    for (const lec of LECTURE_FILES) {
      const filePath = path.join(EXTRACTED_DIR, lec.file);
      if (!fs.existsSync(filePath)) {
        console.log(`WARNING: File not found: ${lec.file}. Skipping.`);
        continue;
      }
      
      console.log(`Merging ${lec.file}...`);
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Remove the main header in the file since we will write a structured section header
      content = content.replace(/^# Course (Slides|Document):.*?\n/, '');
      
      const anchor = lec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Wrap in standard section and anchor
      mergedMarkdown += `<div id="${anchor}"></div>\n\n`;
      mergedMarkdown += `# Lecture: ${lec.title}\n\n`;
      mergedMarkdown += content;
      mergedMarkdown += `\n\n---\n\n`;
      
      // Gather any images referenced in this file's markdown
      // Match format: ![/uploads/filename]
      const imgRegex = /\/uploads\/([a-zA-Z0-9_\-\.\%\s]+\.(jpg|jpeg|png|gif|jp2))/gi;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        const decodedFilename = decodeURIComponent(match[1]);
        if (!imageRefs.includes(decodedFilename)) {
          imageRefs.push(decodedFilename);
        }
      }
    }
    
    console.log(`Total images referenced: ${imageRefs.length}`);
    
    // 3. Save to database
    // Find if note already exists
    let note = await Note.findOne({ where: { sectionId: section.id } });
    if (note) {
      console.log('Updating existing note in database...');
      note.content = mergedMarkdown;
      note.imageRefs = imageRefs;
      await note.save();
    } else {
      console.log('Creating new note in database...');
      note = await Note.create({
        sectionId: section.id,
        content: mergedMarkdown,
        imageRefs: imageRefs
      });
    }
    
    console.log(`Successfully imported notes for Section A! Database updated successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing notes:', error);
    process.exit(1);
  }
}

importNotes();
