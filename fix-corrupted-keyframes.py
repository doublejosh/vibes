#!/usr/bin/env python3

import json

def fix_corrupted_keyframes(file_path):
    # Read the JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes_made = []
    
    # Fix slide 14 (line 190) - completely rebuild the CSS
    for slide in data['slides']:
        if slide['id'] == 14 and 'customCSS' in slide:
            # Replace with clean, working CSS
            slide['customCSS'] = "@keyframes psychedelic { 0%, 100% { filter: hue-rotate(0deg) saturate(1) brightness(1); } 25% { filter: hue-rotate(90deg) saturate(2) brightness(1.2); } 50% { filter: hue-rotate(180deg) saturate(3) brightness(0.8); } 75% { filter: hue-rotate(270deg) saturate(2) brightness(1.5); } } @keyframes textGlow { from { color: #ffffff; } to { color: #ffff80; } } @keyframes creativeFlow { 0%, 100% { transform: skewX(0deg); } 50% { transform: skewX(2deg); } } @keyframes partnershipDance { 0% { color: #ff006e; transform: translateX(0); } 100% { color: #3a86ff; transform: translateX(10px); } }"
            changes_made.append(f"Slide 14: Rebuilt corrupted CSS keyframes")
    
    # Fix slide 20 (line 286) - completely rebuild the CSS
    for slide in data['slides']:
        if slide['id'] == 20 and 'customCSS' in slide:
            # Replace with clean, working CSS
            slide['customCSS'] = "@keyframes finalGlow { from { filter: brightness(1.3) contrast(1.2) saturate(1.5); } to { filter: brightness(2) contrast(1.8) saturate(2.5); } } @keyframes vibesForever { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.05); } 75% { transform: scale(0.95); } } @keyframes vibesPulse { 0%, 50% { transform: scale(1); } 51%, 100% { transform: scale(1.2); } } @keyframes infiniteVibes { 0%, 100% { color: #ff006e; transform: translateY(0); } 33% { color: #3a86ff; transform: translateY(-10px); } 66% { color: #06ffa5; transform: translateY(5px); } } @keyframes whisperEnd { 0%, 100% { color: #ffffff; } 50% { color: #ff80ff; } }"
            changes_made.append(f"Slide 20: Rebuilt corrupted CSS keyframes")
    
    # Write the modified JSON back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    return changes_made

if __name__ == "__main__":
    file_path = "/Users/doublejosh/Documents/GitHub/vibes/content/slides.json"
    changes = fix_corrupted_keyframes(file_path)
    
    print("Fixed corrupted keyframes:")
    for change in changes:
        print(f"  ✓ {change}")
    
    if changes:
        print(f"\nTotal fixes: {len(changes)}")
        print("All corrupted CSS keyframes have been rebuilt!")
    else:
        print("\nNo corrupted keyframes found to fix.")
