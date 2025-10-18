# Glassmorphism Quality Analysis Script
$ErrorActionPreference = "Continue"
$projectRoot = "e:\comsats-ite-app_5"

Write-Host "=== Glassmorphism Quality Analysis ===" -ForegroundColor Cyan

# Get all CSS module files
$cssModules = Get-ChildItem -Path $projectRoot -Recurse -Filter "*.module.css" | 
    Where-Object { $_.FullName -notmatch "node_modules" }

Write-Host "Found $($cssModules.Count) CSS module files" -ForegroundColor Green

# Glassmorphism quality patterns
$patterns = @{
    backdropFilter = "backdrop-filter"
    backdropBlur = "backdrop-filter:.*blur"
    gradients = "linear-gradient|radial-gradient"
    rgbaBackground = "background.*rgba|background.*hsla"
    rgbaBorder = "border.*rgba|border.*hsla"
    boxShadow = "box-shadow"
    multiShadow = "box-shadow:.*,.*,"  # Multiple shadows
    animations = "@keyframes|animation:"
    transitions = "transition:"
    modernCss = "clamp\(|min\(|max\(|var\(--"
    hoverEffects = ":hover"
    transformEffects = "transform:"
}

# Initialize stats
$stats = @{
    total = $cssModules.Count
    withGlass = 0
    withoutGlass = 0
    highQuality = 0  # 7+ features
    mediumQuality = 0  # 4-6 features
    lowQuality = 0  # 1-3 features
    featuresCount = @{}
}

# Initialize feature counts
foreach ($key in $patterns.Keys) {
    $stats.featuresCount[$key] = 0
}

# Files breakdown
$highQualityFiles = @()
$mediumQualityFiles = @()
$lowQualityFiles = @()
$noGlassFiles = @()

# Analyze each file
$counter = 0
foreach ($cssFile in $cssModules) {
    $counter++
    $percent = [math]::Round(($counter / $cssModules.Count) * 100, 1)
    Write-Progress -Activity "Analyzing CSS Files" -Status "$percent%" -PercentComplete $percent
    
    $content = Get-Content $cssFile.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $relativePath = $cssFile.FullName.Replace($projectRoot, "").TrimStart("\")
    $features = @()
    $score = 0
    
    # Check each pattern
    foreach ($patternName in $patterns.Keys) {
        if ($content -match $patterns[$patternName]) {
            $features += $patternName
            $stats.featuresCount[$patternName]++
            $score++
        }
    }
    
    $fileInfo = @{
        file = $relativePath
        score = $score
        features = $features
    }
    
    if ($score -eq 0) {
        $noGlassFiles += $fileInfo
        $stats.withoutGlass++
    } else {
        $stats.withGlass++
        if ($score -ge 7) {
            $highQualityFiles += $fileInfo
            $stats.highQuality++
        } elseif ($score -ge 4) {
            $mediumQualityFiles += $fileInfo
            $stats.mediumQuality++
        } else {
            $lowQualityFiles += $fileInfo
            $stats.lowQuality++
        }
    }
}

Write-Progress -Activity "Analyzing CSS Files" -Completed

# Display results
Write-Host "`n=== Glassmorphism Quality Report ===" -ForegroundColor Cyan
Write-Host "Total CSS Modules: $($stats.total)" -ForegroundColor White
Write-Host "With Glassmorphism: $($stats.withGlass) ($([math]::Round(($stats.withGlass/$stats.total)*100,2))%)" -ForegroundColor Green
Write-Host "Without Glassmorphism: $($stats.withoutGlass) ($([math]::Round(($stats.withoutGlass/$stats.total)*100,2))%)" -ForegroundColor Red
Write-Host ""
Write-Host "Quality Breakdown:" -ForegroundColor Yellow
Write-Host "  High Quality (7+ features): $($stats.highQuality)" -ForegroundColor Green
Write-Host "  Medium Quality (4-6 features): $($stats.mediumQuality)" -ForegroundColor Yellow
Write-Host "  Low Quality (1-3 features): $($stats.lowQuality)" -ForegroundColor Red

Write-Host "`nFeature Usage:" -ForegroundColor Yellow
foreach ($feature in $patterns.Keys | Sort-Object) {
    $count = $stats.featuresCount[$feature]
    $percent = [math]::Round(($count / $stats.total) * 100, 1)
    $percentStr = "$percent%"
    Write-Host "  ${feature}: $count ($percentStr)" -ForegroundColor Gray
}

# Save report
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportFile = Join-Path $projectRoot "reports\GLASSMORPHISM_QUALITY_$timestamp.json"

$report = @{
    timestamp = $timestamp
    stats = $stats
    highQualityFiles = $highQualityFiles
    mediumQualityFiles = $mediumQualityFiles
    lowQualityFiles = $lowQualityFiles
    noGlassFiles = $noGlassFiles
}

$report | ConvertTo-Json -Depth 10 | Out-File $reportFile -Encoding UTF8
Write-Host "`nReport saved to: $reportFile" -ForegroundColor Green

Write-Host "`n=== Analysis Complete ===" -ForegroundColor Cyan
