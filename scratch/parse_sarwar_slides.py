import zipfile
import xml.etree.ElementTree as ET
import os

slides_dir = r"E:\Abir study\3.2 1st Part\3.2 1st Part\AT-3203 Crop Ecology\Sarwar Sir"
out_dir = r"C:\Users\Lenovo\.gemini\antigravity\scratch\toppr\scratch"

files_to_parse = [
    ("1. Ecosystems.pptx", "ecosystems_slides_text.md"),
    ("2. Productivity.pptx", "productivity_slides_text.md"),
    ("3. Food Chain.pptx", "food_chain_slides_text.md"),
    ("4. Agro-ecosystem.pptx", "agro_ecosystem_slides_text.md"),
    ("5.0 Crop Association.pptx", "crop_association_slides_text.md"),
    ("6. Environmental Pollution.pptx", "pollution_slides_text.md"),
    ("7. Vegetations of Bangladesh.pptx", "vegetations_slides_text.md")
]

for filename, out_filename in files_to_parse:
    pptx_path = os.path.join(slides_dir, filename)
    if not os.path.exists(pptx_path):
        print(f"File not found: {pptx_path}")
        continue
    
    print(f"Extracting text from: {filename}")
    try:
        with zipfile.ZipFile(pptx_path, 'r') as zip_ref:
            # Sort slides properly
            slide_files = sorted([f for f in zip_ref.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')], 
                                 key=lambda x: int(x.split('slide')[-1].split('.xml')[0]))
            
            extracted_text = [f"# Course Slides: {filename.replace('.pptx', '')}\n\n"]
            for idx, slide_file in enumerate(slide_files):
                slide_content = zip_ref.read(slide_file)
                root = ET.fromstring(slide_content)
                
                namespace = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
                slide_texts = []
                for t_tag in root.findall('.//a:t', namespace):
                    if t_tag.text:
                        slide_texts.append(t_tag.text.strip())
                
                slide_title = f"Slide {idx + 1}"
                slide_body = "\n".join([t for t in slide_texts if t])
                extracted_text.append(f"## {slide_title}\n\n{slide_body}\n\n---\n")
                
            out_content = "\n".join(extracted_text)
            out_path = os.path.join(out_dir, out_filename)
            with open(out_path, 'w', encoding='utf-8') as out_file:
                out_file.write(out_content)
            print(f"Successfully extracted {len(slide_files)} slides to: {out_filename}")
    except Exception as e:
        print(f"Error reading {filename}: {e}")
