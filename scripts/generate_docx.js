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

const subTopicOrders = {
  // Section B
  47: ['General & Diagnostic Questions', 'Blast Disease', 'Brown Spot', 'Bacterial Leaf Blight (BLB)', 'Stem Rot', 'Bakanae Disease', 'Sheath Blight', 'False Smut', 'Nematode & Ufra Diseases', 'Tungro Virus Disease'],
  48: ['General & Minor Diseases', 'Smut Diseases (Loose & Covered)', 'Bipolaris Spot/Blotch', 'Rust of Wheat'],
  49: ['General Sugarcane Diseases', 'Red Rot of Sugarcane', 'Smut of Sugarcane', 'Sugarcane Mosaic'],
  50: ['General Jute & Cotton Diseases', 'Stem Rot vs Black Band (Comparison)', 'Stem Rot', 'Black Band of Jute', 'Anthracnose', 'Angular Leaf Spot of Cotton'],
  51: ['General Pulse & Oilseed Diseases', 'Tikka Disease of Groundnut', 'Alternaria Blight of Mustard', 'Mungbean Mosaic', 'Sunflower Leaf Spot & Rust'],
  
  // Section A
  40: ['Core Terminology & Concepts', 'Koch\'s Postulates', 'Parasite Classifications (Biotrophs/Necrotrophs)'],
  41: ['Inoculation & Infection Court', 'Direct Penetration Mechanisms', 'Indirect Penetration (Natural Openings/Wounds)', 'Direct vs Indirect Penetration', 'General Pathogenesis Phases'],
  42: ['Toxin Classifications (Host-Specific vs Non-Specific)', 'Host-Specific Toxins', 'Non-Specific Toxins', 'General Role of Toxins'],
  43: ['General Physiological Disturbances', 'Effect on Respiration', 'Effect on Photosynthesis', 'Translocation & Water Relations'],
  44: ['Passive & Active Dissemination', 'Dissemination by Wind', 'Dissemination by Water', 'Dissemination by Vectors & Animals'],
  45: ['The Disease Triangle & Tetrahedron', 'Epiphytotic Development Factors', 'Disease Forecasting', 'Epidemiological Parameters'],
  46: ['General Principles & Integrated Management', 'Exclusion (Quarantine & Inspection)', 'Eradication (Sanitation & Physical Control)', 'Protection (Chemical & Physical Barriers)', 'Immunization & Host Resistance']
};

