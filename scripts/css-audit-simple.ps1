# Simple CSS Modules Audit Script
$ErrorActionPreference = "Continue"
$projectRoot = "e:\comsats-ite-app_5"

# Ensure reports directory exists
$reportsDir = Join-Path $projectRoot "reports"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir -Force | Out-Null
}

Write-Host "=== Starting CSS Modules Audit ===" -ForegroundColor Cyan

# Get all TSX files (excluding node_modules)
$tsxFiles = Get-ChildItem -Path $projectRoot -Recurse -Filter "*.tsx" | 
    Where-Object { $_.FullName -notmatch "node_modules" }

Write-Host "Found $($tsxFiles.Count) TSX files to audit" -ForegroundColor Green

# Initialize counters
$complete = 0
$partial = 0
$missing = 0

# Arrays to store results
$completeFiles = @()
$partialFiles = @()
$missingFiles = @()

# Process each TSX file
foreach ($tsxFile in $tsxFiles) {
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
    
    # Categorize file
    if ($hasModule -and $hasDark -and $hasLight) {
        $complete++
        $completeFiles += $relativePath
    }
    elseif ($hasModule -or $hasDark -or $hasLight) {
        $partial++
        $partialObj = [PSCustomObject]@{
            File = $relativePath
            HasModule = $hasModule
            HasDark = $hasDark
            HasLight = $hasLight
        }
        $partialFiles += $partialObj
    }
    else {
        $missing++
        $missingFiles += $relativePath
    }
}

# Calculate percentages
$percentComplete = [math]::Round(($complete / $tsxFiles.Count) * 100, 2)
$percentPartial = [math]::Round(($partial / $tsxFiles.Count) * 100, 2)
$percentMissing = [math]::Round(($missing / $tsxFiles.Count) * 100, 2)

# Display summary
Write-Host "`n=== Audit Summary ===" -ForegroundColor Cyan
Write-Host "Total TSX Files: $($tsxFiles.Count)" -ForegroundColor White
Write-Host "Complete (all 3 modules): $complete ($percentComplete%)" -ForegroundColor Green
Write-Host "Partial (some modules): $partial ($percentPartial%)" -ForegroundColor Yellow
Write-Host "Missing (no modules): $missing ($percentMissing%)" -ForegroundColor Red

# Save results to JSON
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportFile = Join-Path $reportsDir "CSS_MODULES_AUDIT_$timestamp.json"

$results = @{
    timestamp = $timestamp
    totalFiles = $tsxFiles.Count
    complete = $complete
    partial = $partial
    missing = $missing
    percentComplete = $percentComplete
    completeFiles = $completeFiles
    partialFiles = $partialFiles
    missingFiles = $missingFiles
}

$results | ConvertTo-Json -Depth 10 | Out-File $reportFile -Encoding UTF8
Write-Host "`nJSON Report saved to: $reportFile" -ForegroundColor Green

# Create simple checklist
$checklistFile = Join-Path $reportsDir "CSS_MODULES_CHECKLIST_$timestamp.md"
$markdown = New-Object System.Text.StringBuilder
[void]$markdown.AppendLine("# CSS Modules Implementation Checklist")
[void]$markdown.AppendLine("")
[void]$markdown.AppendLine("**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
[void]$markdown.AppendLine("**Project:** COMSATS ITE App")
[void]$markdown.AppendLine("")
[void]$markdown.AppendLine("## Summary Statistics")
[void]$markdown.AppendLine("")
[void]$markdown.AppendLine("| Metric | Count | Percentage |")
[void]$markdown.AppendLine("|--------|-------|------------|")
[void]$markdown.AppendLine("| Total TSX Files | $($tsxFiles.Count) | 100% |")
[void]$markdown.AppendLine("| Complete (All 3 Modules) | $complete | $percentComplete% |")
[void]$markdown.AppendLine("| Partial (Some Modules) | $partial | $percentPartial% |")
[void]$markdown.AppendLine("| Missing (No Modules) | $missing | $percentMissing% |")
[void]$markdown.AppendLine("")
[void]$markdown.AppendLine("---")
[void]$markdown.AppendLine("")

# Add complete files section
[void]$markdown.AppendLine("## Files with All Modules ($complete)")
[void]$markdown.AppendLine("")
foreach ($file in $completeFiles | Sort-Object) {
    [void]$markdown.AppendLine("- [x] $file")
}
[void]$markdown.AppendLine("")
[void]$markdown.AppendLine("---")
[void]$markdown.AppendLine("")

# Add partial files section
[void]$markdown.AppendLine("## Files with Partial Modules ($partial)")
[void]$markdown.AppendLine("")
foreach ($file in $partialFiles | Sort-Object -Property File) {
    [void]$markdown.AppendLine("### File: $($file.File)")
    if (-not $file.HasModule) {
        [void]$markdown.AppendLine("- [ ] Missing: .module.css")
    }
    if (-not $file.HasDark) {
        [void]$markdown.AppendLine("- [ ] Missing: .dark.module.css")
    }
    if (-not $file.HasLight) {
        [void]$markdown.AppendLine("- [ ] Missing: .light.module.css")
    }
    [void]$markdown.AppendLine("")
}
[void]$markdown.AppendLine("---")
[void]$markdown.AppendLine("")

# Add missing files section
[void]$markdown.AppendLine("## Files Missing All Modules ($missing)")
[void]$markdown.AppendLine("")
foreach ($file in $missingFiles | Sort-Object) {
    [void]$markdown.AppendLine("### File: $file")
    [void]$markdown.AppendLine("- [ ] Create: .module.css")
    [void]$markdown.AppendLine("- [ ] Create: .dark.module.css")
    [void]$markdown.AppendLine("- [ ] Create: .light.module.css")
    [void]$markdown.AppendLine("")
}

$markdown.ToString() | Out-File $checklistFile -Encoding UTF8
Write-Host "Markdown Checklist saved to: $checklistFile" -ForegroundColor Green

Write-Host "`n=== Audit Complete ===" -ForegroundColor Cyan
