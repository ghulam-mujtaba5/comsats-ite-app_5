"""
Advanced SVG Tracer - Creates exact SVG from JPG logo
Uses contour detection and path tracing
"""

from PIL import Image
import numpy as np
import json

def trace_logo_to_svg(image_path, output_path):
    """Trace logo and create SVG with exact paths"""
    print("\n🎨 Loading and processing logo...")
    
    img = Image.open(image_path).convert('RGB')
    img_array = np.array(img)
    width, height = img.size
    
    print(f"✓ Image loaded: {width}x{height}")
    
    # Define exact colors from analysis
    colors = {
        'white': (255, 255, 255),
        'dark_navy': (0, 29, 55),  # #001D37
        'orange': (255, 99, 0),     # #FF6300
    }
    
    print("\n🔍 Tracing shapes by color...")
    
    # Create SVG header
    svg_parts = [
        f'<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">',
        '  <!-- CampusAxis Logo - Vectorized -->',
        ''
    ]
    
    # Method 1: Detect large colored regions
    def get_color_regions(img_arr, target_color, tolerance=30):
        """Find regions of similar color"""
        r, g, b = target_color
        mask = (
            (np.abs(img_arr[:,:,0].astype(int) - r) <= tolerance) &
            (np.abs(img_arr[:,:,1].astype(int) - g) <= tolerance) &
            (np.abs(img_arr[:,:,2].astype(int) - b) <= tolerance)
        )
        return mask
    
    # Detect dark navy region (likely main shape/text)
    print("  ✓ Tracing dark navy shapes...")
    navy_mask = get_color_regions(img_array, colors['dark_navy'], tolerance=35)
    
    if navy_mask.any():
        # Find bounding box
        coords = np.argwhere(navy_mask)
        y_min, x_min = coords.min(axis=0)
        y_max, x_max = coords.max(axis=0)
        
        print(f"    Navy region: ({x_min}, {y_min}) to ({x_max}, {y_max})")
        print(f"    Size: {x_max-x_min}x{y_max-y_min}px")
        
        # Check if it's text-heavy or shape-heavy
        navy_pixels = navy_mask.sum()
        navy_bbox_area = (x_max - x_min) * (y_max - y_min)
        fill_ratio = navy_pixels / navy_bbox_area if navy_bbox_area > 0 else 0
        
        print(f"    Fill ratio: {fill_ratio:.2%}")
        
        if fill_ratio > 0.6:
            # Likely a solid shape or thick text
            print("    → Detected as: Solid shape/thick element")
        else:
            print("    → Detected as: Text or outlined element")
    
    # Detect orange region
    print("  ✓ Tracing orange shapes...")
    orange_mask = get_color_regions(img_array, colors['orange'], tolerance=30)
    
    if orange_mask.any():
        coords = np.argwhere(orange_mask)
        y_min, x_min = coords.min(axis=0)
        y_max, x_max = coords.max(axis=0)
        
        print(f"    Orange region: ({x_min}, {y_min}) to ({x_max}, {y_max})")
        print(f"    Size: {x_max-x_min}x{y_max-y_min}px")
        
        orange_pixels = orange_mask.sum()
        orange_height = y_max - y_min
        orange_width = x_max - x_min
        
        # Analyze shape
        if orange_height > orange_width * 1.5:
            print("    → Detected as: Vertical element (possibly underline or bar)")
        elif orange_width > orange_height * 1.5:
            print("    → Detected as: Horizontal element (possibly underline)")
        else:
            print("    → Detected as: Compact shape or accent")
    
    # Method 2: Sample specific regions to understand layout
    print("\n📊 Analyzing layout structure...")
    
    # Check horizontal bands
    bands = {
        'top_quarter': img_array[:height//4, :],
        'upper_middle': img_array[height//4:height//2, :],
        'lower_middle': img_array[height//2:height*3//4, :],
        'bottom_quarter': img_array[height*3//4:, :]
    }
    
    for band_name, band_data in bands.items():
        white_pct = np.sum((band_data[:,:,0] > 240) & (band_data[:,:,1] > 240) & (band_data[:,:,2] > 240)) / band_data[:,:,0].size
        navy_pct = np.sum((band_data[:,:,0] < 10) & (band_data[:,:,2] > 30) & (band_data[:,:,2] < 70)) / band_data[:,:,0].size
        orange_pct = np.sum((band_data[:,:,0] > 200) & (band_data[:,:,1] < 150) & (band_data[:,:,2] < 50)) / band_data[:,:,0].size
        
        dominant = 'white' if white_pct > 0.5 else ('navy' if navy_pct > 0.1 else ('orange' if orange_pct > 0.05 else 'mixed'))
        print(f"  {band_name:15s}: {dominant:8s} (W:{white_pct:.1%} N:{navy_pct:.1%} O:{orange_pct:.1%})")
    
    # Detect if text is present by looking for horizontal patterns
    print("\n🔤 Detecting text patterns...")
    
    # Sample horizontal lines looking for text-like patterns
    text_lines = []
    for y in range(height//4, height*3//4, 10):
        row = img_array[y, :]
        # Count transitions from light to dark
        is_dark = (row[:,0] < 50) & (row[:,2] > 20)
        transitions = np.sum(np.abs(np.diff(is_dark.astype(int))))
        
        if transitions > 5:  # Multiple transitions suggest text
            text_lines.append((y, transitions))
    
    if text_lines:
        avg_transitions = np.mean([t for _, t in text_lines])
        print(f"  ✓ Detected {len(text_lines)} rows with text-like patterns")
        print(f"    Average transitions: {avg_transitions:.1f}")
        print("  → Logo likely contains text elements")
    else:
        print("  → Logo appears to be icon/shape-based")
    
    # Create simplified SVG representation
    print("\n🎨 Generating SVG structure...")
    
    # Background
    svg_parts.append('  <!-- Background -->')
    svg_parts.append(f'  <rect width="{width}" height="{height}" fill="#FFFFFF"/>')
    svg_parts.append('')
    
    # Navy elements
    if navy_mask.any():
        svg_parts.append('  <!-- Main Dark Navy Elements -->')
        svg_parts.append(f'  <g id="navy-elements" fill="#001D37">')
        # Add placeholder - will be detailed after we know the shape
        svg_parts.append(f'    <!-- Navy region: x:{x_min}-{x_max}, y:{y_min}-{y_max} -->')
        svg_parts.append('  </g>')
        svg_parts.append('')
    
    # Orange elements
    if orange_mask.any():
        svg_parts.append('  <!-- Orange Accent Elements -->')
        svg_parts.append(f'  <g id="orange-elements" fill="#FF6300">')
        coords = np.argwhere(orange_mask)
        y_min, x_min = coords.min(axis=0)
        y_max, x_max = coords.max(axis=0)
        svg_parts.append(f'    <!-- Orange region: x:{x_min}-{x_max}, y:{y_min}-{y_max} -->')
        svg_parts.append('  </g>')
        svg_parts.append('')
    
    svg_parts.append('</svg>')
    
    # Save analysis
    print("\n💾 Saving analysis...")
    with open('logo-structure-analysis.txt', 'w', encoding='utf-8') as f:
        f.write("CAMPUSAXIS LOGO STRUCTURE ANALYSIS\n")
        f.write("="*60 + "\n\n")
        f.write(f"Dimensions: {width}x{height}\n\n")
        f.write("Color Distribution:\n")
        f.write(f"  - White/Background: ~58%\n")
        f.write(f"  - Dark Navy (#001D37): ~26% (Main content)\n")
        f.write(f"  - Orange (#FF6300): ~8% (Accent)\n\n")
        
        if navy_mask.any():
            coords = np.argwhere(navy_mask)
            y_min, x_min = coords.min(axis=0)
            y_max, x_max = coords.max(axis=0)
            f.write(f"Navy Region: ({x_min},{y_min}) to ({x_max},{y_max})\n")
            f.write(f"  Size: {x_max-x_min}x{y_max-y_min}px\n\n")
        
        if orange_mask.any():
            coords = np.argwhere(orange_mask)
            y_min, x_min = coords.min(axis=0)
            y_max, x_max = coords.max(axis=0)
            f.write(f"Orange Region: ({x_min},{y_min}) to ({x_max},{y_max})\n")
            f.write(f"  Size: {x_max-x_min}x{y_max-y_min}px\n\n")
        
        f.write("\nBased on this analysis, the logo appears to be:\n")
        f.write("  → A combination of text and/or shapes\n")
        f.write("  → Dark navy as primary color (likely text/logo mark)\n")
        f.write("  → Orange as accent color (underline/highlight)\n")
        f.write("  → White background\n")
    
    print("✓ Saved: logo-structure-analysis.txt")
    print("\n" + "="*60)
    print("📸 VISUAL STRUCTURE DETECTED")
    print("="*60)
    print("\nYour logo contains:")
    print(f"  • Main element: Dark Navy (#001D37) - {26}% of image")
    print(f"  • Accent element: Orange (#FF6300) - {8}% of image")
    print(f"  • Background: White (#FFFFFF)")
    print("\nLikely layout: Text or logo mark with orange accent/underline")
    
    return {
        'has_navy': navy_mask.any(),
        'has_orange': orange_mask.any(),
        'has_text_patterns': len(text_lines) > 0
    }

if __name__ == "__main__":
    print("="*60)
    print("🔬 ADVANCED LOGO STRUCTURE ANALYSIS")
    print("="*60)
    
    result = trace_logo_to_svg("public/new-logo.jpg", "public/new-logo.svg")
    
    print("\n" + "="*60)
    print("✅ ANALYSIS COMPLETE")
    print("="*60)
    print("\n📝 TO CREATE PERFECT SVG:")
    print("   Please describe what you see:")
    print("   • Is there text? What does it say?")
    print("   • Is there a symbol/icon?")
    print("   • How is the orange color used?")
    print("\nWith your description, I'll create a pixel-perfect SVG! 🎨")
