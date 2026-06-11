import os

files = [
    "app/page.tsx",
    "components/HeroMetrics.tsx",
    "components/JobDiscoveryFeed.tsx",
    "components/ResumeUpload.tsx"
]

for file in files:
    if os.path.exists(file):
        with open(file, "r", encoding="utf-8") as f:
            lines = f.readlines()
        print(f"File: {file} | Total lines: {len(lines)}")
        for i, line in enumerate(lines):
            if len(line) > 500:
                print(f"  Line {i+1} has length {len(line)}")
    else:
        print(f"File: {file} does not exist!")
