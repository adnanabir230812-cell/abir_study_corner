const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } = require('docx');

const dbPath = path.join(__dirname, '..', 'database.json');
const downloadsDir = path.join(__dirname, '..', 'public', 'downloads');

// Ensure downloads directory exists
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Simple Markdown to docx elements parser
function parseMarkdownToDocx(mdText) {
  const children = [];
  const lines = mdText.split(/\r?\n/);
  
  let currentTableRows = [];
  let inTable = false;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Handle Code Blocks (e.g. diagrams enclosed in ```)
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      // In a code block, preserve layout using Consolas (monospaced)
      children.push(new Paragraph({
        children: [
          new TextRun({
            text: line, // Preserve original spacing/indentation
            font: "Consolas",
            size: 18 // 9pt to avoid line-wrap breakage
          })
        ],
        spacing: { after: 40 }
      }));
      continue;
    }

    // Handle Tables
    if (trimmed.startsWith('|')) {
      inTable = true;
      // Skip markdown separator lines like |---|---|
      if (trimmed.includes('---') || trimmed.includes(':---')) {
        continue;
      }
      
      const cols = trimmed.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      const tableCells = cols.map(colText => {
        // Parse bold markers inside table cell
        const runs = parseInlineFormatting(colText);
        return new TableCell({
          children: [new Paragraph({ children: runs })],
          width: { size: 100 / cols.length, type: WidthType.PERCENTAGE }
        });
      });
      
      currentTableRows.push(new TableRow({ children: tableCells }));
      continue;
    } else {
      if (inTable) {
        // Flush table
        if (currentTableRows.length > 0) {
          children.push(new Table({
            rows: currentTableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          }));
          children.push(new Paragraph({ text: "" })); // spacer
          currentTableRows = [];
        }
        inTable = false;
      }
    }

    if (!trimmed) {
      // Empty line
      continue;
    }

    // Headers
    if (trimmed.startsWith('# ')) {
      children.push(new Paragraph({
        text: trimmed.replace('# ', ''),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 }
      }));
    } else if (trimmed.startsWith('## ')) {
      children.push(new Paragraph({
        text: trimmed.replace('## ', ''),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 80 }
      }));
    } else if (trimmed.startsWith('### ')) {
      children.push(new Paragraph({
        text: trimmed.replace('### ', ''),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 150, after: 60 }
      }));
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      // Bullet lists
      const text = trimmed.substring(2);
      const runs = parseInlineFormatting(text);
      children.push(new Paragraph({
        children: runs,
        bullet: { level: 0 },
        spacing: { after: 100 }
      }));
    } else if (/^\d+\.\s/.test(trimmed)) {
      // Numbered lists
      const text = trimmed.replace(/^\d+\.\s/, '');
      const runs = parseInlineFormatting(text);
      children.push(new Paragraph({
        children: runs,
        numbering: { reference: "num-list", level: 0 },
        spacing: { after: 100 }
      }));
    } else {
      // Standard paragraph
      const runs = parseInlineFormatting(trimmed);
      children.push(new Paragraph({
        children: runs,
        spacing: { after: 120 }
      }));
    }
  }

  // Handle remaining table rows
  if (inTable && currentTableRows.length > 0) {
    children.push(new Table({
      rows: currentTableRows,
      width: { size: 100, type: WidthType.PERCENTAGE }
    }));
  }

  return children;
}

// Simple inline formatting parser (bold '**', blockquote/notes '>')
function parseInlineFormatting(text) {
  const runs = [];
  
  // Clean blockquote indicator if present
  let cleanText = text;
  let isItalic = false;
  if (cleanText.startsWith('>')) {
    cleanText = cleanText.replace(/^>\s*/, '');
    isItalic = true;
  }
  
  // Parse **bold** tags
  const parts = cleanText.split('**');
  for (let i = 0; i < parts.length; i++) {
    const isBold = (i % 2 === 1);
    let partText = parts[i];
    
    // Clean remaining simple Markdown markers if any (like `code`)
    partText = partText.replace(/`/g, '');
    
    if (partText) {
      runs.push(new TextRun({
        text: partText,
        bold: isBold,
        italics: isItalic,
        font: "Calibri",
        size: 24 // 12pt
      }));
    }
  }
  
  if (runs.length === 0) {
    runs.push(new TextRun({ text: "" }));
  }
  
  return runs;
}

