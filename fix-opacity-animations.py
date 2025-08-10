#!/usr/bin/env python3

import json
import re

def fix_opacity_animations(file_path):
    # Read the JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes_made = []
    
    # Go through each slide
    for slide in data['slides']:
        slide_id = slide['id']
        
        # Check if slide has customCSS with opacity animations
        if 'customCSS' in slide:
            original_css = slide['customCSS']
            
            # Fix various opacity-related keyframes
            fixed_css = original_css
            
            # Fix humanPulse animation - remove opacity changes, keep color changes
            fixed_css = re.sub(
                r'@keyframes humanPulse \{[^}]*\}',
                '@keyframes humanPulse { 0%, 100% { color: #ff69b4; } 50% { color: #87ceeb; } }',
                fixed_css
            )
            
            # Fix codeFlicker animation - remove opacity changes
            fixed_css = re.sub(
                r'@keyframes codeFlicker \{[^}]*\}',
                '@keyframes codeFlicker { 0%, 100% { color: #ffffff; } 50% { color: #ffff99; } }',
                fixed_css
            )
            
            # Fix textGlitch animation - remove opacity changes
            fixed_css = re.sub(
                r'@keyframes textGlitch \{[^}]*\}',
                '@keyframes textGlitch { 0%, 100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(180deg); } }',
                fixed_css
            )
            
            # Fix typewriter animation - remove opacity changes
            fixed_css = re.sub(
                r'@keyframes typewriter \{[^}]*\}',
                '@keyframes typewriter { 0%, 100% { color: #00ff00; } 50% { color: #80ff80; } }',
                fixed_css
            )
            
            # Fix urgentBlink animation - remove opacity changes
            fixed_css = re.sub(
                r'@keyframes urgentBlink \{[^}]*\}',
                '@keyframes urgentBlink { 0%, 50% { color: #ff006e; } 51%, 100% { color: #ffbe0b; } }',
                fixed_css
            )
            
            # Fix timelessFlicker animation - remove opacity changes
            fixed_css = re.sub(
                r'@keyframes timelessFlicker \{[^}]*\}',
                '@keyframes timelessFlicker { 0%, 100% { color: #ffffff; } 50% { color: #ffff80; } }',
                fixed_css
            )
            
            # Fix textGlow animation - remove opacity changes
            fixed_css = re.sub(
                r'@keyframes textGlow \{[^}]*\}',
                '@keyframes textGlow { from { color: #ffffff; } to { color: #ffff80; } }',
                fixed_css
            )
            
            # Fix chaosShimmer animation - remove opacity changes
            fixed_css = re.sub(
                r'@keyframes chaosShimmer \{[^}]*\}',
                '@keyframes chaosShimmer { 0%, 70% { color: #ff006e; } 71%, 75% { color: #3a86ff; } 76%, 100% { color: #06ffa5; } }',
                fixed_css
            )
            
            # Fix chaosWisper animation - remove opacity changes
            fixed_css = re.sub(
                r'@keyframes chaosWisper \{[^}]*\}',
                '@keyframes chaosWisper { 0%, 100% { color: #ffffff; } 50% { color: #ff80ff; } }',
                fixed_css
            )
            
            # Fix any remaining opacity animations with a general pattern
            fixed_css = re.sub(
                r'opacity:\s*[0-9.]+',
                'opacity: 1',
                fixed_css
            )
            
            if fixed_css != original_css:
                slide['customCSS'] = fixed_css
                changes_made.append(f"Slide {slide_id}: Fixed opacity animations")
        
        # Also remove animations from spans in content that use opacity-changing animations
        if 'content' in slide:
            original_content = slide['content']
            
            # Remove problematic animations from spans
            fixed_content = original_content
            
            # Replace specific problematic animations with safer alternatives
            animations_to_fix = [
                'humanPulse', 'codeFlicker', 'textGlitch', 'typewriter', 
                'urgentBlink', 'timelessFlicker', 'chaosShimmer', 'chaosWisper',
                'panic', 'partnershipDance'
            ]
            
            for anim in animations_to_fix:
                # Remove the animation and replace with solid styling
                pattern = f"animation:\\s*{anim}[^;'\"]*"
                if re.search(pattern, fixed_content):
                    fixed_content = re.sub(pattern, 'color: #ffffff; font-weight: bold', fixed_content)
                    if anim not in [change.split(':')[1].strip() for change in changes_made if f"Slide {slide_id}" in change]:
                        changes_made.append(f"Slide {slide_id}: Removed {anim} animation from content")
            
            slide['content'] = fixed_content
    
    # Write the modified JSON back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    return changes_made

if __name__ == "__main__":
    file_path = "/Users/doublejosh/Documents/GitHub/vibes/content/slides.json"
    changes = fix_opacity_animations(file_path)
    
    print("Fixed opacity animations for better readability:")
    for change in changes:
        print(f"  ✓ {change}")
    
    if changes:
        print(f"\nTotal changes made: {len(changes)}")
        print("All text should now be consistently readable without fading effects!")
    else:
        print("\nNo opacity-related animations found to fix.")
