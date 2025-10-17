# Fix Light Mode Gradients
# This script fixes dark gradients appearing in light mode

Write-Host "Fixing light mode gradient issues..." -ForegroundColor Green

# Define the problematic gradient pattern and replacement
$files = @(
    "app\page.tsx",
    "app\comsats-gpa-calculator\page.tsx",
    "app\comsats-past-papers\page.tsx"
)

foreach ($file in $files) {
    $filePath = "e:\comsats-ite-app_5\$file"
    
    if (Test-Path $filePath) {
        Write-Host "Processing $file..." -ForegroundColor Cyan
        
        $content = Get-Content $filePath -Raw
        
        # Replace the gradient classes to ensure light mode shows proper colors
        # The issue is that dark: prefix should ONLY apply in dark mode
        # We need to explicitly set light mode backgrounds
        
        $content = $content -replace 
            'from-white via-blue-50/30 to-slate-50/50 dark:from-\[#0f1115\] dark:via-\[#181c22\] dark:to-\[#1a1f27\]',
            'bg-white dark:bg-gradient-to-br dark:from-[#0f1115] dark:via-[#181c22] dark:to-[#1a1f27]'
        
        $content = $content -replace
            'from-white via-purple-50/30 to-slate-50/50 dark:from-\[#0f1115\] dark:via-\[#181c22\] dark:to-\[#1a1f27\]',
            'bg-white dark:bg-gradient-to-br dark:from-[#0f1115] dark:via-[#181c22] dark:to-[#1a1f27]'
        
        $content = $content -replace
            'from-white/60 via-white/40 to-white/70 dark:from-\[#0f1115\]/40 dark:via-\[#181c22\]/60 dark:to-\[#0f1115\]/90',
            'from-white/80 via-white/60 to-white/90 dark:from-[#0f1115]/40 dark:via-[#181c22]/60 dark:to-[#0f1115]/90'
        
        Set-Content $filePath -Value $content -NoNewline
        
        Write-Host "✓ Fixed $file" -ForegroundColor Green
    }
}

Write-Host "`nDone! Light mode gradients have been fixed." -ForegroundColor Green
Write-Host "Please test your application in both light and dark modes." -ForegroundColor Yellow
