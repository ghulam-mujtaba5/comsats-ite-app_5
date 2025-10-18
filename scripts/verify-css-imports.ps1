# CSS Module Implementation Verification Script
# Checks that CSS modules are properly imported in TSX files

Write-Host "🔍 CSS Module Import Verification" -ForegroundColor Cyan
Write-Host ""

$rootPath = "e:\comsats-ite-app_5"

# Files that should have imports
$filesToCheck = @(
    "contexts\animation-context.tsx",
    "contexts\auth-context.tsx",
    "contexts\campus-context.tsx",
    "contexts\emotion-context.tsx",
    "contexts\emotional-ui-context.tsx",
    "hooks\use-session-tracker.tsx",
    "lib\accessibility.tsx",
    "lib\performance.tsx",
    "lib\ui-ux-examples.tsx",
    "app\admissions\mentor\[id]\page.tsx",
    "app\blog\[slug]\page.tsx",
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
    "__tests__\components\enhanced-components.test.tsx"
)

$verified = 0
$missing = 0
$errors = 0

Write-Host "📊 Checking $($filesToCheck.Count) files..." -ForegroundColor Yellow
Write-Host ""

foreach ($relativePath in $filesToCheck) {
    $fullPath = Join-Path $rootPath $relativePath
    $fileName = Split-Path $relativePath -Leaf
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "⚠️  $relativePath - File not found" -ForegroundColor Yellow
        $errors++
        continue
    }
    
    try {
        $content = Get-Content $fullPath -Raw -ErrorAction Stop
        
        # Check for CSS module import
        if ($content -match "import\s+styles\s+from\s+['\`"]\.\/.*?\.module\.css['\`"]") {
            Write-Host "✅ $relativePath" -ForegroundColor Green
            $verified++
            
            # Check if styles are actually used
            if ($content -match "styles\.\w+") {
                Write-Host "   └─ 🎨 Styles are being used" -ForegroundColor DarkGreen
            } else {
                Write-Host "   └─ ⚠️  Import exists but styles not used yet" -ForegroundColor DarkYellow
            }
        } else {
            Write-Host "❌ $relativePath - No import found" -ForegroundColor Red
            $missing++
        }
    } catch {
        Write-Host "❌ $relativePath - Error reading file: $_" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "📈 Verification Results:" -ForegroundColor Cyan
Write-Host "  ✅ Verified: $verified/$($filesToCheck.Count) ($(($verified/$filesToCheck.Count*100).ToString('0.0'))%)" -ForegroundColor Green
Write-Host "  ❌ Missing: $missing" -ForegroundColor $(if ($missing -eq 0) { 'Green' } else { 'Red' })
Write-Host "  ⚠️  Errors: $errors" -ForegroundColor $(if ($errors -eq 0) { 'Green' } else { 'Yellow' })

Write-Host ""
if ($verified -eq $filesToCheck.Count) {
    Write-Host "🎉 All files have CSS module imports!" -ForegroundColor Green
    Write-Host "   Next: Update className attributes to use styles object" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Some files need attention" -ForegroundColor Yellow
    Write-Host "   Run import-css-modules.ps1 again if needed" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✨ Verification complete!" -ForegroundColor Green
