import re
import json

def parse_playground_data():
    with open('app/playgroundData.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find assignments in code
    # Matches structure like:
    # {
    #   id: "...",
    #   day: "...",
    #   category: "...",
    #   categoryLabel: "...",
    #   title: "...",
    #   description: "...",
    #   youtubeId: "...",
    #   toolName: "...",
    #   toolUrl: "...",
    #   ...
    # }
    
    # We can search for all items inside the array: export const playgroundAssignments: Assignment[] = [ ... ]
    # Let's extract each block between { and } that has id: and title:
    pattern = r'\{\s*id:\s*["\']([^"\']+)["\'],\s*day:\s*["\']([^"\']+)["\'],\s*category:\s*["\']([^"\']+)["\'],\s*categoryLabel:\s*["\']([^"\']+)["\'],\s*title:\s*["\']([^"\']+)["\']'
    matches = re.findall(pattern, content)
    
    # We can also search for the specific youtubeIds and toolUrls for each id
    pattern_full = r'id:\s*["\']([^"\']+)["\'].*?title:\s*["\']([^"\']+)["\'].*?youtubeId:\s*["\']([^"\']+)["\'].*?toolUrl:\s*["\']([^"\']+)["\']'
    matches_full = re.findall(pattern_full, content, re.DOTALL)
    
    print(f"Parsed {len(matches_full)} assignments:")
    for idx, (lesson_id, title, youtube_id, tool_url) in enumerate(matches_full):
        print(f"{idx+1}. ID: {lesson_id} | Title: {title} | Youtube: {youtube_id} | Tool: {tool_url}")

if __name__ == '__main__':
    parse_playground_data()
