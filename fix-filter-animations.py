#!/usr/bin/env python3

import json
import re

def fix_filter_animations(file_path):
    # Read the JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes_made = []
    
    # Go through each slide
    for slide in data['slides']:
        slide_id = slide['id']
        
        # Remove problematic static filters from slide styles that affect text readability
        if 'styles' in slide:
            original_styles = slide['styles']
            
            # Remove extreme filter values that make white text unreadable
            if 'filter' in slide['styles']:
                original_filter = slide['styles']['filter']
                # Remove filters that have extreme saturation/brightness that affect text
                if 'saturate(3)' in original_filter or 'brightness(1.5)' in original_filter:
                    # Replace with much milder filter
                    slide['styles']['filter'] = "brightness(1.1) contrast(1.1) saturate(1.2)"
                    changes_made.append(f"Slide {slide_id}: Reduced extreme filter values")
        
        # Fix problematic keyframe animations that affect text readability
        if 'customCSS' in slide:
            original_css = slide['customCSS']
            fixed_css = original_css
            
            # Fix softGlow animation (slide 16) - extremely problematic for white text
            fixed_css = re.sub(
                r'@keyframes softGlow \{[^}]*\}',
                '@keyframes softGlow { from { filter: brightness(1.1) contrast(1.1) saturate(1.2); } to { filter: brightness(1.2) contrast(1.2) saturate(1.3); } }',
                fixed_css
            )
            
            # Fix psychedelic animation (slide 14) - causes brightness to go to 0.8 making text unreadable
            fixed_css = re.sub(
                r'@keyframes psychedelic \{[^}]*\}',
                '@keyframes psychedelic { 0%, 100% { filter: hue-rotate(0deg) saturate(1.2) brightness(1.1); } 25% { filter: hue-rotate(90deg) saturate(1.3) brightness(1.1); } 50% { filter: hue-rotate(180deg) saturate(1.2) brightness(1.1); } 75% { filter: hue-rotate(270deg) saturate(1.3) brightness(1.1); } }',
                fixed_css
            )
            
            # Fix colorMadness animation (slide 17) - extreme saturation changes
            fixed_css = re.sub(
                r'@keyframes colorMadness \{[^}]*\}',
                '@keyframes colorMadness { from { filter: hue-rotate(0deg) saturate(1.2) brightness(1.1); } to { filter: hue-rotate(360deg) saturate(1.4) brightness(1.2); } }',
                fixed_css
            )
            
            # Fix glitchEffect animation (slide 18) - extreme brightness/saturation variations
            fixed_css = re.sub(
                r'@keyframes glitchEffect \{[^}]*\}',
                '@keyframes glitchEffect { 0%, 100% { filter: hue-rotate(0deg) saturate(1.2) brightness(1.1) contrast(1.1); } 20% { filter: hue-rotate(72deg) saturate(1.3) brightness(1.2) contrast(1.2); } 40% { filter: hue-rotate(144deg) saturate(1.2) brightness(1.1) contrast(1.1); } 60% { filter: hue-rotate(216deg) saturate(1.3) brightness(1.2) contrast(1.2); } 80% { filter: hue-rotate(288deg) saturate(1.2) brightness(1.1) contrast(1.1); } }',
                fixed_css
            )
            
            # Fix colorExplosion animation (slide 18) - extreme saturation/brightness
            fixed_css = re.sub(
                r'@keyframes colorExplosion \{[^}]*\}',
                '@keyframes colorExplosion { from { filter: brightness(1.1) contrast(1.1) saturate(1.2); } to { filter: brightness(1.3) contrast(1.3) saturate(1.4); } }',
                fixed_css
            )
            
            # Fix timelessGlow animation (slide 13) - moderate but still problematic
            fixed_css = re.sub(
                r'@keyframes timelessGlow \{[^}]*\}',
                '@keyframes timelessGlow { 0%, 100% { filter: hue-rotate(0deg) saturate(1.1); } 50% { filter: hue-rotate(60deg) saturate(1.2); } }',
                fixed_css
            )
            
            # Fix humanGlow animation (slide 6) - less problematic but still fix
            fixed_css = re.sub(
                r'@keyframes humanGlow \{[^}]*\}',
                '@keyframes humanGlow { 0% { filter: hue-rotate(0deg) saturate(1.1); } 100% { filter: hue-rotate(30deg) saturate(1.2); } }',
                fixed_css
            )
            
            # Fix organicGrowth animation (slide 11) - moderate saturation changes
            fixed_css = re.sub(
                r'@keyframes organicGrowth \{[^}]*\}',
                '@keyframes organicGrowth { 0%, 100% { transform: scale(1); filter: hue-rotate(0deg) saturate(1.1); } 25% { transform: scale(1.02); filter: hue-rotate(10deg) saturate(1.2); } 50% { transform: scale(0.98); filter: hue-rotate(-5deg) saturate(1.1); } 75% { transform: scale(1.01); filter: hue-rotate(15deg) saturate(1.2); } }',
                fixed_css
            )
            
            if fixed_css != original_css:
                slide['customCSS'] = fixed_css
                changes_made.append(f"Slide {slide_id}: Fixed filter animations for readability")
    
    # Write the modified JSON back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    return changes_made

if __name__ == "__main__":
    file_path = "/Users/doublejosh/Documents/GitHub/vibes/content/slides.json"
    changes = fix_filter_animations(file_path)
    
    print("Fixed problematic filter animations for text readability:")
    for change in changes:
        print(f"  ✓ {change}")
    
    if changes:
        print(f"\nTotal fixes: {len(changes)}")
        print("White text should now be consistently readable without extreme pulsing!")
    else:
        print("\nNo problematic filter animations found to fix.")
