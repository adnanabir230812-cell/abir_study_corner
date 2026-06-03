import os
from pypdf import PdfReader

PDF_PATH = r"E:\Abir study\3.2 1st Part\3.2 1st Part\1. Questions\AT- 3201 (Plant Pathology).pdf"

def main():
    if not os.path.exists(PDF_PATH):
        print(f"File not found: {PDF_PATH}")
        return
        
    reader = PdfReader(PDF_PATH)
    print(f"Total pages: {len(reader.pages)}")
    for idx, page in enumerate(reader.pages):
        text = page.extract_text()
        print(f"--- Page {idx+1} (Text length: {len(text) if text else 0}) ---")
        if text and text.strip():
            print(text.strip()[:500])
        else:
            print("[No text found]")

if __name__ == "__main__":
    main()
