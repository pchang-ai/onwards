import os

workspace_dir = r"c:\Users\lonovo\OneDrive\Documents\01-PatVibeCoding\antigravity-onwardsapp"

def apply_replacements(file_path, replacements):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    for old, new in replacements:
        modified = modified.replace(old, new)
        
    if modified != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Successfully updated {file_path}")
    else:
        print(f"No changes made to {file_path}")

# 1. Replacements for app/page.tsx
page_replacements = [
    # Canvas Background
    ('bg-[#121214]', 'bg-[#081510]'),
    
    # Header background
    ('bg-[#0C0C0C]/90', 'bg-[#081510]/90'),
    
    # Primary/Card Backgrounds
    ('bg-[#0C0C0C]', 'bg-[#0e2018]'),
    ('bg-[#0D0D11]', 'bg-[#0e2018]'),
    ('bg-[#141417]', 'bg-[#0e2018]'),
    ('bg-[#18181B]', 'bg-[#0e2018]'),
    ('bg-[#18181C]', 'bg-[#0e2018]'),
    ('bg-[#141414]', 'bg-[#0e2018]'),
    ('bg-slate-955', 'bg-[#0e2018]'),
    ('bg-[#1C1C22]', 'bg-[#0e2018]'),
    
    # Nested panels & inputs (darker background)
    ('bg-slate-950', 'bg-[#06100c]'),
    ('bg-[#050505]', 'bg-[#06100c]'),
    ('bg-[#111111]', 'bg-[#06100c]'),
    
    # Transparent/Shaded panels
    ('bg-slate-900/50', 'bg-[#0e2018]/50'),
    ('bg-slate-900/40', 'bg-[#0e2018]/40'),
    ('bg-slate-955/40', 'bg-[#0e2018]/40'),
    ('bg-slate-955/10', 'bg-[#0e2018]/10'),
    ('bg-slate-950/40', 'bg-[#06100c]/40'),
    ('bg-slate-950/10', 'bg-[#06100c]/15'),
    ('bg-slate-950/20', 'bg-[#06100c]/20'),
    ('bg-slate-950/60', 'bg-[#06100c]/60'),
    ('bg-neutral-900/90', 'bg-[#0e2018]/90'),
    ('bg-neutral-900/30', 'bg-[#0e2018]/30'),
    ('bg-neutral-900/20', 'bg-[#0e2018]/40'),
    ('bg-neutral-900/40', 'bg-[#0e2018]/60'),
    
    # Active tab navigation styling (remove border, make white text on dark green bg)
    ('bg-[#1b4332]/40 text-emerald-400 shadow-md border border-[#40916c]/30', 'bg-[#183b2b]/60 text-white shadow-md'),
    ('border border-white/5 backdrop-blur-sm', 'backdrop-blur-sm shadow-md'),
    
    # Homepage dashboard buttons layout mapping
    ('border border-white/5 hover:border-emerald-800/40 hover:bg-neutral-900/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col relative pt-10',
     'hover:bg-[#122b20] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_-2px_rgba(16,185,129,0.15)] flex flex-col relative pt-10'),
    
    # Small text size replacements (minimum font size 10px and high contrast)
    ('className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 tracking-wider"',
     'className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-white/10 text-white/95 tracking-wider"'),
    ('text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500/25 text-emerald-300',
     'text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500/25 text-emerald-300'),
    ('className="text-[9px] font-medium mt-0.5"',
     'className="text-[10px] font-bold text-slate-200 mt-0.5"'),
     
    # Card Border Removal
    ('border border-white/5 rounded-3xl', 'rounded-3xl'),
    ('border border-white/5 rounded-2xl', 'rounded-2xl'),
    ('border border-white/5 rounded-xl', 'rounded-xl'),
    ('border border-white/5 shadow-xl', 'shadow-xl'),
    ('border border-white/5 shadow-2xl', 'shadow-2xl'),
    ('border border-white/5 hover:border-emerald-800', 'hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)]'),
    ('border border-white/5 hover:border-emerald-800/40', 'hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)]'),
    ('border border-white/5 focus:border-emerald-600', 'focus:border-emerald-600/30'),
    ('border border-white/5', ''), # general catch for border border-white/5
    ('border border-neutral-800', ''),
    ('border border-slate-800', ''),
    ('border border-slate-900', ''),
    ('border-neutral-800/80', ''),
    ('border-t border-l border-neutral-800', ''),
    ('border-b border-r border-neutral-800', ''),
    ('border-b border-neutral-850', ''),
    ('border-b border-white/5', 'border-b border-emerald-950/20'), # keep thin dividers but soft green
    ('border-t border-slate-800/60', 'border-t border-emerald-950/20'),
    ('border-b border-slate-800/50', 'border-b border-emerald-950/20'),
    
    # Layout spacing adjustments (py-24 to py-16)
    ('py-24', 'py-16'),
    ('gap-8', 'gap-6'),
    ('lg:gap-8', 'lg:gap-6')
]

