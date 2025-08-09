import json

# Load the slides.json file
with open('content/slides.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

removed_count = 0

# Remove ALL textShadow properties from all slides
for slide in data['slides']:
    if 'styles' in slide and 'textShadow' in slide['styles']:
        del slide['styles']['textShadow']
        removed_count += 1
        print(f"✅ Removed textShadow from slide {slide['id']}: {slide['title'][:50]}...")

# Save the updated file
with open('content/slides.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n🎉 Successfully removed textShadow from {removed_count} slides!")
print("💯 NO MORE TEXT SHADOWS - All text is now clean and readable!")
