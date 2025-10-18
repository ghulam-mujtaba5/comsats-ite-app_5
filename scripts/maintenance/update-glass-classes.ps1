$files = Get-ChildItem -Path "e:\comsats-ite-app_5" -Include *.tsx,*.jsx -Recurse -File | Where-Object { $_.FullName -notmatch "node_modules" }

$replacements = @{
    "glass-card-premium glass-border-glow glass-hover-glow glass-noise" = "glass-primary"
    "glass-card-premium glass-border-glow glass-hover glass-gradient" = "glass-primary"
    "glass-card-premium glass-border-glow glass-hover glass-shimmer" = "glass-secondary"
    "glass-card-premium glass-border-light glass-hover glass-gradient" = "glass-secondary"
    "glass-card-premium glass-border-glow glass-hover glass-depth" = "glass-primary"
    "glass-card-premium glass-border-light" = "glass-secondary"
    "glass-card glass-border-light glass-hover glass-gradient" = "glass-secondary"
    "glass-hero glass-depth glass-gradient" = "glass-primary"
    "glass-hero glass-depth" = "glass-primary"
    "glass-floating glass-depth" = "glass-subtle"
    "glass-layered glass-depth" = "glass-subtle"
    "glass-button glass-border-light glass-hover glass-depth" = "glass-interactive"
    "glass-button glass-border-light glass-depth" = "glass-interactive"
    "glass-card glass-border-subtle glass-hover glass-depth" = "glass-interactive"
    "glass-light glass-border-subtle" = "glass-subtle"
    "glass-depth glass-professional" = "glass-primary"
    "glass-card glass-border-light glass-depth" = "glass-secondary"
    "glass-card glass-border-subtle glass-depth" = "glass-subtle"
    "glass-layered glass-professional glass-depth" = "glass-secondary"
    "glass-card-premium glass-hover glass-border-glow glass-depth glass-professional" = "glass-primary"
    "glass-card-premium glass-border-glow glass-hover glass-depth glass-gradient glass-ultra" = "glass-primary"
}

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "`nTotal files updated: $count"
