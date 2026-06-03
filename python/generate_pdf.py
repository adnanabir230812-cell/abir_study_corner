# /// script
# dependencies = [
#   "reportlab",
# ]
# ///

import os
import sys
import sqlite3
import json
import re
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether
from reportlab.lib import colors
from reportlab.pdfgen import canvas

# --- Numbered Canvas for Headers and Footers ---
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Skip cover page
            
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#4f46e5")) # Indigo 600
        
        # Header
        self.drawString(54, 755, "TOPPR PERSONAL STUDY VAULT")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b")) # Slate 500
        self.drawRightString(558, 755, datetime.now().strftime("%Y-%m-%d"))
        
        self.setStrokeColor(colors.HexColor("#cbd5e1")) # Slate 200
        self.setLineWidth(0.5)
        self.line(54, 748, 558, 748)
        
        # Footer
        self.line(54, 52, 558, 52)
        self.drawString(54, 40, "📖 Source: Original Course Content")
        
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 40, page_text)
        
        self.restoreState()


# --- Simple Markdown to ReportLab Flowables Converter ---
def clean_markdown_inline(text):
    # Escape HTML tags for reportlab Paragraph compatibility except a few basic ones
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # Restore standard formatting tags
    text = re.sub(r'\\lt;', '<', text)
    text = re.sub(r'\\gt;', '>', text)
    
    # Bold: **text** -> <b>text</b>
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    # Italics: *text* -> <i>text</i>
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    # Inline code: `code` -> <font name="Courier">\1</font>
    text = re.sub(r'`(.*?)`', r'<font name="Courier" color="#4f46e5"><b>\1</b></font>', text)
    # Math equations $eq$ -> <i>eq</i>
    text = re.sub(r'\$(.*?)\$', r'<i>\1</i>', text)
    return text

def parse_markdown_to_flowables(markdown_text, styles, uploads_dir):
    flowables = []
    lines = markdown_text.split('\n')
    
    in_table = False
    table_rows = []
    
    in_code_block = False
    code_content = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # 1. Handle Code Blocks
        if stripped.startswith('```'):
            if in_code_block:
                in_code_block = False
                code_text = '\n'.join(code_content).replace("<", "&lt;").replace(">", "&gt;")
                code_style = ParagraphStyle(
                    'CodeBlock',
                    parent=styles['Code'],
                    fontName='Courier',
                    fontSize=8.5,
                    leading=11,
                    textColor=colors.HexColor("#0f172a"),
                    backColor=colors.HexColor("#f8fafc"),
                    borderPadding=6,
                    borderRadius=4,
                    borderWidth=0.5,
                    borderColor=colors.HexColor("#e2e8f0")
                )
                flowables.append(Paragraph(f"<pre>{code_text}</pre>", code_style))
                flowables.append(Spacer(1, 10))
                code_content = []
            else:
                in_code_block = True
            i += 1
            continue
            
        if in_code_block:
            code_content.append(line)
            i += 1
            continue
            
        # 2. Handle Tables
        if stripped.startswith('|'):
            in_table = True
            # Split and clean table cells
            cells = [clean_markdown_inline(cell.strip()) for cell in line.split('|')[1:-1]]
            
            # Check if this is a separator row (e.g., |:---|:---:|)
            is_separator = all(re.match(r'^:?-+:?$', cell) for cell in cells) if cells else False
            if not is_separator:
                table_rows.append(cells)
            i += 1
            continue
        elif in_table:
            # End of table block reached
            if table_rows:
                # Construct ReportLab Table
                col_count = len(table_rows[0]) if table_rows[0] else 0
                if col_count > 0:
                    col_width = 504.0 / col_count  # Page width inside margins is 504 pt
                    col_widths = [col_width] * col_count
                    
                    # Wrap each cell in a Paragraph to allow autowrap
                    table_data = []
                    for row_idx, r in enumerate(table_rows):
                        wrapped_row = []
                        for c_idx, cell in enumerate(r):
                            cell_style = styles['Normal']
                            if row_idx == 0:
                                # Table Header style
                                cell_style = ParagraphStyle('TH', parent=styles['Normal'], fontName='Helvetica-Bold', textColor=colors.HexColor("#1e293b"))
                            wrapped_row.append(Paragraph(cell, cell_style))
                        table_data.append(wrapped_row)
                    
                    t = Table(table_data, colWidths=col_widths)
                    t.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#1e293b")),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                        ('TOPPADDING', (0, 0), (-1, -1), 6),
                        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                    ]))
                    flowables.append(t)
                    flowables.append(Spacer(1, 12))
            
            in_table = False
            table_rows = []
            # Do not increment i, let current line be reprocessed

        # 3. Handle Headings
        if stripped.startswith('# '):
            heading_text = clean_markdown_inline(stripped[2:])
            flowables.append(Paragraph(heading_text, styles['Heading1']))
            flowables.append(Spacer(1, 6))
            i += 1
            continue
        elif stripped.startswith('## '):
            heading_text = clean_markdown_inline(stripped[3:])
            flowables.append(Paragraph(heading_text, styles['Heading2']))
            flowables.append(Spacer(1, 6))
            i += 1
            continue
        elif stripped.startswith('### '):
            heading_text = clean_markdown_inline(stripped[4:])
            flowables.append(Paragraph(heading_text, styles['Heading3']))
            flowables.append(Spacer(1, 4))
            i += 1
            continue

        # 4. Handle Lists (Bullet Points)
        if stripped.startswith('* ') or stripped.startswith('- '):
            bullet_text = clean_markdown_inline(stripped[2:])
            bullet_style = ParagraphStyle(
                'BulletStyle',
                parent=styles['Normal'],
                leftIndent=15,
                firstLineIndent=-10
            )
            flowables.append(Paragraph(f"&bull; {bullet_text}", bullet_style))
            flowables.append(Spacer(1, 3))
            i += 1
            continue

        # 5. Handle Ordered Lists
        match_ol = re.match(r'^(\d+)\.\s+(.*)$', stripped)
        if match_ol:
            num = match_ol.group(1)
            ol_text = clean_markdown_inline(match_ol.group(2))
            ol_style = ParagraphStyle(
                'OlStyle',
                parent=styles['Normal'],
                leftIndent=15,
                firstLineIndent=-10
            )
            flowables.append(Paragraph(f"{num}. {ol_text}", ol_style))
            flowables.append(Spacer(1, 3))
            i += 1
            continue

        # 6. Handle Images
        match_img = re.search(r'!\[.*?\]\((.*?)\)', stripped)
        if match_img:
            img_filename = match_img.group(1)
            img_path = os.path.join(uploads_dir, img_filename)
            if os.path.exists(img_path):
                try:
                    # Let's scale the image to fit the page (width 400 max)
                    img = Image(img_path)
                    img.drawWidth = 400
                    # Maintain ratio
                    ratio = img.imageHeight / img.imageWidth
                    img.drawHeight = 400 * ratio
                    img.hAlign = 'CENTER'
                    flowables.append(img)
                    flowables.append(Spacer(1, 10))
                except Exception as e:
                    flowables.append(Paragraph(f"[Image load error: {img_filename}]", styles['Normal']))
            else:
                flowables.append(Paragraph(f"[Image not found: {img_filename}]", styles['Normal']))
            i += 1
            continue

        # 7. Standard Paragraphs
        if stripped:
            para_text = clean_markdown_inline(stripped)
            flowables.append(Paragraph(para_text, styles['BodyText']))
            flowables.append(Spacer(1, 6))
        
        i += 1

    # Cleanup in case file ends while parsing table
    if in_table and table_rows:
        col_count = len(table_rows[0]) if table_rows[0] else 0
        if col_count > 0:
            col_width = 504.0 / col_count
            col_widths = [col_width] * col_count
            table_data = [[Paragraph(cell, styles['Normal']) for cell in row] for row in table_rows]
            t = Table(table_data, colWidths=col_widths)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ]))
            flowables.append(t)
            flowables.append(Spacer(1, 12))

    return flowables


