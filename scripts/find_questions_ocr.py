import json
import os

transcript_path = r"C:\Users\Lenovo\.gemini\antigravity\brain\c03969e7-c54a-4aae-99db-2f093200a49e\.system_generated\logs\transcript.jsonl"

def main():
    if not os.path.exists(transcript_path):
        print("Transcript not found")
        return
    
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                content = data.get("content", "")
                if not content:
                    continue
                
                # Check for mention of the image files or PDF names
                if any(x in content for x in ["pathology_q_page_1", "pathology_q_page_2", "pathology_q_page_3", "pathology_q_page_7", "pathology_q_page_8", "pathology_q_page_9", "pathology_q_page_10"]):
                    if "seed_pathology.js" not in content and "find_questions_ocr.py" not in content:
                        print(f"=== Step {data.get('step_index')} (type: {data.get('type')}, source: {data.get('source')}) ===")
                        # print content line-by-line that looks like a question or OCR text
                        for c_line in content.split('\n'):
                            if any(term in c_line for term in ["Section", "Question", "1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Define", "Describe", "Explain", "Distinguish", "Differentiate"]):
                                print("  ", c_line.strip()[:180])
                        print("-" * 50)
            except Exception as e:
                pass

if __name__ == "__main__":
    main()
