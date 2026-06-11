import json
import os

prev_conversations = [
    "981ff7bc-26cf-471a-8a40-0859c4a4b9ce",
    "56347475-2642-4ec1-900e-b07f719b3c0e",
    "28af72fa-809b-4471-9d89-1738ec72270e"
]

for cid in prev_conversations:
    transcript_path = rf"C:\Users\lonovo\.gemini\antigravity\brain\{cid}\.system_generated\logs\transcript.jsonl"
    print(f"\nChecking transcript for conversation {cid} at: {transcript_path}")
    if not os.path.exists(transcript_path):
        print("Transcript not found!")
        continue

    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            try:
                data = json.loads(line)
                step_index = data.get("step_index")
                step_type = data.get("type")
                status = data.get("status")
                content = data.get("content", "")
                
                if step_type == "VIEW_FILE" and status == "DONE" and content:
                    lines = content.split('\n')
                    header_line = lines[2] if len(lines) > 2 else ""
                    print(f"  Step {step_index} | Header: {header_line[:100]} | Content Length: {len(content)}")
            except Exception as e:
                pass
