import json

transcript_path = r"C:\Users\Lenovo\.gemini\antigravity\brain\c03969e7-c54a-4aae-99db-2f093200a49e\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            content = data.get("content", "")
            if not content:
                continue
            if "mixed" in content.lower() or "camscanner" in content.lower() or "pathology" in content.lower():
                # print first 200 chars of the content
                print(f"Step {data.get('step_index')}: {content[:300]}...")
        except Exception as e:
            pass