function deduplicateQuestions(questions) {
  const unique = [];
  const map = new Map();

  questions.forEach(q => {
    // 1. Find all bracketed text
    const tags = [];
    const rx = /\[([^\]]+)\]/g;
    let match;
    while ((match = rx.exec(q.questionText)) !== null) {
      tags.push(match[1]);
    }

    // 2. Clean question text of any brackets and extra spaces
    let cleanText = q.questionText.replace(/\[[^\]]+\]/g, '').trim();
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    // 3. Normalize for matching
    const normalized = cleanText.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

    if (map.has(normalized)) {
      const existing = map.get(normalized);
      existing.count += 1;
      existing.tags.push(...tags);
      // Merge answer text if existing doesn't have it but this one does
      if (!existing.answerText && q.answerText) {
        existing.answerText = q.answerText;
      }
    } else {
      const entry = {
        ...q,
        cleanText,
        tags,
        count: 1
      };
      map.set(normalized, entry);
      unique.push(entry);
    }
  });

  // Re-build final question text for each unique question
  return unique.map(item => {
    // Merge and deduplicate tags
    let mergedTags = [];
    item.tags.forEach(tagGroup => {
      const parts = tagGroup.split(/[,;]/);
      parts.forEach(p => {
        const cleaned = p.trim();
        // Skip tags that are just "Repeated x..."
        if (cleaned && !cleaned.toLowerCase().includes('repeated') && !mergedTags.includes(cleaned)) {
          mergedTags.push(cleaned);
        }
      });
    });

    let finalQuestionText = item.cleanText;
    if (mergedTags.length > 0) {
      finalQuestionText += ` [${mergedTags.join(', ')}]`;
    }
    if (item.count > 1) {
      finalQuestionText += ` (x${item.count})`;
    }

    return {
      ...item,
      questionText: finalQuestionText
    };
  });
}

// Course Document Generator
async function generateDocxForCourse(course, includeAnswers) {
  const docChildren = [];

  // 1. Cover Page Title
  docChildren.push(new Paragraph({
    text: course.name.toUpperCase(),
    heading: HeadingLevel.TITLE,
    alignment: "center",
    spacing: { before: 800, after: 200 }
  }));

  // Course Code Subtitle
  docChildren.push(new Paragraph({
    children: [
      new TextRun({
        text: `Course Code: ${course.code}\n`,
        bold: true,
        size: 28,
        color: "4B5563"
      }),
      new TextRun({
        text: includeAnswers ? `Previous Year Questions with Solutions\n` : `Previous Year Questions Compilation\n`,
        italics: true,
        size: 24,
        color: "6B7280"
      }),
      new TextRun({
        text: `Generated by Abir's Study Corner\n`,
        size: 20,
        color: "9CA3AF"
      })
    ],
    alignment: "center",
    spacing: { after: 1200 }
  }));

  // Page Break/Separator
  docChildren.push(new Paragraph({
    text: "--------------------------------------------------------------------------------",
    alignment: "center",
    spacing: { after: 400 }
  }));

  let questionCount = 0;

  // 2. Add content by sections and topics
  course.Sections.forEach(section => {
    docChildren.push(new Paragraph({
      text: `SECTION: ${section.name} (Instructor: ${section.teacherName || 'N/A'})`,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    }));

    section.Topics.forEach(topic => {
      docChildren.push(new Paragraph({
        text: `Topic: ${topic.name}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 }
      }));

      const deduplicatedQuestions = deduplicateQuestions(topic.Questions);
      deduplicatedQuestions.forEach((q, idx) => {
        questionCount++;
        
        // Clean Question Text from any markdown backticks
        const cleanQuestionText = q.questionText.replace(/`/g, '');

        // Question Header
        docChildren.push(new Paragraph({
          children: [
            new TextRun({
              text: `Q${idx + 1}. ${cleanQuestionText}`,
              bold: true,
              color: "1E3A8A", // Indigo-900 / Dark blue
              size: 26 // 13pt
            })
          ],
          spacing: { before: 200, after: 100 }
        }));

        if (includeAnswers) {
          // Question Answer Body
          if (q.answerText) {
            const parsedAns = parseMarkdownToDocx(q.answerText);
            docChildren.push(...parsedAns);
          } else {
            docChildren.push(new Paragraph({
              text: "No solution uploaded yet.",
              italics: true,
              spacing: { after: 100 }
            }));
          }
        }

        // Separator between questions
        docChildren.push(new Paragraph({
          text: "",
          spacing: { after: 200 }
        }));
      });
    });
  });

  // 3. Package and Save Document
  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren
    }]
  });

  const suffix = includeAnswers ? 'solve' : 'questions';
  const filename = `course_${course.id}_${suffix}.docx`;
  const outputPath = path.join(downloadsDir, filename);

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated styled Word document for ${course.name} [${suffix}]: ${filename} (${questionCount} questions)`);
}

// Main generation function
async function generateAllDocx() {
  try {
    if (!fs.existsSync(dbPath)) {
      console.error('database.json not found!');
      return;
    }
    
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log(`Starting Word document generation for ${db.courses.length} courses...`);

    for (const course of db.courses) {
      // Generate questions only file
      await generateDocxForCourse(course, false);
      // Generate questions with solved answers file
      await generateDocxForCourse(course, true);
    }

    console.log('All course Word documents generated successfully!');
  } catch (err) {
    console.error('Failed to generate Word documents:', err);
  }
}

generateAllDocx();
