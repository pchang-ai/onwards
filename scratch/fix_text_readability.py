import re

def fix_readability(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = content

    # 1. Update background color from #1e1e22 to #121214
    modified = modified.replace('#1e1e22', '#121214')
    
    # 2. Bump text sizes smaller than 10px to at least 10px
    # Regex to find text-[7px], text-[8px], text-[9px] and change to text-[10px]
    modified = re.sub(r'text-\[[789]px\]', 'text-[10px]', modified)

    # 3. Upgrade low-contrast text colors to highly readable colors on dark background
    # text-slate-500, text-slate-550, text-slate-555, text-slate-600, text-slate-605, text-slate-505
    # when used for small text, change to text-slate-400 or text-slate-350 for better contrast.
    color_replacements = [
        ('text-slate-600', 'text-slate-400'),
        ('text-slate-555', 'text-slate-400'),
        ('text-slate-550', 'text-slate-400'),
        ('text-slate-505', 'text-slate-400'),
        ('text-slate-605', 'text-slate-400'),
        ('text-slate-500', 'text-slate-400'),
        ('text-slate-450', 'text-slate-350'),
    ]
    
    for old_color, new_color in color_replacements:
        modified = modified.replace(old_color, new_color)

    if modified != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Readability improvements applied to {file_path}")
    else:
        print(f"No changes needed for {file_path}")

# Run on codebase files
files = [
    'app/globals.css',
    'app/page.tsx',
    'components/HeroMetrics.tsx',
    'components/JobDiscoveryFeed.tsx',
    'components/ResumeUpload.tsx'
]

for file in files:
    try:
        fix_readability(file)
    except Exception as e:
        print(f"Error processing {file}: {e}")
