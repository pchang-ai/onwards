import re

def soften_borders(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the replacements
    # We want to replace border lines with a very subtle white border (5% opacity)
    replacements = [
        ('border border-neutral-900', 'border border-white/5'),
        ('border border-neutral-850', 'border border-white/5'),
        ('border border-neutral-800', 'border border-white/5'),
        ('border border-slate-900', 'border border-white/5'),
        ('border border-slate-850', 'border border-white/5'),
        ('border border-slate-800', 'border border-white/5'),
        ('border-neutral-800/80', 'border-white/5'),
        ('border border-neutral-800/80', 'border border-white/5'),
        ('border-t border-l border-neutral-800', 'border-t border-l border-white/5'),
        ('border-b border-r border-neutral-800', 'border-b border-r border-white/5'),
        ('border-b border-neutral-800', 'border-b border-white/5'),
        ('border-b border-neutral-900/35', 'border-b border-white/5'),
        ('border border-slate-900/50', 'border border-white/5'),
        ('border border-slate-900/55', 'border border-white/5'),
        ('border border-slate-900/60', 'border border-white/5'),
    ]

    modified = content
    for old, new in replacements:
        modified = modified.replace(old, new)
    
    if modified != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Successfully softened borders in {file_path}")
    else:
        print(f"No changes made to {file_path}")

# Apply to key files
files = [
    'app/page.tsx',
    'components/HeroMetrics.tsx',
    'components/JobDiscoveryFeed.tsx',
    'components/ResumeUpload.tsx'
]

for file in files:
    try:
        soften_borders(file)
    except Exception as e:
        print(f"Error processing {file}: {e}")
