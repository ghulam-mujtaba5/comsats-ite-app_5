# Priority Pages Glassmorphism Enhancement
# Enhances key pages: community, past-papers, gpa-calculator, auth

$ErrorActionPreference = "Continue"

# High-quality glassmorphism template
$glassTemplate = @'
/* High-Quality Glassmorphism Design */

.container {
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  backdrop-filter: blur(16px) saturate(180%);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border-radius: clamp(12px, 2vw, 24px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.45);
}

.card {
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: clamp(12px, 2vw, 20px);
  padding: clamp(1rem, 2vw, 2rem);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.header {
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.button {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8));
  -webkit-backdrop-filter: blur(8px);
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
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.6));
  border: 1px solid rgba(75, 85, 99, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.card {
  background: rgba(17, 24, 39, 0.5);
  border: 1px solid rgba(75, 85, 99, 0.25);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.header {
  background: linear-gradient(to bottom, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.7));
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 8px 32px 0 rgba(100, 116, 139, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.8);
}

.card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.header {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.button {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
}
'@

# Priority pages to enhance
$pages = @(
    "app\community\page",
    "app\past-papers\page",
    "app\gpa-calculator\page",
    "app\auth\page",
    "app\faculty\page",
    "app\resources\page",
    "app\timetable\page"
)

$enhanced = 0
Write-Host "=== Enhancing Priority Pages ===" -ForegroundColor Cyan

foreach ($page in $pages) {
    $basePath = "e:\comsats-ite-app_5\$page"
    $moduleFile = "$basePath.module.css"
    $darkFile = "$basePath.dark.module.css"
    $lightFile = "$basePath.light.module.css"
    
    # Check if files exist and are minimal
    if (Test-Path $moduleFile) {
        $content = Get-Content $moduleFile | Out-String
        if ($content.Length -lt 200) {
            $glassTemplate | Out-File $moduleFile -Encoding UTF8
            Write-Host "✓ Enhanced: $page.module.css" -ForegroundColor Green
            $enhanced++
        }
    }
    
    if (Test-Path $darkFile) {
        $content = Get-Content $darkFile | Out-String
        if ($content.Length -lt 100) {
            $darkTemplate | Out-File $darkFile -Encoding UTF8
            Write-Host "✓ Enhanced: $page.dark.module.css" -ForegroundColor Green
            $enhanced++
        }
    }
    
    if (Test-Path $lightFile) {
        $content = Get-Content $lightFile | Out-String
        if ($content.Length -lt 100) {
            $lightTemplate | Out-File $lightFile -Encoding UTF8
            Write-Host "✓ Enhanced: $page.light.module.css" -ForegroundColor Green
            $enhanced++
        }
    }
}

Write-Host "`nEnhanced $enhanced files" -ForegroundColor Green
$successMsg = "Priority pages now have high-quality glassmorphism!"
Write-Host $successMsg -ForegroundColor Cyan
