import os
from pypdf import PdfReader

# Paths
SRC_DIR = r"E:\Abir study\3.2 1st Part\3.2 1st Part\1. Questions"
OUT_BASE = r"C:\Users\Lenovo\.gemini\antigravity\scratch\toppr\uploads\questions"

SUBJECTS = {
    "AT- 3201 (Plant Pathology).pdf": "pathology",
    "AT- 3203 (Crop Ecology).pdf": "ecology",
    "AT- 3205 (Extension).pdf": "extension",
    "AT- 3207 (Olericuluture).pdf": "olericulture",
    "AT- 3209 (Methodology).pdf": "methodology"
}

def extract_pdf_images(pdf_name, folder_name):
    pdf_path = os.path.join(SRC_DIR, pdf_name)
    if not os.path.exists(pdf_path):
        print(f"WARNING: File not found: {pdf_name}")
        return
        
    out_dir = os.path.join(OUT_BASE, folder_name)
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"\n==================================================")
    print(f"Extracting images from: {pdf_name} -> {folder_name}")
    print(f"==================================================")
    
    reader = PdfReader(pdf_path)
    num_pages = len(reader.pages)
    print(f"Total pages: {num_pages}")
    
    for page_idx in range(num_pages):
        page = reader.pages[page_idx]
        images = list(page.images)
        if not images:
            continue
            
        # Save each image (usually the largest one is the page scan)
        img_idx = 1
        for img in images:
            # Skip tiny images (watermarks or logos) under 50KB
            if len(img.data) < 50000:
                continue
                
            ext = "jpg"
            if hasattr(img, "name") and img.name:
                name_ext = os.path.splitext(img.name)[1]
                if name_ext:
                    ext = name_ext.strip(".").lower()
            
            img_filename = f"{folder_name}_q_page_{page_idx + 1}_img_{img_idx}.{ext}"
            img_path = os.path.join(out_dir, img_filename)
            
            try:
                with open(img_path, "wb") as f:
                    f.write(img.data)
                print(f"Saved: {img_filename} ({len(img.data) // 1024} KB)")
                img_idx += 1
            except Exception as e:
                print(f"Error saving image: {e}")

def main():
    for pdf_name, folder_name in SUBJECTS.items():
        extract_pdf_images(pdf_name, folder_name)
    print("\nExtraction complete for all subjects!")

if __name__ == "__main__":
    main()
