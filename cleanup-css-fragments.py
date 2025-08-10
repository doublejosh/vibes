#!/usr/bin/env python3

import json
import re

def clean_css_fragments(file_path):
    # Read the JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes_made = []
    
    # Go through each slide
    for slide in data['slides']:
        slide_id = slide['id']
        
        # Check if slide has customCSS
        if 'customCSS' in slide:
            original_css = slide['customCSS']
            fixed_css = original_css
            
            # Remove any leftover opacity fragments and malformed keyframes
            # Pattern: } [percentage] { opacity: [value]; [other properties] } }
            fixed_css = re.sub(r'\}\s*\d+%\s*\{\s*opacity:\s*[0-9.]+;[^}]*\}\s*\}', '}', fixed_css)
            
            # Remove any orphaned opacity declarations
            fixed_css = re.sub(r'\d+%\s*\{\s*opacity:\s*[0-9.]+;[^}]*\}', '', fixed_css)
            
            # Clean up double spaces and normalize
            fixed_css = re.sub(r'\s+', ' ', fixed_css)
            fixed_css = re.sub(r'\s*\}\s*\}', ' }', fixed_css)
            
            # Remove any remaining malformed keyframe fragments
            fixed_css = re.sub(r'\}\s*50%\s*\{[^}]*opacity[^}]*\}', '}', fixed_css)
            fixed_css = re.sub(r'\}\s*\d+%,?\s*\d+%\s*\{[^}]*opacity[^}]*\}', '}', fixed_css)
            
            if fixed_css != original_css:
                slide['customCSS'] = fixed_css
                changes_made.append(f"Slide {slide_id}: Cleaned up malformed CSS fragments")
        
        # Also fix any animations still referencing problematic keyframes
        if 'content' in slide:
            original_content = slide['content']
            fixed_content = original_content
            
            # Fix any remaining problematic animations in content
            if 'animation: visionFlux' in fixed_content:
                fixed_content = fixed_content.replace('animation: visionFlux 2s infinite', 'color: #ff006e; font-weight: bold')
                changes_made.append(f"Slide {slide_id}: Removed visionFlux animation from content")
            
            # Fix any remaining static opacity values that are too low
            fixed_content = re.sub(r'opacity: 0\.[0-6];', 'opacity: 0.8;', fixed_content)
            
            slide['content'] = fixed_content
    
    # Also need to fix the visionFlux keyframe in slide 17
    for slide in data['slides']:
        if slide['id'] == 17 and 'customCSS' in slide:
            original_css = slide['customCSS']
            # Replace visionFlux with non-opacity version
            fixed_css = re.sub(
                r'@keyframes visionFlux \{[^}]*\}',
                '@keyframes visionFlux { 0%, 60% { color: #ff006e; } 61%, 80% { color: #3a86ff; } 81%, 100% { color: #06ffa5; } }',
                original_css
            )
            if fixed_css != original_css:
                slide['customCSS'] = fixed_css
                changes_made.append(f"Slide 17: Fixed visionFlux keyframe to remove opacity")
    
    # Write the modified JSON back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    return changes_made

if __name__ == "__main__":
    file_path = "/Users/doublejosh/Documents/GitHub/vibes/content/slides.json"
    changes = clean_css_fragments(file_path)
    
    print("Cleaned up remaining CSS opacity fragments:")
    for change in changes:
        print(f"  ✓ {change}")
    
    if changes:
        print(f"\nTotal cleanup operations: {len(changes)}")
        print("All malformed CSS fragments should now be fixed!")
    else:
        print("\nNo CSS fragments found to clean up.")
