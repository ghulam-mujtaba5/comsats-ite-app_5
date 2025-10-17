# Clean up documentation and temporary files by moving them into a dated .trash folder
# Safe operation: nothing is permanently deleted; files are moved preserving folder structure.

param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Resolve repo root as parent of this script folder
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $ScriptDir '..')
$DateStamp = Get-Date -Format 'yyyy-MM-dd'
$TrashRoot = Join-Path $RepoRoot ".trash\$DateStamp"

# Ensure trash root exists
New-Item -ItemType Directory -Force -Path $TrashRoot | Out-Null

# Report file
$ReportPath = Join-Path $RepoRoot ("CLEANUP_REPORT_{0}.txt" -f (Get-Date -Format 'yyyyMMdd_HHmmss'))

function Write-Report {
    param([string]$Message)
    $Message | Tee-Object -FilePath $ReportPath -Append | Out-Null
}

function Move-FilePreservingStructure {
    param([System.IO.FileInfo]$File)
    $relative = $File.FullName.Substring($RepoRoot.Path.Length + 1)
    $dest = Join-Path $TrashRoot $relative
    $destDir = Split-Path $dest -Parent
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    Move-Item -LiteralPath $File.FullName -Destination $dest -Force
    Write-Report ("Moved: {0}" -f $relative)
}

function Move-DirContentsPreservingStructure {
    param([string]$DirPath)
    if (-not (Test-Path $DirPath)) { return }
    $dirInfo = Get-Item -LiteralPath $DirPath -ErrorAction SilentlyContinue
    if ($null -eq $dirInfo -or -not $dirInfo.PSIsContainer) { return }
    $files = Get-ChildItem -LiteralPath $DirPath -Recurse -File -Force -ErrorAction SilentlyContinue
    foreach ($f in $files) { Move-FilePreservingStructure -File $f }
}

function Get-MatchingFiles {
    param(
        [string[]]$Patterns,
        [scriptblock]$ExtraExclude
    )
    # Convert patterns like '*.md' to extension list like '.md'
    $exts = @()
    foreach ($p in $Patterns) {
        if ($p -match '^\*\.(.+)$') { $exts += ('.' + $Matches[1].ToLower()) }
    }
    # Enumerate files safely and then filter by extension to avoid traversal errors in some folders
    $items = Get-ChildItem -Path $RepoRoot.Path -Recurse -File -Force -ErrorAction SilentlyContinue
    if ($exts.Count -gt 0) {
        $items = $items | Where-Object { $exts -contains $_.Extension.ToLower() }
    }
    # Exclude heavy/generated/internal folders
    $items = $items | Where-Object {
        $_.FullName -notlike (Join-Path $RepoRoot.Path '.trash*') -and
        $_.FullName -notlike (Join-Path $RepoRoot.Path 'node_modules*') -and
        $_.FullName -notlike (Join-Path $RepoRoot.Path '.next*') -and
        $_.FullName -notlike (Join-Path $RepoRoot.Path 'build*') -and
        $_.FullName -notlike (Join-Path $RepoRoot.Path '.git*')
    }
    if ($null -ne $ExtraExclude) {
        $items = $items | Where-Object $ExtraExclude
    }
    return $items
}

Write-Report ("Cleanup started at {0}" -f (Get-Date))
Write-Report ("Trash directory: {0}" -f $TrashRoot)

# 1) Move Markdown files except root README.md
$mdExclude = {
    # Exclude root README.md only
    $rootReadme = Join-Path $RepoRoot.Path 'README.md'
    $_.FullName -ne $rootReadme
}
$mdFiles = Get-MatchingFiles -Patterns @('*.md') -ExtraExclude $mdExclude
$mdCount = ($mdFiles | Measure-Object).Count
if ($mdCount -gt 0) {
    Write-Report ("Markdown files to move: {0}" -f $mdCount)
    foreach ($f in $mdFiles) { Move-FilePreservingStructure -File $f }
} else {
    Write-Report "No Markdown files to move (excluding root README.md)."
}

# 2) Move backup/log/temp files
$backupPatterns = @('*.backup','*.bak','*.old','*.orig','*.log','*.tmp')
$backupFiles = Get-MatchingFiles -Patterns $backupPatterns -ExtraExclude $null
$backupCount = ($backupFiles | Measure-Object).Count
if ($backupCount -gt 0) {
    Write-Report ("Backup/log/temp files to move: {0}" -f $backupCount)
    foreach ($f in $backupFiles) { Move-FilePreservingStructure -File $f }
} else {
    Write-Report "No backup/log/temp files to move."
}

# 3) Move non-essential .txt files (exclude public/robots.txt)
$txtExclude = {
    $robots = Join-Path $RepoRoot.Path 'public/robots.txt'
    $_.FullName -ne $robots
}
$txtFiles = Get-MatchingFiles -Patterns @('*.txt') -ExtraExclude $txtExclude
$txtCount = ($txtFiles | Measure-Object).Count
if ($txtCount -gt 0) {
    Write-Report (".txt files to move (excluding public/robots.txt): {0}" -f $txtCount)
    foreach ($f in $txtFiles) { Move-FilePreservingStructure -File $f }
} else {
    Write-Report "No .txt files to move (excluding public/robots.txt)."
}

Write-Report ("Cleanup completed at {0}" -f (Get-Date))
Write-Report ("Report saved to: {0}" -f $ReportPath)

Write-Host "Cleanup complete. See report:" $ReportPath

# -------- Additional cleanup passes for common extra files/folders --------

# Move package-lock.json if present (project uses pnpm)
$pkgLock = Join-Path $RepoRoot.Path 'package-lock.json'
if (Test-Path $pkgLock) {
    try {
        Move-FilePreservingStructure -File (Get-Item -LiteralPath $pkgLock)
        Write-Report 'Moved: package-lock.json'
    } catch { Write-Report ("Skip moving package-lock.json: {0}" -f $_.Exception.Message) }
}

# Move any *.tsbuildinfo files
$tsbuildFiles = Get-ChildItem -Path $RepoRoot.Path -Recurse -Force -ErrorAction SilentlyContinue -Filter '*.tsbuildinfo' | Where-Object { $_.PSIsContainer -eq $false }
foreach ($f in $tsbuildFiles) { Move-FilePreservingStructure -File $f }
if ($tsbuildFiles.Count -gt 0) { Write-Report ("Moved tsbuildinfo files: {0}" -f $tsbuildFiles.Count) }

# Move test-results and coverage directories (artifacts)
$artifactDirs = @('test-results','coverage')
foreach ($d in $artifactDirs) {
    $path = Join-Path $RepoRoot.Path $d
    if (Test-Path $path) {
        Move-DirContentsPreservingStructure -DirPath $path
        Write-Report ("Moved contents of directory: {0}" -f $d)
    }
}

# Final sweep: move top-level build logs if re-created
$finalFiles = @('build.log','build_errors.txt','build_output.txt')
foreach ($name in $finalFiles) {
    $p = Join-Path $RepoRoot.Path $name
    if (Test-Path $p) {
        try { Move-FilePreservingStructure -File (Get-Item -LiteralPath $p) } catch {}
    }
}
