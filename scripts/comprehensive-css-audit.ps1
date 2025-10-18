# Comprehensive CSS Modules Audit Script for TSX Files
# This script checks every TSX file for required CSS module files and glassmorphism quality

$ErrorActionPreference = "Continue"
$projectRoot = "e:\comsats-ite-app_5"

# Output files
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportFile = Join-Path $projectRoot "reports\CSS_MODULES_AUDIT_$timestamp.json"
$checklistFile = Join-Path $projectRoot "reports\CSS_MODULES_CHECKLIST_$timestamp.md"
$progressFile = Join-Path $projectRoot "reports\CSS_MODULES_PROGRESS_$timestamp.json"

# Ensure reports directory exists
$reportsDir = Join-Path $projectRoot "reports"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir -Force | Out-Null
}

Write-Host "=== Starting Comprehensive CSS Modules Audit ===" -ForegroundColor Cyan
Write-Host "Project Root: $projectRoot" -ForegroundColor Gray

# Get all TSX files (excluding node_modules)
$tsxFiles = Get-ChildItem -Path $projectRoot -Recurse -Filter "*.tsx" | 
    Where-Object { $_.FullName -notmatch "node_modules" }

Write-Host "`nFound $($tsxFiles.Count) TSX files to audit" -ForegroundColor Green

# Initialize results
$results = @{
    totalFiles = $tsxFiles.Count
    timestamp = $timestamp
    filesWithAllModules = @()
    filesWithPartialModules = @()
    filesMissingAllModules = @()
    glassmorphismQuality = @{}
    summary = @{
        complete = 0
        partial = 0
        missing = 0
        percentComplete = 0
    }
}

# Glassmorphism quality patterns
$glassPatterns = @{
    backdropFilter = "backdrop-filter|backdrop-blur"
    gradients = "linear-gradient|radial-gradient"
    borders = "border.*rgba|border.*hsla"
    shadows = "box-shadow.*rgba|drop-shadow"
    opacity = "background.*rgba|background.*hsla"
    animations = "@keyframes|animation:|transition:"
    modern = "clamp\(|min\(|max\(|var\("
}

