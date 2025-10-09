#!/bin/bash

# 🚀 Complete SEO Implementation Script
# Run this script to apply all SEO improvements

echo "🎯 Starting Complete SEO Implementation for CampusAxis..."
echo ""

# Step 1: Fix Faculty Database
echo "📝 Step 1: Fixing Faculty Database..."
echo "⚠️  You need to run this SQL in your Supabase dashboard:"
echo ""
echo "ALTER TABLE faculty ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));"
echo "CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);"
echo "UPDATE faculty SET status = 'approved' WHERE status IS NULL;"
echo ""
echo "Press Enter after you've run the SQL..."
read

# Step 2: Verify files created
echo "✅ Step 2: Verifying SEO files..."
files=(
  "lib/seo-config.ts"
  "lib/seo-utils.ts"
  "components/seo/schema-markup.tsx"
  "COMPLETE_SEO_IMPLEMENTATION.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file exists"
  else
    echo "  ✗ $file missing!"
  fi
done
echo ""

# Step 3: Environment variables
echo "📝 Step 3: Add to your .env.local file:"
echo ""
echo "# Google Search Console Verification"
echo "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code"
echo ""
echo "# Google Analytics 4"
echo "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX"
echo ""
echo "Press Enter to continue..."
read

# Step 4: Build and deploy
echo "🔨 Step 4: Building project..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
else
  echo "❌ Build failed. Please fix errors and try again."
  exit 1
fi

# Step 5: Next steps
echo ""
echo "🎉 SEO Implementation Complete!"
echo ""
echo "📋 Next Manual Steps:"
echo ""
echo "1. Google Search Console:"
echo "   → Go to https://search.google.com/search-console"
echo "   → Add property: campusaxis.site"
echo "   → Verify ownership"
echo "   → Submit sitemap: https://campusaxis.site/sitemap.xml"
echo ""
echo "2. Google Analytics 4:"
echo "   → Go to https://analytics.google.com"
echo "   → Create new property"
echo "   → Add measurement ID to .env.local"
echo ""
echo "3. Bing Webmaster Tools:"
echo "   → Go to https://www.bing.com/webmasters"
echo "   → Add site"
echo "   → Submit sitemap"
echo ""
echo "4. Content Creation:"
echo "   → Create 10+ blog posts (see COMPLETE_SEO_IMPLEMENTATION.md)"
echo "   → Optimize existing pages"
echo "   → Add alt text to images"
echo ""
echo "5. Link Building:"
echo "   → Share on COMSATS Facebook groups"
echo "   → Post on Reddit r/pakistan"
echo "   → Share with students via WhatsApp"
echo ""
echo "6. Monitoring:"
echo "   → Check Google Search Console weekly"
echo "   → Track keyword rankings"
echo "   → Monitor traffic in Google Analytics"
echo ""
echo "📖 Full guide: COMPLETE_SEO_IMPLEMENTATION.md"
echo ""
echo "🚀 Expected Results:"
echo "   → Month 1: 100-500 visitors"
echo "   → Month 3: 500-2,000 visitors"
echo "   → Month 6: 2,000-10,000 visitors"
echo "   → Month 12: 10,000-50,000 visitors"
echo ""
echo "Good luck dominating Google search! 🎯"
