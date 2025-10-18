# Glassmorphism CSS Modules Population Script
# This script populates empty CSS module files with proper glassmorphism styles

Write-Host "🎨 Glassmorphism Design System - CSS Modules Population" -ForegroundColor Cyan
Write-Host "=" * 60

$projectRoot = "e:\comsats-ite-app_5"

# Template for common module.css (base styles)
$commonTemplate = @'
/**
 * Component Base Styles
 * Shared styles for both light and dark modes
 */

.container {
  position: relative;
  width: 100%;
}

.card {
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-2px);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.description {
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  transform: translateY(-1px);
}

.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

@media (max-width: 768px) {
  .card {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .title {
    font-size: 1.125rem;
  }
}
'@

# Template for light mode
$lightTemplate = @'
/**
 * Component Light Mode Styles
 * Optimized glassmorphism for light theme
 */

.container {
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.95) 0%,
    rgba(241, 245, 249, 0.90) 100%
  );
}

.card {
  background: rgba(255, 255, 255, 0.70);
  border: 1px solid rgba(255, 255, 255, 0.30);
  box-shadow: 
    0 8px 32px rgba(31, 38, 135, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.50);
}

.card:hover {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(69, 115, 223, 0.25);
  box-shadow: 
    0 12px 40px rgba(31, 38, 135, 0.15),
    0 6px 20px rgba(31, 38, 135, 0.10);
}

.title {
  color: rgba(15, 23, 42, 0.95);
}

.description {
  color: rgba(51, 65, 85, 0.85);
}

.button {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(15, 23, 42, 0.90);
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.08);
}

.button:hover {
  background: rgba(255, 255, 255, 0.80);
  border-color: rgba(69, 115, 223, 0.30);
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

.buttonPrimary {
  background: linear-gradient(135deg, rgba(69, 115, 223, 0.90), rgba(99, 102, 241, 0.90));
  border-color: rgba(255, 255, 255, 0.20);
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(69, 115, 223, 0.25);
}

.buttonPrimary:hover {
  box-shadow: 0 12px 40px rgba(69, 115, 223, 0.35);
}
'@

# Template for dark mode
$darkTemplate = @'
/**
 * Component Dark Mode Styles
 * Optimized glassmorphism for dark theme
 */

.dark .container {
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.95) 0%,
    rgba(30, 41, 59, 0.90) 100%
  );
}

.dark .card {
  background: rgba(30, 41, 59, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.dark .card:hover {
  background: rgba(51, 65, 85, 0.65);
  border-color: rgba(69, 115, 223, 0.35);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.55),
    0 6px 20px rgba(0, 0, 0, 0.40),
    0 0 32px rgba(69, 115, 223, 0.15);
}

.dark .title {
  color: rgba(248, 250, 252, 0.95);
}

.dark .description {
  color: rgba(226, 232, 240, 0.85);
}

.dark .button {
  background: rgba(30, 41, 59, 0.60);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(248, 250, 252, 0.90);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.40),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.dark .button:hover {
  background: rgba(51, 65, 85, 0.70);
  border-color: rgba(69, 115, 223, 0.40);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.50),
    0 0 24px rgba(69, 115, 223, 0.15);
}

.dark .buttonPrimary {
  background: linear-gradient(135deg, rgba(69, 115, 223, 0.85), rgba(99, 102, 241, 0.85));
  border-color: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 
    0 8px 32px rgba(69, 115, 223, 0.35),
    0 0 24px rgba(69, 115, 223, 0.15);
}

.dark .buttonPrimary:hover {
  box-shadow: 
    0 12px 40px rgba(69, 115, 223, 0.45),
    0 0 32px rgba(69, 115, 223, 0.25);
}
'@

# Function to update CSS module file
function Update-CSSModule {
    param(
        [string]$FilePath,
        [string]$Content
    )
    
    if (Test-Path $FilePath) {
        $currentContent = Get-Content $FilePath -Raw
        
        # Check if file is empty or just has placeholder content
        $isPlaceholder = ($currentContent.Length -lt 100) -or `
                        ($currentContent -match '^\s*/\*.*\*/\s*:root\s*\{\}\s*.root\s*\{\}\s*$') -or `
                        ($currentContent -match '^\s*/\*.*\*/\s*$')
        
        if ($isPlaceholder) {
            Set-Content -Path $FilePath -Value $Content -Encoding UTF8
            Write-Host "  ✓ Updated: $FilePath" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ⊘ Skipped (has content): $FilePath" -ForegroundColor Yellow
            return $false
        }
    }
    return $false
}

# Find and update CSS module files
Write-Host "`n📁 Scanning for CSS module files..." -ForegroundColor Cyan

$stats = @{
    Common = 0
    Light = 0
    Dark = 0
    Skipped = 0
}

# Process .module.css files (common/base)
Get-ChildItem -Path $projectRoot -Filter "*.module.css" -Recurse | ForEach-Object {
    $baseName = $_.BaseName
    
    # Skip if it's a .light or .dark variant
    if ($baseName -notmatch '\.(light|dark)$') {
        if (Update-CSSModule -FilePath $_.FullName -Content $commonTemplate) {
            $stats.Common++
        } else {
            $stats.Skipped++
        }
    }
}

# Process .light.module.css files
Get-ChildItem -Path $projectRoot -Filter "*.light.module.css" -Recurse | ForEach-Object {
    if (Update-CSSModule -FilePath $_.FullName -Content $lightTemplate) {
        $stats.Light++
    } else {
        $stats.Skipped++
    }
}

# Process .dark.module.css files
Get-ChildItem -Path $projectRoot -Filter "*.dark.module.css" -Recurse | ForEach-Object {
    if (Update-CSSModule -FilePath $_.FullName -Content $darkTemplate) {
        $stats.Dark++
    } else {
        $stats.Skipped++
    }
}

# Display results
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "📊 Update Summary:" -ForegroundColor Cyan
Write-Host "  Common/Base modules: $($stats.Common)" -ForegroundColor Green
Write-Host "  Light mode modules:  $($stats.Light)" -ForegroundColor Green
Write-Host "  Dark mode modules:   $($stats.Dark)" -ForegroundColor Green
Write-Host "  Skipped (existing):  $($stats.Skipped)" -ForegroundColor Yellow
Write-Host "  Total updated:       $($stats.Common + $stats.Light + $stats.Dark)" -ForegroundColor Cyan

Write-Host "`n✅ CSS Modules population complete!" -ForegroundColor Green
Write-Host "`n📚 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review updated files in your editor" -ForegroundColor White
Write-Host "  2. Customize styles for specific components" -ForegroundColor White
Write-Host "  3. Test in both light and dark modes" -ForegroundColor White
Write-Host "  4. Read docs/GLASSMORPHISM_DESIGN_SYSTEM.md for usage guide" -ForegroundColor White
