import json
import os

transcript_path = r"C:\Users\Lenovo\.gemini\antigravity\brain\c03969e7-c54a-4aae-99db-2f093200a49e\.system_generated\logs\transcript.jsonl"

def main():
    if not os.path.exists(transcript_path):
        print("Not found")
        return
        
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                content = data.get("content", "")
                if not content:
                    continue
                # We want to find steps where the user gave us the question list or the model did OCR.
                # Look for "Section A" and "Section B" in the content, but make sure it's not a script file.
                if ("Sabiha" in content or "Rezaul" in content) and ("1." in content or "Q1" in content or "Question" in content):
                    if "seed_pathology.js" not in content and "search_transcript" not in content and len(content) > 1000:
                        print(f"=== Step {data.get('step_index')} ({data.get('type')}) ===")
                        print(content[:1500])
                        print("\n" + "="*50 + "\n")
            except Exception as e:
                pass

if __name__ == "__main__":
    main()
