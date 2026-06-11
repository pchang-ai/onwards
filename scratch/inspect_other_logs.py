import json
import os

prev_conversations = [
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
                tool_calls = data.get("tool_calls", [])
                for call in tool_calls:
                    name = call.get("name")
                    args = call.get("args", {})
                    args_str = json.dumps(args).lower()
                    
                    matches = []
                    for file_name in ["page.tsx", "herometrics.tsx", "jobdiscoveryfeed.tsx", "resumeupload.tsx"]:
                        if file_name in args_str:
                            matches.append(file_name)
                    
                    if matches:
                        print(f"  Step {step_index} | Tool: {name} | Matches: {matches}")
                        if "targetfile" in args_str:
                            tf = args.get("TargetFile")
                            print(f"    TargetFile: {tf}")
                        if "codecontent" in args_str:
                            print(f"    CodeContent length: {len(args.get('CodeContent', ''))}")
                        if "replacementcontent" in args_str:
                            print(f"    ReplacementContent length: {len(args.get('ReplacementContent', ''))}")
            except Exception as e:
                pass
