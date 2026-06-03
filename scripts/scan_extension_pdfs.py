import os
import re
from pypdf import PdfReader

matiul_sir_dir = r"E:\Abir study\3.2 2nd Part\3.2 2nd Part\AT-3205 Fundamentals of Extension, Communication and Leadership\Matiul Sir"
output_summary_path = r"C:\Users\Lenovo\.gemini\antigravity\scratch\toppr\scratch\extension_content_summary.md"

os.makedirs(os.path.dirname(output_summary_path), exist_ok=True)

def scan_pdfs():
    print(f"Scanning directory: {matiul_sir_dir}")
    files = os.listdir(matiul_sir_dir)
    pdf_files = [f for f in files if f.lower().endswith('.pdf')]
    pdf_files.sort()
    
    print(f"Found {len(pdf_files)} PDF files.")
    
    summary_md = f"# Summary of Matiul Sir's Course Content for AT-3205\n\n"
    summary_md += "This document compiles the page count, major topics, and structural headings extracted from all the lecture PDFs.\n\n"
    
    for file in pdf_files:
        file_path = os.path.join(matiul_sir_dir, file)
        print(f"Scanning: {file}...")
        
        try:
            reader = PdfReader(file_path)
            num_pages = len(reader.pages)
            
            # Read first 3 pages to extract key text
            text_sample = ""
            for idx in range(min(3, num_pages)):
                text_sample += reader.pages[idx].extract_text() or ""
            
            # Extract keywords
            keywords = [
                'DEFINITION', 'PHILOSOPHY', 'PRINCIPLE', 'HISTORY', 'NARS', 'DAE', 'T&V', 'UAO', 'AEO',
                'SAAO', 'LEARNING', 'ADULT', 'MASLOW', 'BLOOM', 'PEDAGOGY', 'ANDRAGOGY', 'HEUTAGOGY',
                'AUDIO-VISUAL', 'MONITORING', 'EVALUATION', 'TEACHING', 'CYBORGOGY'
            ]
            
            found_keywords = []
            for kw in keywords:
                if re.search(r'\b' + re.escape(kw) + r'\b', text_sample, re.IGNORECASE):
                    found_keywords.append(kw)
            
            # Extract lines that look like headings (uppercase, length 4 to 80)
            lines = [l.strip() for l in text_sample.split('\n') if l.strip()]
            headings = []
            for line in lines:
                if line.isupper() and 4 < len(line) < 80 and not line.startswith('PAGE') and not line.isdigit():
                    if line not in headings and len(headings) < 8:
                        headings.append(line)
            
            # Extract a brief intro snippet (first 600 characters)
            clean_sample = " ".join(text_sample.split())
            snippet = clean_sample[:600] + "..." if len(clean_sample) > 600 else clean_sample
            
            summary_md += f"## 📄 {file}\n"
            summary_md += f"* **Total Pages:** {num_pages}\n"
            summary_md += f"* **Extracted Key Concepts:** {', '.join(found_keywords) if found_keywords else 'General agricultural context'}\n"
            if headings:
                summary_md += f"* **Structural Headings Found:**\n"
                for h in headings:
                    summary_md += f"  * {h}\n"
            summary_md += f"* **Content Overview:**\n  > {snippet}\n\n"
            summary_md += "---\n\n"
            
        except Exception as e:
            print(f"Error parsing {file}: {e}")
            summary_md += f"## ❌ {file}\n*Failed to parse PDF file. Error: {e}*\n\n---\n\n"
            
    with open(output_summary_path, "w", encoding="utf-8") as f:
        f.write(summary_md)
    
    print(f"\nSuccessfully compiled scan details! Saved to {output_summary_path}")

if __name__ == '__main__':
    scan_pdfs()
