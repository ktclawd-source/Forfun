#!/bin/bash
# Daily APAC Ransomware Victims Watch
# Fetches latest victims from ransomware.live and filters for APAC region

echo "Fetching latest ransomware victims..."

# Fetch the page
RESPONSE=$(curl -s "https://ransomware.live" 2>/dev/null)

# Extract victim data - parse recent entries with APAC indicators
# APAC countries: China, Japan, Korea, Australia, NZ, Singapore, HK, Taiwan, 
# Malaysia, Indonesia, Philippines, Thailand, Vietnam, India

echo "Checking for APAC victims..."

# Use python for proper parsing
python3 << 'PYEOF'
import re
import json

# Read the page content
with open("/tmp/ransomware_page.html", "r") as f:
    content = f.read()

# Extract company names and details
# Look for patterns indicating APAC companies

apac_keywords = [
    "china", "japan", "korea", "australia", "singapore", "hong kong", "taiwan",
    "malaysia", "indonesia", "philippines", "thailand", "vietnam", "india",
    "pvt", "ltd", "co.", "limited", "asia", "pacific"
]

# Parse victims - simplified extraction
victims = []

# Find victim entries
pattern = r'<td class="[^"]*">(.*?)</td>'
company_matches = re.findall(pattern, content)

print("Checking victims for APAC region...")
print("-" * 50)

for i, company in enumerate(company_matches[:50]):
    company_clean = re.sub(r'<[^>]*>', '', company).strip()
    if len(company_clean) > 3 and len(company_clean) < 100:
        # Check if it's likely APAC
        for keyword in apac_keywords:
            if keyword.lower() in company_clean.lower():
                print(f"[{i+1}] {company_clean}")
                break

PYEOF

echo ""
echo "Done - Check ransomware.live for complete list"