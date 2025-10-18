# Project cleanup script: declutter root and organize maintenance files
param()
$ErrorActionPreference = 'Stop'

# Ensure folders
# $PSScriptRoot points to scripts/maintenance, go two levels up to repo root
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$trash = Join-Path $root '.trash'
$maint = Join-Path $root 'scripts/maintenance'
$archive = Join-Path $root 'docs/archive'

New-Item -ItemType Directory -Force -Path $trash | Out-Null
New-Item -ItemType Directory -Force -Path $maint | Out-Null
New-Item -ItemType Directory -Force -Path $archive | Out-Null

# Move root-level markdown and text reports except README.md
Get-ChildItem -Path $root -File -Filter '*.md' | Where-Object { $_.Name -ne 'README.md' } | ForEach-Object {
  Move-Item -LiteralPath $_.FullName -Destination $trash -Force
}
Get-ChildItem -Path $root -File -Filter '*.txt' -ErrorAction SilentlyContinue | ForEach-Object {
  Move-Item -LiteralPath $_.FullName -Destination $trash -Force
}

# Move known JSON report/artifact files
$artifactFiles = @(
  'files-needing-css-modules.json',
  'SEO_AUDIT_REPORT.json',
  'glassmorphism-quality-data.json'
)
foreach ($f in $artifactFiles) {
  $p = Join-Path $root $f
  if (Test-Path $p) { Move-Item -LiteralPath $p -Destination $trash -Force }
}

# Remove generated report directories
$genDirs = @('reports','playwright-report','test-results','downloads','test')
foreach ($d in $genDirs) {
  $p = Join-Path $root $d
  if (Test-Path $p) { Remove-Item -LiteralPath $p -Recurse -Force }
}

# Relocate maintenance scripts from root to scripts/maintenance
$maintFiles = @(
  'fix-all-css-modules.ps1','fix-css-modules.ps1','fix-css-pure-selectors.ps1',
  'fix-global-ui-theme.ps1','fix-ui-theme.ps1','update-glass-classes.ps1',
  'APPLY_FIX.bat','fix-light-mode.css'
)
foreach ($f in $maintFiles) {
  $p = Join-Path $root $f
  if (Test-Path $p) { Move-Item -LiteralPath $p -Destination $maint -Force }
}

# Archive simple alt config
$altConfig = Join-Path $root 'next.config.mjs.simple'
if (Test-Path $altConfig) { Move-Item -LiteralPath $altConfig -Destination $archive -Force }

# Move top-level docs markdown files (except STRUCTURE.md) to docs/archive
$docsTop = Join-Path $root 'docs'
if (Test-Path $docsTop) {
  Get-ChildItem -Path $docsTop -File -Filter '*.md' -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -ne 'STRUCTURE.md' } |
    ForEach-Object { Move-Item -LiteralPath $_.FullName -Destination $archive -Force }
}

Write-Host 'Cleanup complete.'