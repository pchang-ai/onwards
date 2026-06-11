import os

workspace_dir = r"c:\Users\lonovo\OneDrive\Documents\01-PatVibeCoding\antigravity-onwardsapp"
search_term = "Onwards: Your Transition Optimized"

print(f"Searching for '{search_term}'...")
found = []
for root, dirs, files in os.walk(workspace_dir):
    # we want to search in .next, but we can search everywhere except node_modules
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
        
    for f in files:
        if f.endswith(('.js', '.json', '.txt', '.tsx', '.ts')):
            full_path = os.path.join(root, f)
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as file_obj:
                    content = file_obj.read()
                    if search_term in content:
                        found.append((full_path, len(content)))
            except Exception as e:
                pass

for path, size in found:
    print(f"Found in: {path} (Size: {size})")
