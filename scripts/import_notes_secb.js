const fs = require('fs');
const path = require('path');
const { Note, Section, Course } = require('../models');

// Paths
const EXTRACTED_DIR = path.resolve(__dirname, '..', 'extracted_raw_secb');
const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');

// Ordered list of files to merge
const LECTURE_FILES = [
  { file: '1. Rice Diseases.md', title: '1. Rice Diseases' },
  { file: '2. Wheat Maize Barley Jute Cotton Sugarcane Groundnut.md', title: '2. Field Crop Diseases (Wheat, Maize, Barley, Jute, Cotton, Sugarcane, Groundnut)' },
  { file: '3. Rice.md', title: '3. Rice Disease Core Notes' },
  { file: '4. BarleyMaize Cotton and Jute.md', title: '4. Barley, Maize, Cotton, and Jute Core Notes' },
  { file: '5. Wheat and Pulse.md', title: '5. Wheat and Pulse Diseases Core Notes' },
  { file: '6. Sugarcane Mustard Sunflower Groundnut.md', title: '6. Sugarcane, Mustard, Sunflower, and Groundnut Core Notes' },
  { file: '7. Scientific Names.md', title: '7. Pathogen Scientific Names List' },
  { file: '8. All Disease Differences.md', title: '8. Comparative Analysis & Disease Differences' },
  { file: 'All Disease Cycles.md', title: '9. Core Disease Cycles' },
  { file: 'Disease Picture.md', title: '10. Disease Visual Identification Guide' },
  { file: 'Symptoms of Important Diseases.md', title: '11. Symptoms of Major Crop Diseases' },
  { file: 'MRI L.md', title: '12. MRI Lecture Notes' },
  { file: 'MRI Book.md', title: '13. MRI Book Excerpts & Study References' },
  { file: 'Pathology Rezaul All.md', title: '14. Consolidated Pathology Study Guide' },
  { file: 'Reazaul Final.md', title: '15. Rezaul Sir Final Review Sheets' }
];

async function importNotes() {
  try {
    console.log('Finding Section B for Plant Pathology (3201)...');
    
    // Find Plant Pathology course
    const course = await Course.findOne({ where: { code: '3201' } });
    if (!course) {
      throw new Error('Course 3201 not found. Please seed the database first.');
    }
    
    // Find Rezaul Sir's section (Section B)
    const section = await Section.findOne({
      where: {
        courseId: course.id,
        name: 'Section B'
      }
    });
    
    if (!section) {
      throw new Error('Section B for Plant Pathology not found.');
    }
    
    console.log(`Found Section: ID ${section.id} (${section.name} - ${section.teacherName})`);
    
    // 1. Build Table of Contents
    let mergedMarkdown = `# Study Notes: Plant Pathology (3201) - Section B (Rezaul Sir)\n\n`;
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
      
      // Remove the main header in the file
      content = content.replace(/^# Course (Slides|Document):.*?\n/, '');
      
      const anchor = lec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Wrap in standard section and anchor
      mergedMarkdown += `<div id="${anchor}"></div>\n\n`;
      mergedMarkdown += `# Lecture: ${lec.title}\n\n`;
      mergedMarkdown += content;
      mergedMarkdown += `\n\n---\n\n`;
      
      // Gather any images referenced in this file's markdown
      const imgRegex = /\/uploads\/([a-zA-Z0-9_\-\.\%\s]+\.(jpg|jpeg|png|gif|jp2))/gi;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        const decodedFilename = decodeURIComponent(match[1]);
        if (!imageRefs.includes(decodedFilename)) {
          imageRefs.push(decodedFilename);
        }
      }
    }
    
    console.log(`Total images referenced in Section B: ${imageRefs.length}`);
    
    // 3. Save to database
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
    
    console.log(`Successfully imported notes for Section B! Database updated successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing notes:', error);
    process.exit(1);
  }
}

importNotes();
