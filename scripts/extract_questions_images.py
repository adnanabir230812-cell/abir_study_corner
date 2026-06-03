import os
from pypdf import PdfReader

# Paths
PDF_PATH = r"E:\Abir study\3.2 1st Part\3.2 1st Part\1. Questions\AT- 3201 (Plant Pathology).pdf"
OUT_DIR = r"C:\Users\Lenovo\.gemini\antigravity\scratch\toppr\uploads\questions"

os.makedirs(OUT_DIR, exist_ok=True)

def main():
    print(f"Opening PDF: {PDF_PATH}")
    reader = PdfReader(PDF_PATH)
    num_pages = len(reader.pages)
    print(f"Total pages: {num_pages}")
    
    for page_idx in range(num_pages):
        page = reader.pages[page_idx]
        print(f"Processing Page {page_idx + 1}...")
        
        images = list(page.images)
        if not images:
            print(f"No images found on Page {page_idx + 1}")
            continue
            
        print(f"Found {len(images)} images on Page {page_idx + 1}")
        
        # Save each image
        for img_idx, img in enumerate(images):
            # CamScanner usually puts one large image covering the whole page
            ext = "png"
            # Get extension from file name or guess
            if hasattr(img, "name") and img.name:
                name_ext = os.path.splitext(img.name)[1]
                if name_ext:
                    ext = name_ext.strip(".").lower()
            
            img_filename = f"pathology_q_page_{page_idx + 1}_img_{img_idx + 1}.{ext}"
            img_path = os.path.join(OUT_DIR, img_filename)
            
            try:
                with open(img_path, "wb") as f:
                    f.write(img.data)
                print(f"Saved image: {img_filename}")
            except Exception as e:
                print(f"Error saving image: {e}")

if __name__ == "__main__":
    main()
