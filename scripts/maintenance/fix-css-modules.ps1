# Fix CSS Module files with pure :global selectors

$appPath = "E:\comsats-ite-app_5\app"
$componentsPath = "E:\comsats-ite-app_5\components"
$files = @()
$files += Get-ChildItem -Path $appPath -Filter "*.module.css" -Recurse
if (Test-Path $componentsPath) {
    $files += Get-ChildItem -Path $componentsPath -Filter "*.module.css" -Recurse
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    # Skip if already has local class at start
    if ($content -match "^\.(?:darkTheme|lightTheme)") {
        continue
    }
    
    # Check if file starts with :global or :root without local class
    $isDark = $file.Name -match "\.dark\.module\.css$"
    
    # Check for various patterns of pure global selectors
    $needsFix = ($content -match "^:global") -or ($content -match "^:root")
    
    if ($needsFix) {
        if ($isDark) {
            $newContent = ".darkTheme { --theme-mode: dark; }`n`n$content"
        } else {
            $newContent = ".lightTheme { --theme-mode: light; }`n`n$content"
        }
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "`nAll CSS modules processed!"
