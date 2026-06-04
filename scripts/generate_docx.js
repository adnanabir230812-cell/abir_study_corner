const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');

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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle Tables
    if (line.startsWith('|')) {
      inTable = true;
      // Skip markdown separator lines like |---|---|
      if (line.includes('---') || line.includes(':---')) {
        continue;
      }
      
      const cols = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      
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

    if (!line) {
      // Empty line, add a tiny space
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        text: line.replace('# ', ''),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 }
      }));
    } else if (line.startsWith('## ')) {
      children.push(new Paragraph({
        text: line.replace('## ', ''),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 80 }
      }));
    } else if (line.startsWith('### ')) {
      children.push(new Paragraph({
        text: line.replace('### ', ''),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 150, after: 60 }
      }));
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      // Bullet lists
      const text = line.substring(2);
      const runs = parseInlineFormatting(text);
      children.push(new Paragraph({
        children: runs,
        bullet: { level: 0 },
        spacing: { after: 100 }
      }));
    } else if (/^\d+\.\s/.test(line)) {
      // Numbered lists
      const text = line.replace(/^\d+\.\s/, '');
      const runs = parseInlineFormatting(text);
      children.push(new Paragraph({
        children: runs,
        numbering: { reference: "num-list", level: 0 },
        spacing: { after: 100 }
      }));
    } else {
      // Standard paragraph
      const runs = parseInlineFormatting(line);
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
            text: `Previous Year Questions Compilation\n`,
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

      let courseQuestionCount = 0;

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

          topic.Questions.forEach((q, idx) => {
            courseQuestionCount++;
            
            // Question Header
            docChildren.push(new Paragraph({
              children: [
                new TextRun({
                  text: `Q${idx + 1}. ${q.questionText}`,
                  bold: true,
                  color: "1E3A8A", // Indigo-900 / Dark blue
                  size: 26 // 13pt
                })
              ],
              spacing: { before: 200, after: 100 }
            }));

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

      const filename = `course_${course.id}.docx`;
      const outputPath = path.join(downloadsDir, filename);

      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(outputPath, buffer);
      console.log(`Generated styled Word document for ${course.name}: ${filename} (${courseQuestionCount} questions)`);
    }

    console.log('All course Word documents generated successfully!');
  } catch (err) {
    console.error('Failed to generate Word documents:', err);
  }
}

generateAllDocx();
