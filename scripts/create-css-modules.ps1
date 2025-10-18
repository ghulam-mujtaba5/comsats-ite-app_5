# Create Missing CSS Modules Script
# Generates high-quality glassmorphism CSS modules for TSX files

param(
    [switch]$DryRun = $false
)

Write-Host "🎨 CSS Module Generator with Glassmorphism Design" -ForegroundColor Cyan
Write-Host ""

$rootPath = "e:\comsats-ite-app_5"
$needsWorkPath = "$rootPath\files-needing-css-modules.json"

if (-not (Test-Path $needsWorkPath)) {
    Write-Host "❌ Please run audit-css-modules.ps1 first!" -ForegroundColor Red
    exit 1
}

$files = Get-Content $needsWorkPath | ConvertFrom-Json

# Glassmorphism CSS Template - Base Module
$baseTemplate = @'
/* Base Module - Modern Glassmorphism Design */
.container {
  position: relative;
  padding: 2rem;
  border-radius: 1.5rem;
  background: var(--glass-bg-medium);
  backdrop-filter: var(--glass-blur-sm);
  -webkit-backdrop-filter: var(--glass-blur-sm);
  border: 1px solid var(--glass-border-light);
  box-shadow: var(--glass-shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);
  will-change: transform, backdrop-filter;
}

.container:hover {
  background: var(--glass-bg-medium-hover);
  backdrop-filter: var(--glass-blur-md);
  -webkit-backdrop-filter: var(--glass-blur-md);
  box-shadow: var(--glass-shadow-lg);
  transform: translateY(-2px) translateZ(0);
}

.header {
  position: relative;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-border-subtle);
}

.title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.content {
  position: relative;
  z-index: 1;
}

.card {
  padding: 1.5rem;
  border-radius: 1rem;
  background: var(--glass-bg-light);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border-subtle);
  box-shadow: var(--glass-shadow-sm);
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.card:hover {
  background: var(--glass-bg-light-hover);
  box-shadow: var(--glass-shadow-md);
  transform: translateY(-1px);
}

.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  background: var(--glass-bg-medium);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border-light);
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--glass-shadow-sm);
}

.button:hover {
  background: var(--glass-bg-heavy);
  box-shadow: var(--glass-shadow-md);
  transform: translateY(-2px);
}

.button:active {
  transform: translateY(0);
  box-shadow: var(--glass-shadow-sm);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
    border-radius: 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .container,
  .card,
  .button {
    transition: none;
    animation: none;
  }
}

/* Focus States */
.button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
'@

# Dark Theme Template
$darkTemplate = @'
/* Dark Theme Overrides - Enhanced Glassmorphism */
.container {
  background: rgba(30, 30, 46, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.container:hover {
  background: rgba(30, 30, 46, 0.9);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.title {
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card {
  background: rgba(45, 45, 65, 0.7);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.card:hover {
  background: rgba(45, 45, 65, 0.85);
  border-color: rgba(255, 255, 255, 0.12);
}

.button {
  background: rgba(55, 55, 75, 0.8);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.95);
}

.button:hover {
  background: rgba(65, 65, 85, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}
'@

# Light Theme Template
$lightTemplate = @'
/* Light Theme Overrides - Crystal Clear Glassmorphism */
.container {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(148, 163, 184, 0.25);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.container:hover {
  background: rgba(255, 255, 255, 0.93);
  border-color: rgba(148, 163, 184, 0.35);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.header {
  border-bottom-color: rgba(148, 163, 184, 0.2);
}

.title {
  background: linear-gradient(135deg, #2563eb, #7c3aed, #db2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card {
  background: rgba(248, 250, 252, 0.85);
  border-color: rgba(148, 163, 184, 0.2);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.card:hover {
  background: rgba(248, 250, 252, 0.95);
  border-color: rgba(148, 163, 184, 0.3);
}

.button {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(148, 163, 184, 0.3);
  color: rgba(15, 23, 42, 0.95);
}

.button:hover {
  background: rgba(248, 250, 252, 0.95);
  border-color: rgba(148, 163, 184, 0.4);
}
'@

$created = 0
$skipped = 0

foreach ($file in $files) {
    $dir = Split-Path -Parent $file.Path
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Path)
    
    # Generate CSS file paths
    $baseModule = Join-Path $dir "$baseName.module.css"
    $darkModule = Join-Path $dir "$baseName.dark.module.css"
    $lightModule = Join-Path $dir "$baseName.light.module.css"
    
    $needsCreation = $false
    
    # Create base module if missing
    if (-not $file.HasBase) {
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would create: $baseModule" -ForegroundColor Yellow
        } else {
            $baseTemplate | Out-File -FilePath $baseModule -Encoding UTF8
            Write-Host "✅ Created: $baseModule" -ForegroundColor Green
        }
        $needsCreation = $true
    }
    
    # Create dark module if missing
    if (-not $file.HasDark) {
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would create: $darkModule" -ForegroundColor Yellow
        } else {
            $darkTemplate | Out-File -FilePath $darkModule -Encoding UTF8
            Write-Host "✅ Created: $darkModule" -ForegroundColor Green
        }
        $needsCreation = $true
    }
    
    # Create light module if missing
    if (-not $file.HasLight) {
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would create: $lightModule" -ForegroundColor Yellow
        } else {
            $lightTemplate | Out-File -FilePath $lightModule -Encoding UTF8
            Write-Host "✅ Created: $lightModule" -ForegroundColor Green
        }
        $needsCreation = $true
    }
    
    if ($needsCreation) {
        $created++
    } else {
        $skipped++
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Files processed: $created" -ForegroundColor Green
Write-Host "  ⏭️  Files skipped: $skipped" -ForegroundColor Gray

if ($DryRun) {
    Write-Host ""
    Write-Host "ℹ️  This was a dry run. Run without -DryRun to create files." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✨ CSS modules created successfully!" -ForegroundColor Green
    Write-Host "   Run audit-css-modules.ps1 again to verify." -ForegroundColor Cyan
}
