with open("app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = [m.start() for m in re.finditer(r'text-\[9px\]', content)]
print(f"Found {len(matches)} occurrences of text-[9px]:")
for idx, pos in enumerate(matches):
    start = max(0, pos - 150)
    end = min(len(content), pos + 150)
    print(f"\nOccurrence {idx+1} at index {pos}:")
    print(content[start:end])
