# 🚀 Complete SEO Implementation Script for Windows
# Run this in PowerShell

Write-Host "🎯 Starting Complete SEO Implementation for CampusAxis..." -ForegroundColor Green
Write-Host ""

# Step 1: Fix Faculty Database
Write-Host "📝 Step 1: Fixing Faculty Database..." -ForegroundColor Yellow
Write-Host "⚠️  You need to run this SQL in your Supabase dashboard:" -ForegroundColor Red
Write-Host ""
Write-Host "ALTER TABLE faculty ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));"
Write-Host "CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);"
Write-Host "UPDATE faculty SET status = 'approved' WHERE status IS NULL;"
Write-Host ""
Read-Host "Press Enter after you've run the SQL"

# Step 2: Verify files created
Write-Host "✅ Step 2: Verifying SEO files..." -ForegroundColor Green
$files = @(
    "lib\seo-config.ts",
    "lib\seo-utils.ts",
    "components\seo\schema-markup.tsx",
    "COMPLETE_SEO_IMPLEMENTATION.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file missing!" -ForegroundColor Red
    }
}
Write-Host ""

# Step 3: Environment variables
Write-Host "📝 Step 3: Add to your .env.local file:" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Google Search Console Verification"
Write-Host "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code"
Write-Host ""
Write-Host "# Google Analytics 4"
Write-Host "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX"
Write-Host ""
Read-Host "Press Enter to continue"

# Step 4: Build and deploy
Write-Host "🔨 Step 4: Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
    exit 1
}

# Step 5: Next steps
Write-Host ""
Write-Host "🎉 SEO Implementation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Manual Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Google Search Console:"
Write-Host "   → Go to https://search.google.com/search-console"
Write-Host "   → Add property: campusaxis.site"
Write-Host "   → Verify ownership"
Write-Host "   → Submit sitemap: https://campusaxis.site/sitemap.xml"
Write-Host ""
Write-Host "2. Google Analytics 4:"
Write-Host "   → Go to https://analytics.google.com"
Write-Host "   → Create new property"
Write-Host "   → Add measurement ID to .env.local"
Write-Host ""
Write-Host "3. Bing Webmaster Tools:"
Write-Host "   → Go to https://www.bing.com/webmasters"
Write-Host "   → Add site"
Write-Host "   → Submit sitemap"
Write-Host ""
Write-Host "4. Content Creation:"
Write-Host "   → Create 10+ blog posts (see COMPLETE_SEO_IMPLEMENTATION.md)"
Write-Host "   → Optimize existing pages"
Write-Host "   → Add alt text to images"
Write-Host ""
Write-Host "5. Link Building:"
Write-Host "   → Share on COMSATS Facebook groups"
Write-Host "   → Post on Reddit r/pakistan"
Write-Host "   → Share with students via WhatsApp"
Write-Host ""
Write-Host "6. Monitoring:"
Write-Host "   → Check Google Search Console weekly"
Write-Host "   → Track keyword rankings"
Write-Host "   → Monitor traffic in Google Analytics"
Write-Host ""
Write-Host "📖 Full guide: COMPLETE_SEO_IMPLEMENTATION.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Expected Results:" -ForegroundColor Magenta
Write-Host "   → Month 1: 100-500 visitors"
Write-Host "   → Month 3: 500-2,000 visitors"
Write-Host "   → Month 6: 2,000-10,000 visitors"
Write-Host "   → Month 12: 10,000-50,000 visitors"
Write-Host ""
Write-Host "Good luck dominating Google search! 🎯" -ForegroundColor Green
