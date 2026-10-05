import json
from collections import Counter

with open('jobs_export.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

# Collect all tags
all_tags = []
for job in jobs:
    try:
        tags_str = job.get('tags_json', '[]')
        if tags_str:
            tags = json.loads(tags_str)
            all_tags.extend(tags)
    except:
        pass

print("Most common tags:")
for tag, count in Counter(all_tags).most_common(20):
    print(f" - {tag}: {count}")

# Let's also look at job titles to see common keywords
title_words = []
for job in jobs:
    title = job.get('title', '').lower()
    words = title.replace(',', '').replace('(', '').replace(')', '').split()
    title_words.extend(words)

print("\nMost common title words:")
stop_words = {'manager', 'specialist', 'senior', 'and', 'director', 'of', 'remote', 'analyst', 'developer', 'engineer', 'assistant', 'lead', 'coordinator', 'executive'}
filtered_words = [w for w in title_words if w not in stop_words and len(w) > 2]
for word, count in Counter(filtered_words).most_common(20):
    print(f" - {word}: {count}")
