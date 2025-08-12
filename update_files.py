import datetime

# Read current version
with open("version.txt", "r") as f:
    version = f.read().strip()

# Split into major.minor.patch
major, minor, patch = map(int, version.split("."))
patch += 1  # increment patch version
new_version = f"{major}.{minor}.{patch}"

# Save new version
with open("version.txt", "w") as f:
    f.write(new_version)

# Update README.md
current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
readme_content = f"""# My Project
Version: {new_version}  
Last Updated: {current_time}

## Description
This is my awesome project.

## How to Run
Instructions go here.
"""

with open("README.md", "w") as f:
    f.write(readme_content)

print(f"Updated to version {new_version} at {current_time}")
