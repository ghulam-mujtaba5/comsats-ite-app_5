# Update Empty CSS Module Files
# Populates empty CSS modules with glassmorphism templates

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Glassmorphism CSS Module Updater" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$stats = @{
    Common = 0
    Light = 0
    Dark = 0
    Skipped = 0
}

# Common/Base template
$commonTemplate = @'
/* Component Base Styles */

.container {
  position: relative;
  width: 100%;
}

.card {
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-2px);
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.description {
  font-size: 0.875rem;
  line-height: 1.6;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.button:hover {
  transform: translateY(-1px);
}
'@

# Light mode template
$lightTemplate = @'
/* Light Mode Styles */

.container {
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.90) 100%);
}

.card {
  background: rgba(255, 255, 255, 0.70);
  border: 1px solid rgba(255, 255, 255, 0.30);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.50);
}

.card:hover {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(69, 115, 223, 0.25);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.15), 0 6px 20px rgba(31, 38, 135, 0.10);
}

.title {
  color: rgba(15, 23, 42, 0.95);
}

.description {
  color: rgba(51, 65, 85, 0.85);
}

.button {
  background: rgba(255, 255, 255, 0.65);
  border-color: rgba(255, 255, 255, 0.25);
  color: rgba(15, 23, 42, 0.90);
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.08);
}

.button:hover {
  background: rgba(255, 255, 255, 0.80);
  border-color: rgba(69, 115, 223, 0.30);
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}
'@

# Dark mode template
$darkTemplate = @'
/* Dark Mode Styles */

.dark .container {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.90) 100%);
}

.dark .card {
  background: rgba(30, 41, 59, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.dark .card:hover {
  background: rgba(51, 65, 85, 0.65);
  border-color: rgba(69, 115, 223, 0.35);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55), 0 6px 20px rgba(0, 0, 0, 0.40), 0 0 32px rgba(69, 115, 223, 0.15);
}

.dark .title {
  color: rgba(248, 250, 252, 0.95);
}

.dark .description {
  color: rgba(226, 232, 240, 0.85);
}

.dark .button {
  background: rgba(30, 41, 59, 0.60);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(248, 250, 252, 0.90);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.dark .button:hover {
  background: rgba(51, 65, 85, 0.70);
  border-color: rgba(69, 115, 223, 0.40);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.50), 0 0 24px rgba(69, 115, 223, 0.15);
}
'@

function Update-CSSFile {
    param($Path, $Content)
    
    if (Test-Path $Path) {
        $current = Get-Content $Path -Raw -ErrorAction SilentlyContinue
        
        # Check if essentially empty
        if (-not $current -or $current.Length -lt 100 -or $current -match '^\s*/\*.*\*/\s*(:root\s*\{\}|\.root\s*\{\})?\s*$') {
            Set-Content -Path $Path -Value $Content -Encoding UTF8 -NoNewline
            return $true
        }
    }
    return $false
}

Write-Host "Scanning for CSS module files...`n" -ForegroundColor Yellow

# Update base .module.css files
Get-ChildItem -Path "." -Filter "*.module.css" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.Name -notmatch '\.(light|dark)\.module\.css$') {
        if (Update-CSSFile -Path $_.FullName -Content $commonTemplate) {
            Write-Host "  [BASE] $($_.FullName.Replace((Get-Location).Path, '.'))" -ForegroundColor Green
            $stats.Common++
        } else {
            $stats.Skipped++
        }
    }
}

# Update .light.module.css files
Get-ChildItem -Path "." -Filter "*.light.module.css" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    if (Update-CSSFile -Path $_.FullName -Content $lightTemplate) {
        Write-Host "  [LIGHT] $($_.FullName.Replace((Get-Location).Path, '.'))" -ForegroundColor Cyan
        $stats.Light++
    } else {
        $stats.Skipped++
    }
}

# Update .dark.module.css files
Get-ChildItem -Path "." -Filter "*.dark.module.css" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    if (Update-CSSFile -Path $_.FullName -Content $darkTemplate) {
        Write-Host "  [DARK] $($_.FullName.Replace((Get-Location).Path, '.'))" -ForegroundColor Magenta
        $stats.Dark++
    } else {
        $stats.Skipped++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Base modules updated:  $($stats.Common)" -ForegroundColor Green
Write-Host "  Light modules updated: $($stats.Light)" -ForegroundColor Cyan
Write-Host "  Dark modules updated:  $($stats.Dark)" -ForegroundColor Magenta
Write-Host "  Skipped (has content): $($stats.Skipped)" -ForegroundColor Yellow
Write-Host "  Total updated:         $($stats.Common + $stats.Light + $stats.Dark)" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

if (($stats.Common + $stats.Light + $stats.Dark) -gt 0) {
    Write-Host "Success! CSS modules populated with glassmorphism styles." -ForegroundColor Green
    Write-Host "Read GLASSMORPHISM_README.md to get started!`n" -ForegroundColor Yellow
}
