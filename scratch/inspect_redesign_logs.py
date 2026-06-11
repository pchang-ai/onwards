import json
import os

cid = "56347475-2642-4ec1-900e-b07f719b3c0e"
transcript_path = rf"C:\Users\lonovo\.gemini\antigravity\brain\{cid}\.system_generated\logs\transcript.jsonl"

print(f"Scanning transcript for {cid}...")
if not os.path.exists(transcript_path):
    print("Not found!")
    exit(1)

files_to_watch = ["page.tsx", "herometrics.tsx", "jobdiscoveryfeed.tsx", "resumeupload.tsx"]

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
                
                for file_name in files_to_watch:
                    if file_name in args_str:
                        # Print step and info
                        print(f"Step {step_index} | Tool: {name} | File matched: {file_name}")
                        if "targetfile" in args_str:
                            print(f"  TargetFile: {args.get('TargetFile')}")
                        if "codecontent" in args_str:
                            print(f"  CodeContent length: {len(args.get('CodeContent', ''))}")
                        if "replacementcontent" in args_str:
                            print(f"  ReplacementContent length: {len(args.get('ReplacementContent', ''))}")
                        if "replacementchunks" in args_str:
                            print(f"  ReplacementChunks count: {len(args.get('ReplacementChunks', []))}")
        except Exception as e:
            pass
