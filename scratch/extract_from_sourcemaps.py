import json
import os

workspace_dir = r"c:\Users\lonovo\OneDrive\Documents\01-PatVibeCoding\antigravity-onwardsapp"
next_dir = os.path.join(workspace_dir, ".next")

targets = {
    "app/page.tsx": os.path.join(workspace_dir, "app", "page.tsx"),
    "components/HeroMetrics.tsx": os.path.join(workspace_dir, "components", "HeroMetrics.tsx"),
    "components/JobDiscoveryFeed.tsx": os.path.join(workspace_dir, "components", "JobDiscoveryFeed.tsx"),
    "components/ResumeUpload.tsx": os.path.join(workspace_dir, "components", "ResumeUpload.tsx")
}

restored = {}

print("Scanning source maps in .next directory...")
for root, dirs, files in os.walk(next_dir):
    for f in files:
        if f.endswith(".map"):
            full_path = os.path.join(root, f)
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as file_obj:
                    sourcemap = json.load(file_obj)
                
                sources = sourcemap.get("sources", [])
                sources_content = sourcemap.get("sourcesContent", [])
                
                # Check if this source map has any of our targets
                for src_idx, src_path in enumerate(sources):
                    # Turbopack paths can look like: "file:///c:/Users/.../app/page.tsx" or "[project]/app/page.tsx"
                    for target_key, target_dest in targets.items():
                        if target_key in restored:
                            continue
                            
                        # check if the target_key is in the source path (e.g. app/page.tsx)
                        if src_path.endswith(target_key) or target_key.replace('/', '\\') in src_path:
                            # Verify if there is content for this source
                            if src_idx < len(sources_content) and sources_content[src_idx]:
                                content = sources_content[src_idx]
                                # We want to make sure it's the unflattened original (it should have newlines)
                                if "\n" in content and len(content.split("\n")) > 100:
                                    print(f"Found unflattened source for {target_key} in {os.path.relpath(full_path, next_dir)}!")
                                    restored[target_key] = (target_dest, content)
                                elif target_key != "app/page.tsx" and "\n" in content and len(content.split("\n")) > 10:
                                    print(f"Found unflattened source for {target_key} in {os.path.relpath(full_path, next_dir)}!")
                                    restored[target_key] = (target_dest, content)
            except Exception as e:
                pass

print(f"\nScan complete. Found {len(restored)} / {len(targets)} files.")
for key, (dest, content) in restored.items():
    # Write back the original content
    with open(dest, "w", encoding="utf-8") as out:
        out.write(content)
    print(f"Successfully restored {key} to {dest} ({len(content)} bytes, {len(content.splitlines())} lines)!")
