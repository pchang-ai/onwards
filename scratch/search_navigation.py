with open("app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find occurrences of Tab button rendering
matches = [m.start() for m in re.finditer(r'setActiveTab', content)]
print(f"Found {len(matches)} occurrences of setActiveTab:")
for i, pos in enumerate(matches):
    start = max(0, pos - 200)
    end = min(len(content), pos + 400)
    print(f"\nMatch {i+1} at index {pos}:")
    print(content[start:end])
