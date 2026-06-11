import re
import os

files = [
    "app/page.tsx",
    "components/HeroMetrics.tsx",
    "components/JobDiscoveryFeed.tsx",
    "components/ResumeUpload.tsx"
]

small_text_patterns = [
    r'text-\[[5-9]px\]',
    r'text-\[0\.[0-9]+rem\]',
    r'text-xxs'
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    print(f"\n=================== {file_path} ===================")
    found = False
    for pat in small_text_patterns:
        matches = re.findall(pat, content)
        if matches:
            print(f"  Found small text classes matching '{pat}': {matches}")
            found = True
    if not found:
        print("  No text sizes smaller than 10px found.")
