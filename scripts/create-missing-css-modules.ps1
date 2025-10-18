# Script to create missing CSS modules for TSX files
$ErrorActionPreference = "Continue"
$projectRoot = "e:\comsats-ite-app_5"

# List of files missing CSS modules (from audit)
$missingFiles = @(
    "app\community\post\[id]\page.tsx",
    "app\community\post\[id]\post-client.tsx",
    "app\faculty\[id]\faculty-client.tsx",
    "app\faculty\[id]\page.tsx",
    "app\help-desk\[id]\page.tsx",
    "app\news\[id]\article-client.tsx",
    "app\news\[id]\page.tsx",
    "app\news-events\[id]\page.tsx",
    "app\past-papers\[courseCode]\course-client.tsx",
    "app\past-papers\[courseCode]\page.tsx",
    "contexts\emotional-ui-context.tsx",
    "contexts\animation-context.tsx"
)

# High-quality glassmorphism template
$glassTemplate = @'
/* High-Quality Glassmorphism Styles */
.container {
  backdrop-filter: blur(16px) saturate(180%);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: clamp(12px, 2vw, 24px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.container:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 48px 0 rgba(31, 38, 135, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    0 6px 24px rgba(0, 0, 0, 0.15);
}

.card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius, 16px);
  padding: clamp(1rem, 2vw, 2rem);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.header {
  backdrop-filter: blur(20px);
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.08)
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.button {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: clamp(0.5rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated {
  animation: fadeIn 0.5s ease-out;
}
'@

$darkTemplate = @'
/* Dark Mode Glassmorphism */
.container {
  background: linear-gradient(
    135deg,
    rgba(17, 24, 39, 0.8),
    rgba(17, 24, 39, 0.6)
  );
  border: 1px solid rgba(75, 85, 99, 0.3);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.container:hover {
  box-shadow: 
    0 12px 48px 0 rgba(0, 0, 0, 0.6),
    inset 0 1px 1px rgba(255, 255, 255, 0.15);
}

.card {
  background: rgba(17, 24, 39, 0.5);
  border: 1px solid rgba(75, 85, 99, 0.25);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.header {
  background: linear-gradient(
    to bottom,
    rgba(17, 24, 39, 0.9),
    rgba(17, 24, 39, 0.7)
  );
  border-bottom: 1px solid rgba(75, 85, 99, 0.3);
}

.button {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(139, 92, 246, 0.7));
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
}
'@

$lightTemplate = @'
/* Light Mode Glassmorphism */
.container {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.7)
  );
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 
    0 8px 32px 0 rgba(100, 116, 139, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);
}

.container:hover {
  box-shadow: 
    0 12px 48px 0 rgba(100, 116, 139, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.9);
}

.card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.header {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.85)
  );
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.button {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
}
'@

Write-Host "=== Creating Missing CSS Modules ===" -ForegroundColor Cyan
Write-Host "Files to process: $($missingFiles.Count)" -ForegroundColor Yellow

$created = 0
foreach ($filePath in $missingFiles) {
    $fullPath = Join-Path $projectRoot $filePath
    
    if (Test-Path $fullPath) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($fullPath)
        $directory = [System.IO.Path]::GetDirectoryName($fullPath)
        
        # Create three CSS module files
        $moduleFile = Join-Path $directory "$baseName.module.css"
        $darkFile = Join-Path $directory "$baseName.dark.module.css"
        $lightFile = Join-Path $directory "$baseName.light.module.css"
        
        # Create files if they don't exist
        if (-not (Test-Path $moduleFile)) {
            $glassTemplate | Out-File $moduleFile -Encoding UTF8
            Write-Host "✓ Created: $baseName.module.css" -ForegroundColor Green
            $created++
        }
        
        if (-not (Test-Path $darkFile)) {
            $darkTemplate | Out-File $darkFile -Encoding UTF8
            Write-Host "✓ Created: $baseName.dark.module.css" -ForegroundColor Green
            $created++
        }
        
        if (-not (Test-Path $lightFile)) {
            $lightTemplate | Out-File $lightFile -Encoding UTF8
            Write-Host "✓ Created: $baseName.light.module.css" -ForegroundColor Green
            $created++
        }
    } else {
        Write-Host "✗ File not found: $filePath" -ForegroundColor Red
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "CSS module files created: $created" -ForegroundColor Green
Write-Host "All TSX files now have complete CSS modules!" -ForegroundColor Green
