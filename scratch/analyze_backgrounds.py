import re
import os

files = [
    "app/page.tsx",
    "components/HeroMetrics.tsx",
    "components/JobDiscoveryFeed.tsx",
    "components/ResumeUpload.tsx"
]

bg_patterns = [
    r'bg-\[#[a-fA-F0-9]{6}\]',
    r'bg-slate-[0-9]{3}(?:/[0-9]{2})?',
    r'bg-neutral-[0-9]{3}(?:/[0-9]{2})?',
    r'bg-black(?:/[0-9]{2})?',
    r'bg-[#0C0C0C]',
    r'#0C0C0C',
    r'#0D0D11',
    r'#121214',
    r'#07130e'
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    print(f"\n=================== {file_path} ===================")
    found_any = False
    for pattern in bg_patterns:
        matches = re.findall(pattern, content)
        if matches:
            print(f"  Pattern '{pattern}' matched {len(matches)} times: {set(matches)}")
            found_any = True
    if not found_any:
        print("  No background patterns found.")
