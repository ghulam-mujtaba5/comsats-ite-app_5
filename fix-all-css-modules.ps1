# Fix all CSS module files that have bare :global() selectors
# These need to be scoped with a local class to be "pure"

$files = Get-ChildItem -Path . -Recurse -Filter "*.module.css"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Pattern 1: .darkTheme { ... } followed by :global(html.dark)
    # Replace with: .darkTheme :global(html.dark)
    $content = $content -replace '(?m)^\.darkTheme\s*\{[^}]*\}\s*\n\s*\n(?=:global\(html\.dark\))', '.darkTheme '
    
    # Pattern 2: .lightTheme { ... } followed by :global(html:not(.dark))
    # Replace with: .lightTheme :global(html:not(.dark))
    $content = $content -replace '(?m)^\.lightTheme\s*\{[^}]*\}\s*\n\s*\n(?=:global\(html:not\(\.dark\)\))', '.lightTheme '
    
    # Pattern 3: Standalone :global(html.dark) at start of line (not already prefixed)
    # Add .darkTheme prefix
    $content = $content -replace '(?m)^(:global\(html\.dark\))', '.darkTheme $1'
    
    # Pattern 4: Standalone :global(html:not(.dark)) at start of line (not already prefixed)
    # Add .lightTheme prefix
    $content = $content -replace '(?m)^(:global\(html:not\(\.dark\)\))', '.lightTheme $1'
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Host "`nDone! All CSS module files have been fixed." -ForegroundColor Cyan
