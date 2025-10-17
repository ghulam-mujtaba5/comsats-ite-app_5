# Fix CSS Module pure selector issues by removing standalone :root and :global selectors
# CSS Modules require all selectors to contain at least one local class/id

$appPath = "E:\comsats-ite-app_5\app"
$files = Get-ChildItem -Path $appPath -Filter "*.module.css" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $isDark = $file.Name -match "\.dark\.module\.css$"
    
    # Remove standalone :root declarations (they're not allowed in CSS Modules)
    $content = $content -replace '(?m)^\s*:root\s*\{[^}]*\}\s*$', ''
    
    # Remove empty :global() rulesets
    $content = $content -replace '(?m)^\s*:global\([^)]+\)\s*\{\s*\}\s*$', ''
    
    # Clean up multiple blank lines
    $content = $content -replace '(?m)^\s*\n\s*\n\s*\n', "`n`n"
    
    # Ensure file has content
    if ($content -match '\S') {
        Set-Content -Path $file.FullName -Value $content.TrimEnd() -NoNewline
        Write-Host "Cleaned: $($file.FullName)"
    }
}

Write-Host "`nAll CSS modules cleaned!"
