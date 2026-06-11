with open("app/page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

line12 = lines[11]
print(f"Line 12 length: {len(line12)}")

import re
# Find all occurrences of // in line 12
matches = [m.start() for m in re.finditer(r'//', line12)]
print(f"Number of '//' occurrences: {len(matches)}")

for i, pos in enumerate(matches[:15]):
    start = max(0, pos - 50)
    end = min(len(line12), pos + 150)
    print(f"Match {i+1} at index {pos}:")
    print(f"  Context: {line12[start:end]}...")
