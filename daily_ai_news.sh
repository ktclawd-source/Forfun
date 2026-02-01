#!/bin/bash
# Daily AI News Digest Script

echo "Fetching top 5 AI news..."

# Search for AI news
NEWS=$(curl -s "https://news.google.com/rss/search?q=AI+artificial+intelligence&hl=en-US&gl=US&ceid=US:en" 2>/dev/null | \
head -50 | \
grep -E "<title>|<link>" | \
sed 's/<[^>]*>//g' | \
sed 's/^[[:space:]]*//' | \
head -n 20 | \
tail -n 15)

# For now, we'll use web search
python3 << 'PYEOF'
import subprocess
import json

# Get news via web search
result = subprocess.run(
    ['curl', '-s', 'https://ddg-api.herokuapp.com/search', '-d', 'q=artificial+intelligence+news+today', '-X', 'POST'],
    capture_output=True, text=True
)
print(result.stdout[:1000] if result.stdout else "No results")
PYEOF

echo "Done"
