import zipfile
import xml.etree.ElementTree as ET
import os

pptx_path = r"E:\Abir study\3.2 1st Part\3.2 1st Part\AT-3201 Principles of Plant Pathology and Diseases of Field Crops\Sabiha Madame\21 Batch\1.1 Pathogenesis.pptx"

if not os.path.exists(pptx_path):
    print(f"File not found: {pptx_path}")
    exit(1)

print(f"Extracting text from: {pptx_path}")

try:
    with zipfile.ZipFile(pptx_path, 'r') as zip_ref:
        # PPTX slides are usually named ppt/slides/slide1.xml, slide2.xml, etc.
        slide_files = sorted([f for f in zip_ref.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')], 
                             key=lambda x: int(x.split('slide')[-1].split('.xml')[0]))
        
        print(f"Found {len(slide_files)} slides.")
        
        extracted_text = []
        for idx, slide_file in enumerate(slide_files):
            slide_content = zip_ref.read(slide_file)
            root = ET.fromstring(slide_content)
            
            # The namespace for drawing text in PPTX is http://schemas.openxmlformats.org/drawingml/2006/main
            # We look for all <a:t> tags which contain text
            namespace = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
            
            slide_texts = []
            for t_tag in root.findall('.//a:t', namespace):
                if t_tag.text:
                    slide_texts.append(t_tag.text.strip())
            
            slide_title = f"Slide {idx + 1}"
            slide_body = "\n".join([t for t in slide_texts if t])
            
            extracted_text.append(f"## {slide_title}\n\n{slide_body}\n\n---\n")
            
        out_content = "\n".join(extracted_text)
        out_path = r"C:\Users\Lenovo\.gemini\antigravity\scratch\toppr\scratch\pathogenesis_slides_text.md"
        with open(out_path, 'w', encoding='utf-8') as out_file:
            out_file.write(out_content)
            
        print(f"Successfully extracted text to: {out_path}")
        print("First 500 characters of extracted text:")
        print(out_content[:500])
except Exception as e:
    print(f"Error reading PPTX file: {e}")