# Process each TSX file
$progressCounter = 0
foreach ($tsxFile in $tsxFiles) {
    $progressCounter++
    $percentComplete = [math]::Round(($progressCounter / $tsxFiles.Count) * 100, 2)
    
    Write-Progress -Activity "Auditing TSX Files" -Status "$percentComplete% Complete" `
        -PercentComplete $percentComplete -CurrentOperation $tsxFile.Name
    
    $baseName = $tsxFile.BaseName
    $directory = $tsxFile.DirectoryName
    $relativePath = $tsxFile.FullName.Replace($projectRoot, "").TrimStart("\")
    
    # Check for required CSS module files
    $moduleFile = Join-Path $directory "$baseName.module.css"
    $darkFile = Join-Path $directory "$baseName.dark.module.css"
    $lightFile = Join-Path $directory "$baseName.light.module.css"
    
    $hasModule = Test-Path $moduleFile
    $hasDark = Test-Path $darkFile
    $hasLight = Test-Path $lightFile
    
    # Glassmorphism quality analysis
    $glassQuality = @{
        score = 0
        features = @()
        recommendations = @()
    }
    
    # Analyze CSS files if they exist
    $cssFiles = @($moduleFile, $darkFile, $lightFile) | Where-Object { Test-Path $_ }
    
    foreach ($cssFile in $cssFiles) {
        $content = Get-Content $cssFile -Raw -ErrorAction SilentlyContinue
        if ($content) {
            foreach ($patternName in $glassPatterns.Keys) {
                if ($content -match $glassPatterns[$patternName]) {
                    if ($patternName -notin $glassQuality.features) {
                        $glassQuality.features += $patternName
                        $glassQuality.score += 15
                    }
                }
            }
        }
    }
    
    # Add recommendations based on missing features
    foreach ($patternName in $glassPatterns.Keys) {
        if ($patternName -notin $glassQuality.features) {
            $glassQuality.recommendations += "Add $patternName effects"
        }
    }
    
    # Categorize file
    $fileInfo = @{
        file = $relativePath
        baseName = $baseName
        directory = $directory.Replace($projectRoot, "").TrimStart("\")
        hasModule = $hasModule
        hasDark = $hasDark
        hasLight = $hasLight
        glassQuality = $glassQuality
    }
    
    if ($hasModule -and $hasDark -and $hasLight) {
        $results.filesWithAllModules += $fileInfo
        $results.summary.complete++
    }
    elseif ($hasModule -or $hasDark -or $hasLight) {
        $results.filesWithPartialModules += $fileInfo
        $results.summary.partial++
    }
    else {
        $results.filesMissingAllModules += $fileInfo
        $results.summary.missing++
    }
}

Write-Progress -Activity "Auditing TSX Files" -Completed

# Calculate completion percentage
$results.summary.percentComplete = [math]::Round(($results.summary.complete / $results.totalFiles) * 100, 2)

Write-Host "`n=== Audit Summary ===" -ForegroundColor Cyan
Write-Host "Total TSX Files: $($results.totalFiles)" -ForegroundColor White
$completePercent = $results.summary.percentComplete
Write-Host "Complete (all 3 modules): $($results.summary.complete) ($completePercent%)" -ForegroundColor Green
Write-Host "Partial (some modules): $($results.summary.partial)" -ForegroundColor Yellow
Write-Host "Missing (no modules): $($results.summary.missing)" -ForegroundColor Red

# Save JSON report
$results | ConvertTo-Json -Depth 10 | Out-File $reportFile -Encoding UTF8
Write-Host "`nJSON Report saved to: $reportFile" -ForegroundColor Green

# Generate Markdown Checklist
$partialPercent = [math]::Round(($results.summary.partial / $results.totalFiles) * 100, 2)
$missingPercent = [math]::Round(($results.summary.missing / $results.totalFiles) * 100, 2)

$markdown = @"
# CSS Modules Implementation Checklist
**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Project:** COMSATS ITE App

## Summary Statistics

| Metric | Count | Percentage |
|--------|-------|------------|
| Total TSX Files | $($results.totalFiles) | 100% |
| Complete (All 3 Modules) | $($results.summary.complete) | $completePercent% |
| Partial (Some Modules) | $($results.summary.partial) | $partialPercent% |
| Missing (No Modules) | $($results.summary.missing) | $missingPercent% |

---

## Files with All Modules ($($results.filesWithAllModules.Count))

"@

foreach ($file in $results.filesWithAllModules | Sort-Object -Property file) {
    $glassScore = $file.glassQuality.score
    $featuresStr = $file.glassQuality.features -join ", "
    $recStr = $file.glassQuality.recommendations -join ", "
    
    $markdown += "`n### File: $($file.file)`n"
    $markdown += "- Glassmorphism Score: $glassScore/105`n"
    $markdown += "- Features: $featuresStr`n"
    if ($file.glassQuality.recommendations.Count -gt 0) {
        $markdown += "- Recommendations: $recStr`n"
    }
}

$markdown += "`n---`n`n"
$markdown += "## Files with Partial Modules ($($results.filesWithPartialModules.Count))`n`n"

"@

foreach ($file in $results.filesWithPartialModules | Sort-Object -Property file) {
    $missingModules = @()
    if (-not $file.hasModule) { $missingModules += ".module.css" }
    if (-not $file.hasDark) { $missingModules += ".dark.module.css" }
    if (-not $file.hasLight) { $missingModules += ".light.module.css" }
    
    $hasModules = @()
    if ($file.hasModule) { $hasModules += ".module.css" }
    if ($file.hasDark) { $hasModules += ".dark.module.css" }
    if ($file.hasLight) { $hasModules += ".light.module.css" }
    
    $markdown += "`n### File: $($file.file)`n"
    $markdown += "- [ ] Missing: $($missingModules -join ', ')`n"
    $markdown += "- Has: $($hasModules -join ', ')`n"
}

$markdown += "`n---`n`n"
$markdown += "## Files Missing All Modules ($($results.filesMissingAllModules.Count))`n`n"

foreach ($file in $results.filesMissingAllModules | Sort-Object -Property file) {
    $markdown += "`n### File: $($file.file)`n"
    $markdown += "- [ ] Create: .module.css`n"
    $markdown += "- [ ] Create: .dark.module.css`n"
    $markdown += "- [ ] Create: .light.module.css`n"
}

$progressBars = [math]::Floor($results.summary.percentComplete / 5)
$emptyBars = 20 - $progressBars
$progressBar = ('█' * $progressBars) + ('░' * $emptyBars)
$lastUpdated = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$markdown += @"

---

## Glassmorphism Quality Guidelines

### High-Quality Glassmorphism Checklist:
- Backdrop Blur - backdrop-filter: blur(12px)
- Transparency - background: rgba(255, 255, 255, 0.1)
- Gradients - Multi-layer gradients for depth
- Borders - Subtle borders with rgba/hsla
- Shadows - Layered box-shadows for elevation
- Animations - Smooth transitions and hover effects
- Modern CSS - CSS variables, clamp(), min(), max()

---

## Progress Tracking

Progress: [$progressBar] $completePercent%

**Next Steps:**
1. Start with missing files (highest priority)
2. Add missing modules to partial files
3. Enhance glassmorphism quality in complete files
4. Test all pages after implementation

---

*Last Updated: $lastUpdated*
"@

$markdown | Out-File $checklistFile -Encoding UTF8
Write-Host "Markdown Checklist saved to: $checklistFile" -ForegroundColor Green

# Save progress tracking JSON
$progress = @{
    timestamp = $timestamp
    totalFiles = $results.totalFiles
    completed = $results.summary.complete
    remaining = $results.summary.partial + $results.summary.missing
    percentComplete = $results.summary.percentComplete
    filesNeedingWork = @()
}

foreach ($file in $results.filesWithPartialModules + $results.filesMissingAllModules) {
    $progress.filesNeedingWork += @{
        file = $file.file
        priority = if ($file.hasModule -or $file.hasDark -or $file.hasLight) { "medium" } else { "high" }
        status = "pending"
    }
}

$progress | ConvertTo-Json -Depth 10 | Out-File $progressFile -Encoding UTF8
Write-Host "Progress Tracking saved to: $progressFile" -ForegroundColor Green

Write-Host "`n=== Audit Complete ===" -ForegroundColor Cyan
Write-Host "Review the reports to track implementation progress." -ForegroundColor White
