# Automated Glassmorphism Enhancement Script
# This script enhances CSS module files with high-quality glassmorphism

$ErrorActionPreference = "Continue"
$projectRoot = "e:\comsats-ite-app_5"

Write-Host "=== Glassmorphism Enhancement Tool ===" -ForegroundColor Cyan
Write-Host "This will enhance CSS modules with glassmorphism effects" -ForegroundColor Yellow
Write-Host ""

# Get CSS module files (excluding already processed ones with heavy glassmorphism)
$cssFiles = Get-ChildItem -Path $projectRoot -Recurse -Filter "*.module.css" | 
    Where-Object { $_.FullName -notmatch "node_modules" }

Write-Host "Found $($cssFiles.Count) CSS module files" -ForegroundColor Green

# Glassmorphism enhancement snippets
$glassEnhancements = @{
    container = @"

/* Enhanced Glassmorphism Container */
.container {
  backdrop-filter: blur(16px) saturate(180%);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.45);
}
"@

    card = @"

/* Glass Card Component */
.card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: clamp(12px, 2vw, 20px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.02);
}
"@

    button = @"

/* Glass Button */
.button {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
}
"@

    header = @"

/* Glass Header */
.header {
  backdrop-filter: blur(20px);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}
"@
}

# Process files
$enhanced = 0
$skipped = 0

foreach ($file in $cssFiles) {
    $content = Get-Content $file.FullName | Out-String
    
    # Skip if already has substantial glassmorphism
    if ($content -match "backdrop-filter.*blur" -and 
        $content -match "box-shadow.*inset" -and
        $content.Length -gt 500) {
        $skipped++
        continue
    }
    
    # Check if file is minimal (needs enhancement)
    if ($content.Length -lt 200 -or $content -notmatch "backdrop-filter") {
        # Add glassmorphism enhancements
        $newContent = $content
        
        # Add container styles if not present
        if ($content -notmatch "\.container") {
            $newContent += $glassEnhancements.container
        }
        
        # Add card styles if not present
        if ($content -notmatch "\.card" -and $content -match "card" -i) {
            $newContent += $glassEnhancements.card
        }
        
        # Add button styles if not present
        if ($content -notmatch "\.button" -and $content -match "button" -i) {
            $newContent += $glassEnhancements.button
        }
        
        # Add header styles if not present
        if ($content -notmatch "\.header" -and $content -match "header" -i) {
            $newContent += $glassEnhancements.header
        }
        
        # Only write if we added something
        if ($newContent -ne $content) {
            $newContent | Out-File $file.FullName -Encoding UTF8
            $enhanced++
            $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart("\")
            Write-Host "Enhanced: $relativePath" -ForegroundColor Green
        }
    } else {
        $skipped++
    }
}

Write-Host "`n=== Enhancement Summary ===" -ForegroundColor Cyan
Write-Host "Total files: $($cssFiles.Count)" -ForegroundColor White
Write-Host "Enhanced: $enhanced" -ForegroundColor Green
Write-Host "Skipped (already good): $skipped" -ForegroundColor Yellow

Write-Host "`nNote: Review and customize enhanced files as needed" -ForegroundColor Yellow
