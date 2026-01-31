import os
import re

# Directory containing store files
store_dir = "src/store"

# Walk through all .js files in store directory
for root, dirs, files in os.walk(store_dir):
    for file in files:
        if file.endswith(".js"):
            filepath = os.path.join(root, file)
            
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Check if file contains localhost:5000
            if "localhost:5000" in content:
                # Add import if not present
                if "import API_URL" not in content:
                    # Add after the first import line
                    lines = content.split('\n')
                    for i, line in enumerate(lines):
                        if line.startswith('import ') and 'API_URL' not in line:
                            lines.insert(i+1, 'import API_URL from "@/config/api";')
                            break
                    content = '\n'.join(lines)
                
                # Replace all variations of localhost:5000 URLs
                # Pattern 1: "http://localhost:5000/path"
                content = re.sub(r'"http://localhost:5000(/[^"]*)"', r'`${API_URL}\1`', content)
                # Pattern 2: `http://localhost:5000/path`
                content = re.sub(r'`http://localhost:5000(/[^`]*)`', r'`${API_URL}\1`', content)
                # Pattern 3: `http://localhost:5000/path${var}`
                content = re.sub(r'`http://localhost:5000(/[^`]*)`', r'`${API_URL}\1`', content)
                
                # Write back
                with open(filepath, 'w') as f:
                    f.write(content)
                
                print(f"Updated: {filepath}")

print("All files updated!")
