import os
import shutil

MIXED_DIR = r"C:\Users\Lenovo\.gemini\antigravity\scratch\toppr\uploads\questions\mixed"
BASE_OUT_DIR = r"C:\Users\Lenovo\.gemini\antigravity\scratch\toppr\uploads\questions"

# Mapping mixed question pages to subjects
# page number -> (subject folder name, target filename)
MAPPING = {
    1: ("spices", "spices_q_page_1.jpg"),
    2: ("spices", "spices_q_page_2.jpg"),
    3: ("methodology", "mixed_2025_q_page_1.jpg"),
    4: ("methodology", "mixed_2025_q_page_2.jpg"),
    5: ("olericulture", "mixed_2025_q_page_1.jpg"),
    6: ("olericulture", "mixed_2025_q_page_2.jpg"),
    7: ("pathology", "mixed_2025_q_page_1.jpg"),
    8: ("pathology", "mixed_2025_q_page_2.jpg"),
    9: ("extension", "mixed_2025_q_page_1.jpg"),
    10: ("extension", "mixed_2025_q_page_2.jpg"),
}

def main():
    print("Separating mixed question papers...")
    for page_num, (folder, new_filename) in MAPPING.items():
        src_filename = f"mixed_q_page_{page_num}_img_1.jpg"
        src_path = os.path.join(MIXED_DIR, src_filename)
        
        if not os.path.exists(src_path):
            # Try alternate naming check
            print(f"File not found: {src_path}")
            continue
            
        dest_folder = os.path.join(BASE_OUT_DIR, folder)
        os.makedirs(dest_folder, exist_ok=True)
        dest_path = os.path.join(dest_folder, new_filename)
        
        shutil.copy(src_path, dest_path)
        print(f"Copied Page {page_num} ({src_filename}) -> {folder}/{new_filename}")

    print("Separation complete!")

if __name__ == "__main__":
    main()
