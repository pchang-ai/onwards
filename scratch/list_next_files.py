import os

workspace_dir = r"c:\Users\lonovo\OneDrive\Documents\01-PatVibeCoding\antigravity-onwardsapp"
next_dir = os.path.join(workspace_dir, ".next")

print(f"Scanning .next directory at {next_dir}...")
if not os.path.exists(next_dir):
    print("Does not exist!")
    exit(1)

for root, dirs, files in os.walk(next_dir):
    for f in files:
        if "page" in f.lower() or "hero" in f.lower() or "resume" in f.lower():
            full_path = os.path.join(root, f)
            print(f"{os.path.relpath(full_path, next_dir)} | Size: {os.path.getsize(full_path)} bytes")
