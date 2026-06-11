import json
import os

transcript_path = r"C:\Users\lonovo\.gemini\antigravity\brain\981ff7bc-26cf-471a-8a40-0859c4a4b9ce\.system_generated\logs\transcript.jsonl"

if not os.path.exists(transcript_path):
    print("Transcript not found!")
    exit(1)

print("Starting scan...")
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
                
                # Check if this tool call mentions any of our files
                matches = []
                for file_name in ["page.tsx", "herometrics.tsx", "jobdiscoveryfeed.tsx", "resumeupload.tsx"]:
                    if file_name in args_str:
                        matches.append(file_name)
                
                if matches:
                    print(f"Step {step_index} | Line {line_num} | Tool: {name} | Matches: {matches}")
                    # Let's print keys of arguments
                    print(f"  Keys in args: {list(args.keys())}")
                    # If it's writing or editing, print info
                    if "targetfile" in args_str:
                        tf = args.get("TargetFile")
                        print(f"  TargetFile: {tf}")
                    if "codecontent" in args_str:
                        print(f"  CodeContent length: {len(args.get('CodeContent', ''))}")
                    if "replacementcontent" in args_str:
                        print(f"  ReplacementContent length: {len(args.get('ReplacementContent', ''))}")
        except Exception as e:
            pass
