import re
import os

files = [
    "app/page.tsx",
    "components/HeroMetrics.tsx",
    "components/JobDiscoveryFeed.tsx",
    "components/ResumeUpload.tsx"
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    print(f"\n=================== {file_path} ===================")
    # Find all strings matching word border or border-[color] or border-[width]
    # Let's search inside JSX classNames
    matches = re.findall(r'className="[^"]*border[^"]*"', content)
    print(f"Total className matches with 'border': {len(matches)}")
    for m in matches[:15]:
        print(f"  {m}")
    if len(matches) > 15:
        print(f"  ... and {len(matches) - 15} more")
