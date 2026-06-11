import os
import time

workspace_dir = r"c:\Users\lonovo\OneDrive\Documents\01-PatVibeCoding\antigravity-onwardsapp"

print("Scanning workspace files...")
for root, dirs, files in os.walk(workspace_dir):
    # prune node_modules and .next
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
    if '.next' in dirs:
        dirs.remove('.next')
    
    for f in files:
        full_path = os.path.join(root, f)
        stat = os.stat(full_path)
        mtime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(stat.st_mtime))
        size = stat.st_size
        rel_path = os.path.relpath(full_path, workspace_dir)
        print(f"{rel_path} | Size: {size} bytes | Modified: {mtime}")
