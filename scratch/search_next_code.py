import os

workspace_dir = r"c:\Users\lonovo\OneDrive\Documents\01-PatVibeCoding\antigravity-onwardsapp"
next_dir = os.path.join(workspace_dir, ".next")

search_terms = ["dailyNewsData", "JobDiscoveryFeed", "rhythmStep", "playgroundAssignments"]

print("Searching .next directory for compiled chunks...")
found_files = []
for root, dirs, files in os.walk(next_dir):
    for f in files:
        if f.endswith('.js') or f.endswith('.map') or f.endswith('.rsc'):
            full_path = os.path.join(root, f)
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as file_obj:
                    content = file_obj.read()
                    matches = [term for term in search_terms if term in content]
                    if matches:
                        rel_path = os.path.relpath(full_path, next_dir)
                        print(f"{rel_path} | Size: {os.path.getsize(full_path)} bytes | Matches: {matches}")
                        found_files.append((full_path, matches))
            except Exception as e:
                pass
