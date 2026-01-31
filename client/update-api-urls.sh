#!/bin/bash

# Update all store files to use API_URL from config

# List of files to update
files=(
  "src/store/auth-slice/index.js"
  "src/store/admin/products-slice/index.js"
  "src/store/admin/order-slice/index.js"
  "src/store/shop/cart-slice/index.js"
  "src/store/shop/search-slice/index.js"
  "src/store/shop/products-slice/index.js"
  "src/store/shop/order-slice/index.js"
  "src/store/shop/address-slice/index.js"
  "src/store/shop/review-slice/index.js"
  "src/store/common-slice/index.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Add import if not already present
    if ! grep -q 'import API_URL from' "$file"; then
      sed -i '' '2i\
import API_URL from "@/config/api";
' "$file"
    fi
    
    # Replace all http://localhost:5000 with ${API_URL}
    sed -i '' 's|"http://localhost:5000|`${API_URL}|g' "$file"
    sed -i '' 's|/api|/api|g' "$file"
    sed -i '' 's|"|`|g' "$file"
    
    echo "Updated $file"
  fi
done

echo "All files updated successfully!"
