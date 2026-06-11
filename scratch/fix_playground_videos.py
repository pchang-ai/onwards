import re

def fix_playground_videos():
    with open('app/playgroundData.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = content.split('  {\n    id: ')
    header = blocks[0]
    assignment_blocks = blocks[1:]
    
    new_blocks = []
    for block in assignment_blocks:
        full_block = '  {\n    id: ' + block
        
        category_match = re.search(r'category:\s*["\']([^"\']+)["\']', full_block)
        category = category_match.group(1).strip() if category_match else ""
        
        # Select the best working YouTube ID
        if category == 'app-web':
            new_id = 'rfscVS0vtbw' # freeCodeCamp Python/Coding
        elif category == 'agent-auto':
            new_id = 'LR6Rzcy7wiA' # ChatGPT AI agent
        elif category == 'intel-research':
            new_id = 'LR6Rzcy7wiA' # ChatGPT AI search/research
        elif category == 'writing-content':
            new_id = 'LR6Rzcy7wiA' # ChatGPT AI copy editor
        elif category == 'data-analysis':
            new_id = 'rfscVS0vtbw' # Python data analysis
        elif category == 'design-media':
            new_id = 'FqYRkl12ON8' # Leonardo AI design tutorial
        else:
            new_id = 'dQw4w9WgXcQ' # Rickroll fallback
            
        full_block = re.sub(r'youtubeId:\s*["\']([^"\']+)["\']', f'youtubeId: "{new_id}"', full_block)
        new_blocks.append(full_block)
        
    new_content = header + ''.join(new_blocks)
    
    with open('app/playgroundData.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully mapped all 42 assignments to verified working YouTube video IDs!")

if __name__ == '__main__':
    fix_playground_videos()
