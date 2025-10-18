# Glassmorphism CSS Modules Quick Update
# Simplified version for immediate results

Write-Host "Glassmorphism Design System - Quick Update" -ForegroundColor Cyan

$updated = 0
$skipped = 0

# Find empty or near-empty CSS module files
$cssFiles = Get-ChildItem -Path "." -Filter "*.module.css" -Recurse

foreach ($file in $cssFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        
        # Check if file needs updating (empty or placeholder)
        if (!$content -or $content.Length -lt 50) {
            # Basic glassmorphism template
            $newContent = @"
/* Glassmorphism Component Styles */
.container {
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 300ms ease;
}
"@
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
            Write-Host " Updated: $($file.Name)" -ForegroundColor Green
            $updated++
        } else {
            $skipped++
        }
    } catch {
        Write-Host " Error: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`nSummary: Updated $updated files, Skipped $skipped files" -ForegroundColor Cyan