# 2. Replacements for components/HeroMetrics.tsx
metrics_replacements = [
    ('bg-[#121214] py-24', 'bg-[#081510] py-16'),
    ('bg-[#0C0C0C]', 'bg-[#0e2018]'),
    ('border border-white/5 rounded-3xl', 'rounded-3xl'),
    ('border border-white/5 hover:border-emerald-800 rounded-3xl', 'rounded-3xl hover:bg-[#122b20]'),
    ('border border-white/5', ''),
    ('p-3.5 bg-slate-800/80 rounded-2xl shadow-inner border border-slate-700/50', 
     'p-3.5 bg-[#06100c]/85 rounded-2xl shadow-inner'),
    ('bg-neutral-900', 'bg-[#06100c]')
]

# 3. Replacements for components/JobDiscoveryFeed.tsx
job_replacements = [
    ('bg-[#0C0C0C]', 'bg-[#0e2018]'),
    ('border border-white/5 rounded-2xl', 'rounded-2xl'),
    ('border border-white/5 hover:border-emerald-800 rounded-2xl', 'rounded-2xl hover:bg-[#122b20] hover:shadow-[0_4px_25px_rgba(16,185,129,0.15)]'),
    ('border border-white/5', ''),
    ('bg-slate-950/80 rounded-full border border-white/5 shadow-inner', 'bg-[#06100c]/80 rounded-full shadow-inner'),
    ('pb-24', 'pb-16'),
    ('border-t border-slate-800/50', 'border-t border-emerald-950/20'),
    ('border-t border-white/5', 'border-t border-emerald-950/20')
]

# 4. Replacements for components/ResumeUpload.tsx
resume_replacements = [
    ('bg-slate-900/50', 'bg-[#0e2018]/50'),
    ('bg-slate-900', 'bg-[#0e2018]'),
    ('bg-slate-800/80', 'bg-[#06100c]/85'),
    ('border border-white/5 rounded-3xl bg-slate-900/50', 'rounded-3xl bg-[#0e2018]/50'),
    ('border border-white/5', ''),
    ('border border-slate-700', 'border border-emerald-900/20'),
    ('border-slate-700', 'border-emerald-900/20'),
    ('border border-slate-700/50', ''),
    ('bg-emerald-500/10 border border-emerald-500/30', 'bg-emerald-950/20 border border-emerald-500/10'),
    ('h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30', 'h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/10'),
    ('py-24', 'py-16'),
    ('py-12', 'py-8')
]

# Apply updates
apply_replacements(os.path.join(workspace_dir, "app", "page.tsx"), page_replacements)
apply_replacements(os.path.join(workspace_dir, "components", "HeroMetrics.tsx"), metrics_replacements)
apply_replacements(os.path.join(workspace_dir, "components", "JobDiscoveryFeed.tsx"), job_replacements)
apply_replacements(os.path.join(workspace_dir, "components", "ResumeUpload.tsx"), resume_replacements)
