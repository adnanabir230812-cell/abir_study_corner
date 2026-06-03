import os
from pypdf import PdfReader

# Paths
PDF_PATH = r"C:\Users\Lenovo\Downloads\CamScanner 13-01-2026 21.09.pdf"
OUT_DIR = r"C:\Users\Lenovo\.gemini\antigravity\scratch\toppr\uploads\questions\mixed"

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
        
        # Save the largest image (the page scan)
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
            
            img_filename = f"mixed_q_page_{page_idx + 1}_img_{img_idx}.{ext}"
            img_path = os.path.join(OUT_DIR, img_filename)
            
            try:
                with open(img_path, "wb") as f:
                    f.write(img.data)
                print(f"Saved image: {img_filename} ({len(img.data) // 1024} KB)")
                img_idx += 1
            except Exception as e:
                print(f"Error saving image: {e}")

if __name__ == "__main__":
    main()
