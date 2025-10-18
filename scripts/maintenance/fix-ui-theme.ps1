# Global UI Theme Fix Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CampusAxis Global UI Theme Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define replacement mappings
$replacements = @{
    'text-foreground(?!")' = 'text-slate-900 dark:text-white'
    'text-muted-foreground/90' = 'text-slate-600 dark:text-slate-400'
    'text-muted-foreground(?!")' = 'text-slate-700 dark:text-slate-300'
    'bg-card/90(?!")' = 'bg-white/90 dark:bg-slate-800/90'
    'bg-card/80(?!")' = 'bg-white/80 dark:bg-slate-800/80'
    'bg-card/70(?!")' = 'bg-white/70 dark:bg-slate-800/70'
    'bg-card/60(?!")' = 'bg-white/60 dark:bg-slate-800/60'
    'bg-card(?![/\-])' = 'bg-white dark:bg-slate-800'
    'bg-muted/90' = 'bg-slate-100/90 dark:bg-slate-900/90'
    'bg-muted/80' = 'bg-slate-100/80 dark:bg-slate-900/80'
    'bg-muted/70' = 'bg-slate-50 dark:bg-slate-900/70'
    'bg-muted(?![/\-])' = 'bg-slate-100 dark:bg-slate-900'
    'border-white/30' = 'border-slate-200 dark:border-slate-700'
    'border-white/20' = 'border-slate-200 dark:border-slate-700'
    'border-white/10' = 'border-slate-200 dark:border-slate-700'
}

# Get all TSX files
$files = Get-ChildItem -Path "." -Recurse -Include "*.tsx" -Exclude "node_modules","dist","build",".next"
$totalFiles = $files.Count
$modifiedFiles = 0
$totalReplacements = 0

Write-Host "Found $totalFiles TSX files to process" -ForegroundColor Yellow
Write-Host ""

# Process each file
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $originalContent = $content
    $fileReplacements = 0
    
    # Apply replacements
    foreach ($pattern in $replacements.Keys) {
        $replacement = $replacements[$pattern]
        $matches = [regex]::Matches($content, $pattern)
        
        if ($matches.Count -gt 0) {
            $content = $content -replace $pattern, $replacement
            $fileReplacements += $matches.Count
        }
    }
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        $totalReplacements += $fileReplacements
        
        $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart("\")
        Write-Host "✓ $relativePath - $fileReplacements changes" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total files scanned: $totalFiles" -ForegroundColor Yellow
Write-Host "Files modified: $modifiedFiles" -ForegroundColor Green
Write-Host "Total replacements: $totalReplacements" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($modifiedFiles -gt 0) {
    Write-Host "✓ UI theme fix completed successfully!" -ForegroundColor Green
} else {
    Write-Host "No changes were made." -ForegroundColor Yellow
}
