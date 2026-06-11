import re

def apply_green_theme(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = content

    # 1. Update background color from #121214 to #081510
    modified = modified.replace('#121214', '#081510')
    
    # 2. Update card backgrounds from #0C0C0C and #0D0D11 to #0e2018 (dark forest green card)
    modified = modified.replace('#0C0C0C', '#0e2018')
    modified = modified.replace('#0D0D11', '#0e2018')
    modified = modified.replace('#0D0D15', '#0e2018')
    
    # 3. Update slate-900/slate-950 layouts to dark green
    modified = modified.replace('bg-slate-900/50', 'bg-[#0e2018]/50')
    modified = modified.replace('bg-slate-900/40', 'bg-[#0e2018]/40')
    modified = modified.replace('bg-slate-950/10', 'bg-[#07130e]/40')
    modified = modified.replace('bg-slate-955/40', 'bg-[#0e2018]/40')
    modified = modified.replace('bg-slate-955/30', 'bg-[#07130e]/40')
    modified = modified.replace('bg-slate-950', 'bg-[#07130e]')
    modified = modified.replace('bg-slate-955', 'bg-[#07130e]')
    modified = modified.replace('bg-[#080808]/90', 'bg-[#07130e]/90')
    modified = modified.replace('bg-black/35', 'bg-[#07130e]/60')
    modified = modified.replace('bg-black/25', 'bg-[#07130e]/40')
    
    # 4. Active tab styling: change text-emerald-400 and border details to clean white text on dark green
    modified = modified.replace(
        'bg-[#1b4332]/40 text-emerald-400 shadow-md border border-[#40916c]/30',
        'bg-[#183b2b]/60 text-white shadow-md'
    )
    
    # 5. Remove 'border border-white/5' from card containers to make it less busy (rely on bg-contrast and shadows)
    # We want to keep borders for input elements, dividers, or table cells, but remove outer card border outlines.
    # We can remove 'border border-white/5' from primary containers:
    # Look for 'border border-white/5' on rounded-3xl or rounded-2xl blocks
    card_border_patterns = [
        ('border border-white/5 rounded-3xl', 'rounded-3xl'),
        ('border border-white/5 rounded-2xl', 'rounded-2xl'),
        ('border border-white/5 rounded-xl', 'rounded-xl'),
        ('border border-white/5 shadow-xl', 'shadow-xl'),
        ('border border-white/5 shadow-2xl', 'shadow-2xl'),
        ('border border-white/5 hover:border-emerald-800', 'hover:border-emerald-800/30'),
        ('border border-white/5 hover:border-emerald-800/40', 'hover:border-emerald-800/20'),
        ('border border-white/5 focus:border-emerald-600', 'focus:border-emerald-600/30'),
    ]
    for old_pattern, new_pattern in card_border_patterns:
        modified = modified.replace(old_pattern, new_pattern)

    # Let's clean up any double spaces introduced by border removal
    modified = re.sub(r'\s{2,}', ' ', modified)

    if modified != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Successfully applied dark green theme and removed card borders in {file_path}")
    else:
        print(f"No changes made to {file_path}")

# Apply to all codebase UI files
files = [
    'app/page.tsx',
    'components/HeroMetrics.tsx',
    'components/JobDiscoveryFeed.tsx',
    'components/ResumeUpload.tsx'
]

for file in files:
    try:
        apply_green_theme(file)
    except Exception as e:
        print(f"Error processing {file}: {e}")
