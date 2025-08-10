#!/usr/bin/env python3

import json
import re

def cleanup_remaining_filters(file_path):
    # Read the JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes_made = []
    
    # Go through each slide
    for slide in data['slides']:
        slide_id = slide['id']
        
        # Fix problematic CSS that has leftover fragments
        if 'customCSS' in slide:
            original_css = slide['customCSS']
            fixed_css = original_css
            
            # Slide 15: Fix megaPulse animation (still has brightness(2))
            if slide_id == 15:
                fixed_css = re.sub(
                    r'@keyframes megaPulse \{[^}]*\}',
                    '@keyframes megaPulse { 0%, 100% { filter: brightness(1.1) contrast(1.1); } 50% { filter: brightness(1.3) contrast(1.3); } }',
                    fixed_css
                )
                changes_made.append(f"Slide 15: Fixed megaPulse animation")
            
            # Slide 16: Clean up leftover fragments from previous fix
            if slide_id == 16:
                # Remove leftover fragments completely and rebuild cleanly
                fixed_css = "@keyframes softGlow { from { filter: brightness(1.1) contrast(1.1) saturate(1.2); } to { filter: brightness(1.2) contrast(1.2) saturate(1.3); } } @keyframes gentleBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } } @keyframes magicRotation { 0% { background-position: 0% 50%, 0px 0px; } 100% { background-position: 100% 50%, 40px 40px; } } @keyframes magicSparkle { 0%, 50% { color: #ffbe0b; } 51%, 100% { color: #ff006e; } }"
                changes_made.append(f"Slide 16: Cleaned up CSS fragments")
            
            # Slide 18: Clean up leftover fragments and rebuild
            if slide_id == 18:
                # The CSS is severely corrupted, rebuild it completely
                fixed_css = "@keyframes explosiveChaos { 0% { background-position: 0 0, 100px 50px, 200px 100px, 50px 150px, 300px 0, 0 0, 0 0; transform: scale(1); } 25% { background-position: 50px 25px, 150px 75px, 0 200px, 250px 50px, 100px 200px, 100px 100px, 10px 10px; transform: scale(1.05); } 50% { background-position: 100px 50px, 0 100px, 300px 0, 150px 200px, 200px 100px, 200px 200px, 20px 0; transform: scale(0.98); } 75% { background-position: 150px 75px, 250px 25px, 100px 300px, 0 100px, 50px 150px, 300px 300px, 30px 10px; transform: scale(1.02); } 100% { background-position: 0 0, 100px 50px, 200px 100px, 50px 150px, 300px 0, 0 0, 0 0; transform: scale(1); } } @keyframes glitchEffect { 0%, 100% { filter: hue-rotate(0deg) saturate(1.2) brightness(1.1) contrast(1.1); } 20% { filter: hue-rotate(72deg) saturate(1.3) brightness(1.2) contrast(1.2); } 40% { filter: hue-rotate(144deg) saturate(1.2) brightness(1.1) contrast(1.1); } 60% { filter: hue-rotate(216deg) saturate(1.3) brightness(1.2) contrast(1.2); } 80% { filter: hue-rotate(288deg) saturate(1.2) brightness(1.1) contrast(1.1); } } @keyframes colorExplosion { from { filter: brightness(1.1) contrast(1.1) saturate(1.2); } to { filter: brightness(1.3) contrast(1.3) saturate(1.4); } } @keyframes deathOfPerfection { 0%, 70% { color: #ff006e; } 71%, 85% { color: #000000; } 86%, 100% { color: #ff006e; } } @keyframes resurrect { 0%, 50% { color: #ffffff; } 51%, 60% { color: #ff80ff; } 61%, 100% { color: #ffffff; } }"
                changes_made.append(f"Slide 18: Rebuilt corrupted CSS animations")
            
            # Slide 19: Clean up the extremely corrupted CSS
            if slide_id == 19:
                # Rebuild the CSS completely with safe values
                fixed_css = "@keyframes ultimateChaos { 0% { background-position: 0 0, 50px 25px, 100px 50px, 0 0; transform: scale(1) skew(0deg); } 16% { background-position: 20px 10px, 80px 60px, 150px 20px, 20px 20px; transform: scale(1.03) skew(1deg); } 33% { background-position: 40px 20px, 10px 90px, 200px 80px, 40px 10px; transform: scale(0.97) skew(-1deg); } 50% { background-position: 60px 30px, 120px 20px, 50px 150px, 60px 30px; transform: scale(1.01) skew(0.5deg); } 66% { background-position: 80px 40px, 30px 100px, 180px 10px, 80px 50px; transform: scale(0.99) skew(-0.5deg); } 83% { background-position: 100px 50px, 90px 40px, 120px 120px, 100px 70px; transform: scale(1.02) skew(0.8deg); } 100% { background-position: 0 0, 50px 25px, 100px 50px, 0 0; transform: scale(1) skew(0deg); } } @keyframes megaGlitch { 0%, 100% { filter: hue-rotate(0deg) saturate(1.3) brightness(1.2) contrast(1.2); } 20% { filter: hue-rotate(72deg) saturate(1.4) brightness(1.3) contrast(1.3); } 40% { filter: hue-rotate(144deg) saturate(1.2) brightness(1.1) contrast(1.1); } 60% { filter: hue-rotate(216deg) saturate(1.4) brightness(1.3) contrast(1.3); } 80% { filter: hue-rotate(288deg) saturate(1.3) brightness(1.2) contrast(1.2); } } @keyframes finalExplosion { from { transform: scale(1); filter: brightness(1.2) contrast(1.2) saturate(1.3); } to { transform: scale(1.08); filter: brightness(1.4) contrast(1.4) saturate(1.5); } } @keyframes urgentShake { 0%, 100% { transform: translateX(0) translateY(0); } 25% { transform: translateX(-2px) translateY(1px); } 75% { transform: translateX(2px) translateY(-1px); } } @keyframes urgentPulse { 0%, 50% { color: #ff006e; } 51%, 100% { color: #ffbe0b; } } @keyframes codeUrgency { 0%, 60% { background: rgba(255,69,0,0.5); } 61%, 100% { background: rgba(255,20,147,0.8); } } @keyframes bounceInsane { 0%, 50% { transform: translateY(0) scale(1); } 51%, 100% { transform: translateY(-10px) scale(1.1); } } @keyframes whisperUrgent { 0%, 70% { color: #ffffff; } 71%, 85% { color: #ff80ff; } 86%, 100% { color: #ffffff; } }"
                changes_made.append(f"Slide 19: Rebuilt extremely corrupted CSS")
            
            # Slide 20: Fix finalGlow to reduce brightness(2) to safer values
            if slide_id == 20:
                fixed_css = re.sub(
                    r'@keyframes finalGlow \{[^}]*\}',
                    '@keyframes finalGlow { from { filter: brightness(1.3) contrast(1.2) saturate(1.5); } to { filter: brightness(1.5) contrast(1.4) saturate(1.8); } }',
                    fixed_css
                )
                changes_made.append(f"Slide 20: Fixed finalGlow animation")
            
            if fixed_css != original_css:
                slide['customCSS'] = fixed_css
    
    # Write the modified JSON back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    return changes_made

if __name__ == "__main__":
    file_path = "/Users/doublejosh/Documents/GitHub/vibes/content/slides.json"
    changes = cleanup_remaining_filters(file_path)
    
    print("Cleaned up remaining problematic filter animations:")
    for change in changes:
        print(f"  ✓ {change}")
    
    if changes:
        print(f"\nTotal fixes: {len(changes)}")
        print("All extreme filter values should now be fixed for maximum text readability!")
    else:
        print("\nNo remaining problematic filters found.")