# --- Main PDF Generator Script ---
def main():
    if len(sys.argv) < 4:
        print("Usage: python generate_pdf.py <section_id> <db_path> <output_path>")
        sys.exit(1)

    section_id = int(sys.argv[1])
    db_path = sys.argv[2]
    output_path = sys.argv[3]
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    uploads_dir = os.path.join(project_root, 'uploads')

    if not os.path.exists(db_path):
        print(f"Database path '{db_path}' does not exist.")
        sys.exit(1)

    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Query Section details
    cursor.execute('''
        SELECT s.name, s.teacher_name, c.name 
        FROM sections s
        JOIN courses c ON s.course_id = c.id
        WHERE s.id = ?
    ''', (section_id,))
    section_row = cursor.fetchone()

    if not section_row:
        print(f"Section {section_id} not found in database.")
        sys.exit(1)

    section_name, teacher_name, course_name = section_row

    # Setup styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    styles['Normal'].textColor = colors.HexColor("#334155")
    styles['Normal'].fontSize = 9.5
    styles['Normal'].leading = 13.5
    
    styles['BodyText'].textColor = colors.HexColor("#334155")
    styles['BodyText'].fontSize = 9.5
    styles['BodyText'].leading = 14

    styles['Heading1'].textColor = colors.HexColor("#1e1b4b") # Dark indigo
    styles['Heading1'].fontSize = 18
    styles['Heading1'].leading = 22
    styles['Heading1'].keepWithNext = True

    styles['Heading2'].textColor = colors.HexColor("#1e293b")
    styles['Heading2'].fontSize = 13
    styles['Heading2'].leading = 16
    styles['Heading2'].keepWithNext = True

    styles['Heading3'].textColor = colors.HexColor("#475569")
    styles['Heading3'].fontSize = 11
    styles['Heading3'].leading = 14
    styles['Heading3'].keepWithNext = True

    story = []

    # ==========================================
    # 1. Cover Page
    # ==========================================
    story.append(Spacer(1, 80))
    story.append(Paragraph("TOPPR PERSONAL STUDY VAULT", ParagraphStyle('Sub', fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=colors.HexColor("#4f46e5"), alignment=1)))
    story.append(Spacer(1, 15))
    story.append(Paragraph(course_name, ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=28, leading=34, textColor=colors.HexColor("#0f172a"), alignment=1)))
    story.append(Spacer(1, 25))
    story.append(Paragraph(f"{section_name} Overview & Study Guide", ParagraphStyle('Subtitle', fontName='Helvetica', fontSize=16, leading=20, textColor=colors.HexColor("#475569"), alignment=1)))
    story.append(Spacer(1, 10))
    story.append(Paragraph(f"Instructor: {teacher_name}", ParagraphStyle('Teach', fontName='Helvetica-Oblique', fontSize=12, leading=14, textColor=colors.HexColor("#64748b"), alignment=1)))
    story.append(Spacer(1, 240))
    
    meta_style = ParagraphStyle('Meta', fontName='Helvetica', fontSize=9, leading=11, textColor=colors.HexColor("#94a3b8"), alignment=1)
    story.append(Paragraph("This PDF is generated automatically from original lecture notes and revision QA sets.", meta_style))
    story.append(Paragraph(f"Vault Updated: {datetime.now().strftime('%B %d, %Y')}", meta_style))
    story.append(PageBreak())

    # ==========================================
    # 2. Table of Contents / Outline
    # ==========================================
    story.append(Paragraph("Table of Contents", styles['Heading1']))
    story.append(Spacer(1, 15))
    
    # Query Topics & Q&As count for outline
    cursor.execute('''
        SELECT t.id, t.name, COUNT(q.id)
        FROM topics t
        LEFT JOIN questions q ON q.topic_id = t.id
        WHERE t.section_id = ?
        GROUP BY t.id
    ''', (section_id,))
    topics_list = cursor.fetchall()

    toc_data = []
    toc_data.append([Paragraph("<b>Topic Reference</b>", styles['Normal']), Paragraph("<b>Question Count</b>", styles['Normal'])])
    
    for _, name, count in topics_list:
        toc_data.append([Paragraph(name, styles['Normal']), Paragraph(f"{count} items", styles['Normal'])])

    toc_table = Table(toc_data, colWidths=[350, 150])
    toc_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor("#4f46e5")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LINEBELOW', (0, 1), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
    ]))
    story.append(toc_table)
    story.append(PageBreak())

    # ==========================================
    # 3. Academic Study Notes
    # ==========================================
    cursor.execute('SELECT content FROM notes WHERE section_id = ?', (section_id,))
    note_row = cursor.fetchone()
    
    if note_row:
        note_content = note_row[0]
        story.append(Paragraph("Section Study Notes", styles['Heading1']))
        story.append(Spacer(1, 10))
        
        # Parse notes markdown to flowables
        note_flowables = parse_markdown_to_flowables(note_content, styles, uploads_dir)
        story.extend(note_flowables)
        story.append(PageBreak())

    # ==========================================
    # 4. Questions & Answers Section
    # ==========================================
    story.append(Paragraph("Revision Questions &amp; Detailed Answers", styles['Heading1']))
    story.append(Spacer(1, 15))

    for topic_id, topic_name, _ in topics_list:
        # Heading for each topic
        story.append(Paragraph(topic_name, styles['Heading2']))
        story.append(Spacer(1, 8))

        cursor.execute('''
            SELECT id, question_text, answer_text 
            FROM questions 
            WHERE topic_id = ?
        ''', (topic_id,))
        questions_list = cursor.fetchall()

        for q_idx, (q_id, q_text, a_text) in enumerate(questions_list):
            q_elements = []
            
            # Question Label
            q_label = f"<b>Q{q_idx + 1}: {q_text}</b>"
            q_elements.append(Paragraph(q_label, ParagraphStyle('QLbl', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=colors.HexColor("#1e1b4b"))))
            q_elements.append(Spacer(1, 6))

            # Answer Label
            q_elements.append(Paragraph("📖 <i>Source: Original Course Content</i>", ParagraphStyle('SrcLbl', parent=styles['Normal'], fontSize=8, leading=10, textColor=colors.HexColor("#16a34a"))))
            q_elements.append(Spacer(1, 6))

            # Parse and append answer flowables
            ans_flowables = parse_markdown_to_flowables(a_text, styles, uploads_dir)
            q_elements.extend(ans_flowables)
            q_elements.append(Spacer(1, 20))

            # Keep each Question and Answer set together to prevent orphan questions
            story.append(KeepTogether(q_elements))

        story.append(Spacer(1, 15))

    conn.close()

    # Build document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Generation complete.")

if __name__ == '__main__':
    main()
