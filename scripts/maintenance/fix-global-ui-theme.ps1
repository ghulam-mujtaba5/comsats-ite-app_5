# Global UI Theme Fix Script
# This script fixes generic theme tokens across all TSX files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CampusAxis Global UI Theme Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define replacement mappings
$replacements = @{
    # Text colors
    'text-foreground(?!")' = 'text-slate-900 dark:text-white'
    'text-muted-foreground/90' = 'text-slate-600 dark:text-slate-400'
    'text-muted-foreground(?!")' = 'text-slate-700 dark:text-slate-300'
    
    # Backgrounds
    'bg-card/90(?!")' = 'bg-white/90 dark:bg-slate-800/90'
    'bg-card/80(?!")' = 'bg-white/80 dark:bg-slate-800/80'
    'bg-card/70(?!")' = 'bg-white/70 dark:bg-slate-800/70'
    'bg-card/60(?!")' = 'bg-white/60 dark:bg-slate-800/60'
    'bg-card(?![/\-])' = 'bg-white dark:bg-slate-800'
    'bg-muted/90' = 'bg-slate-100/90 dark:bg-slate-900/90'
    'bg-muted/80' = 'bg-slate-100/80 dark:bg-slate-900/80'
    'bg-muted/70' = 'bg-slate-50 dark:bg-slate-900/70'
    'bg-muted(?![/\-])' = 'bg-slate-100 dark:bg-slate-900'
    
    # Borders
    'border-white/30' = 'border-slate-200 dark:border-slate-700'
    'border-white/20' = 'border-slate-200 dark:border-slate-700'
    'border-white/10' = 'border-slate-200 dark:border-slate-700'
}

# Icon color replacements (more conservative)
$iconReplacements = @{
    'text-primary(?!")' = 'text-blue-600 dark:text-blue-400'
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
    
    # Apply text and background replacements
    foreach ($pattern in $replacements.Keys) {
        $replacement = $replacements[$pattern]
        $matches = [regex]::Matches($content, $pattern)
        
        if ($matches.Count -gt 0) {
            $content = $content -replace $pattern, $replacement
            $fileReplacements += $matches.Count
        }
    }
    
    # Apply icon replacements only in className attributes
    foreach ($pattern in $iconReplacements.Keys) {
        $replacement = $iconReplacements[$pattern]
        # Only replace within className=""
        $content = $content -replace "className=`"([^`"]*?)$pattern([^`"]*?)`"", "className=`"`$1$replacement`$2`""
        $content = $content -replace "className=\{`"([^`"]*?)$pattern([^`"]*?)`"\}", "className={`"`$1$replacement`$2`"}"
    }
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        $totalReplacements += $fileReplacements
        
        $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart("\")
        Write-Host "✓ $relativePath " -ForegroundColor Green -NoNewline
        Write-Host "- $fileReplacements changes" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total files scanned: " -NoNewline
Write-Host "$totalFiles" -ForegroundColor Yellow
Write-Host "Files modified: " -NoNewline
Write-Host "$modifiedFiles" -ForegroundColor Green
Write-Host "Total replacements: " -NoNewline
Write-Host "$totalReplacements" -ForegroundColor Cyan
Write-Host ""

if ($modifiedFiles -gt 0) {
    Write-Host "✓ UI theme fix completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Review the changes in git diff" -ForegroundColor Gray
    Write-Host "2. Test the application in both light and dark modes" -ForegroundColor Gray
    Write-Host "3. Check for any edge cases that need manual adjustment" -ForegroundColor Gray
} else {
    Write-Host "No changes were made." -ForegroundColor Yellow
    Write-Host "This could mean:" -ForegroundColor Gray
    Write-Host "- All files already use explicit theme classes" -ForegroundColor Gray
    Write-Host "- Pattern matching needs adjustment" -ForegroundColor Gray
}

Write-Host ""