function getSubTopic(questionText, topicId) {
  const text = questionText.toLowerCase();
  
  // SECTION B (Topic IDs 47, 48, 49, 50, 51)
  if (topicId === 47) { // Rice Diseases
    if (text.includes('blast')) return 'Blast Disease';
    if (text.includes('brown spot')) return 'Brown Spot';
    if (text.includes('bacterial leaf blight') || text.includes('blb') || text.includes('streak')) return 'Bacterial Leaf Blight (BLB)';
    if (text.includes('stem rot')) return 'Stem Rot';
    if (text.includes('bakanae')) return 'Bakanae Disease';
    if (text.includes('ufra') || text.includes('nemic') || text.includes('nematode')) return 'Nematode & Ufra Diseases';
    if (text.includes('tungro')) return 'Tungro Virus Disease';
    if (text.includes('sheath blight')) return 'Sheath Blight';
    if (text.includes('false smut')) return 'False Smut';
    return 'General & Diagnostic Questions';
  }
  if (topicId === 48) { // Wheat & Barley
    if (text.includes('loose smut') || text.includes('covered smut') || text.includes('smut')) return 'Smut Diseases (Loose & Covered)';
    if (text.includes('bipolaris') || text.includes('blotch')) return 'Bipolaris Spot/Blotch';
    if (text.includes('rust')) return 'Rust of Wheat';
    return 'General & Minor Diseases';
  }
  if (topicId === 49) { // Sugarcane
    if (text.includes('red rot')) return 'Red Rot of Sugarcane';
    if (text.includes('smut')) return 'Smut of Sugarcane';
    if (text.includes('mosaic') || text.includes('virus')) return 'Sugarcane Mosaic';
    return 'General Sugarcane Diseases';
  }
  if (topicId === 50) { // Jute & Cotton
    if (text.includes('stem rot') && text.includes('black band')) return 'Stem Rot vs Black Band (Comparison)';
    if (text.includes('stem rot')) return 'Stem Rot';
    if (text.includes('black band')) return 'Black Band of Jute';
    if (text.includes('anthracnose')) return 'Anthracnose';
    if (text.includes('angular') || text.includes('cotton')) return 'Angular Leaf Spot of Cotton';
    return 'General Jute & Cotton Diseases';
  }
  if (topicId === 51) { // Pulse & Oilseed
    if (text.includes('tikka') || text.includes('groundnut')) return 'Tikka Disease of Groundnut';
    if (text.includes('alternaria') || text.includes('mustard')) return 'Alternaria Blight of Mustard';
    if (text.includes('mungbean') || text.includes('mosaic')) return 'Mungbean Mosaic';
    if (text.includes('sunflower') || text.includes('rust')) return 'Sunflower Leaf Spot & Rust';
    return 'General Pulse & Oilseed Diseases';
  }

  // SECTION A (Topic IDs 40, 41, 42, 43, 44, 45, 46)
  if (topicId === 40) { // Introduction & Pathogenicity
    if (text.includes('kochs') || text.includes('koch\'s') || text.includes('postulates')) return 'Koch\'s Postulates';
    if (text.includes('biotroph') || text.includes('necrotroph') || text.includes('parasite')) return 'Parasite Classifications (Biotrophs/Necrotrophs)';
    return 'Core Terminology & Concepts';
  }
  if (topicId === 41) { // Pathogenesis & Direct Penetration
    if (text.includes('direct') && (text.includes('indirect') || text.includes('natural') || text.includes('opening'))) return 'Direct vs Indirect Penetration';
    if (text.includes('stomata') || text.includes('lenticel') || text.includes('hydathode') || text.includes('opening') || text.includes('wound')) return 'Indirect Penetration (Natural Openings/Wounds)';
    if (text.includes('direct') || text.includes('appressorium') || text.includes('penetration peg')) return 'Direct Penetration Mechanisms';
    if (text.includes('inocul') || text.includes('infection court') || text.includes('germination')) return 'Inoculation & Infection Court';
    return 'General Pathogenesis Phases';
  }
  if (topicId === 42) { // Toxins in Disease Development
    if (text.includes('difference') || text.includes('distinguish') || text.includes('host-specific') && text.includes('non-specific')) return 'Toxin Classifications (Host-Specific vs Non-Specific)';
    if (text.includes('tentoxin') || text.includes('tabtoxin') || text.includes('wildfire') || text.includes('wild-fire') || text.includes('phaseolotoxin')) return 'Non-Specific Toxins';
    if (text.includes('victorin') || text.includes('hv-toxin') || text.includes('t-toxin') || text.includes('hmt')) return 'Host-Specific Toxins';
    return 'General Role of Toxins';
  }
  if (topicId === 43) { // Pathophysiology
    if (text.includes('respiration')) return 'Effect on Respiration';
    if (text.includes('photosynthesis') || text.includes('chlorophyll')) return 'Effect on Photosynthesis';
    if (text.includes('translocation') || text.includes('water') || text.includes('wilt') || text.includes('xylem')) return 'Translocation & Water Relations';
    return 'General Physiological Disturbances';
  }
  if (topicId === 44) { // Dissemination of Pathogens
    if (text.includes('wind') || text.includes('anemochory')) return 'Dissemination by Wind';
    if (text.includes('water') || text.includes('hydrochory')) return 'Dissemination by Water';
    if (text.includes('vector') || text.includes('insect') || text.includes('animal') || text.includes('zoochory')) return 'Dissemination by Vectors & Animals';
    return 'Passive & Active Dissemination';
  }
  if (topicId === 45) { // Disease Triangle
    if (text.includes('forecasting') || text.includes('forecast')) return 'Disease Forecasting';
    if (text.includes('epiphytotics') || text.includes('epiphytotic') || text.includes('outbreak') || text.includes('epidemic')) return 'Epiphytotic Development Factors';
    if (text.includes('triangle') || text.includes('tetrahedron')) return 'The Disease Triangle & Tetrahedron';
    return 'Epidemiological Parameters';
  }
  if (topicId === 46) { // Principles of Disease Control
    if (text.includes('quarantine') || text.includes('exclusion') || text.includes('legislation')) return 'Exclusion (Quarantine & Inspection)';
    if (text.includes('sanitation') || text.includes('eradication') || text.includes('crop rotation') || text.includes('heat') || text.includes('physical')) return 'Eradication (Sanitation & Physical Control)';
    if (text.includes('chemical') || text.includes('spray') || text.includes('fungicide') || text.includes('protection')) return 'Protection (Chemical & Physical Barriers)';
    if (text.includes('immun') || text.includes('resistance') || text.includes('tolerance') || text.includes('genetic')) return 'Immunization & Host Resistance';
    return 'General Principles & Integrated Management';
  }

  return 'General';
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

      // Group questions by sub-topic
      const grouped = {};
      deduplicatedQuestions.forEach(q => {
        const subTopic = getSubTopic(q.questionText, topic.id);
        if (!grouped[subTopic]) {
          grouped[subTopic] = [];
        }
        grouped[subTopic].push(q);
      });

      // Get sorted sub-topics list
      const subTopicsInTopic = Object.keys(grouped);
      const definedOrder = subTopicOrders[topic.id] || [];
      subTopicsInTopic.sort((a, b) => {
        const idxA = definedOrder.indexOf(a);
        const idxB = definedOrder.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });

      let topicQIdx = 0;
      subTopicsInTopic.forEach(subTopic => {
        const questionsInSub = grouped[subTopic];
        if (questionsInSub.length === 0) return;

        // Render sub-topic heading only if there are multiple sub-topics,
        // and if it's not a generic "General" sub-topic.
        const showSubHeading = (subTopicsInTopic.length > 1) && 
                               (subTopic !== 'General' && 
                                subTopic !== 'General Questions' && 
                                subTopic !== 'General Sugarcane Diseases' && 
                                subTopic !== 'General Jute & Cotton Diseases' && 
                                subTopic !== 'General Pulse & Oilseed Diseases' && 
                                subTopic !== 'General & Minor Diseases');

        if (showSubHeading) {
          docChildren.push(new Paragraph({
            children: [
              new TextRun({
                text: `✦ ${subTopic}`,
                bold: true,
                color: "4F46E5", // Indigo-600
                size: 24 // 12pt
              })
            ],
            spacing: { before: 200, after: 100 }
          }));
        }

        questionsInSub.forEach((q) => {
          questionCount++;
          topicQIdx++;
          
          // Clean Question Text from any markdown backticks
          const cleanQuestionText = q.questionText.replace(/`/g, '');

          // Question Header
          docChildren.push(new Paragraph({
            children: [
              new TextRun({
                text: `Q${topicQIdx}. ${cleanQuestionText}`,
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
