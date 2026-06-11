import json
import os

prev_conversations = [
    "981ff7bc-26cf-471a-8a40-0859c4a4b9ce",
    "56347475-2642-4ec1-900e-b07f719b3c0e",
    "28af72fa-809b-4471-9d89-1738ec72270e"
]

for cid in prev_conversations:
    transcript_path = rf"C:\Users\lonovo\.gemini\antigravity\brain\{cid}\.system_generated\logs\transcript.jsonl"
    print(f"\nChecking transcript for conversation {cid}:")
    if not os.path.exists(transcript_path):
        print("  Not found!")
        continue

    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            try:
                data = json.loads(line)
                step_index = data.get("step_index")
                tool_calls = data.get("tool_calls", [])
                for call in tool_calls:
                    name = call.get("name")
                    args = call.get("args", {})
                    
                    target_file = args.get("AbsolutePath") or args.get("TargetFile") or ""
                    if "page.tsx" in target_file:
                        if name == "view_file":
                            start = args.get("StartLine")
                            end = args.get("EndLine")
                            print(f"  Step {step_index} | view_file | StartLine: {start} | EndLine: {end}")
                        elif name in ["replace_file_content", "multi_replace_file_content"]:
                            print(f"  Step {step_index} | {name} | Description: {args.get('Description')}")
            except Exception as e:
                pass
