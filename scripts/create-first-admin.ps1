# =====================================================
# CREATE FIRST SUPER ADMIN USER
# =====================================================
# This script helps you create your first super admin
# by calling the seed-super-admin API endpoint
# =====================================================

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " CREATE FIRST SUPER ADMIN" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if dev server is running
Write-Host "⏳ Checking if dev server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "✅ Dev server is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Dev server is NOT running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the dev server first:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "This will create a super admin account with:" -ForegroundColor White
Write-Host "  📧 Email: admin@cuilahore.edu.pk" -ForegroundColor Cyan
Write-Host "  🔑 Password: Admin123!@#" -ForegroundColor Cyan
Write-Host "  👑 Role: super_admin" -ForegroundColor Cyan
Write-Host "  ⚡ Permissions: all" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Change the password after first login!" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Continue? (y/n)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚀 Creating super admin..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/seed-super-admin" -Method Get -ErrorAction Stop
    
    if ($response.success) {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Green
        Write-Host " ✅ SUCCESS! Super Admin Created" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Admin Details:" -ForegroundColor White
        Write-Host "  Email: $($response.admin.email)" -ForegroundColor Cyan
        Write-Host "  User ID: $($response.admin.userId)" -ForegroundColor Gray
        Write-Host "  Admin ID: $($response.admin.adminId)" -ForegroundColor Gray
        Write-Host "  Role: $($response.admin.role)" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔐 Login Credentials:" -ForegroundColor Yellow
        Write-Host "  Email: admin@cuilahore.edu.pk" -ForegroundColor White
        Write-Host "  Password: Admin123!@#" -ForegroundColor White
        Write-Host ""
        Write-Host "⚠️  CHANGE PASSWORD IMMEDIATELY AFTER LOGIN!" -ForegroundColor Red
        Write-Host ""
        Write-Host "📝 Next Steps:" -ForegroundColor Yellow
        Write-Host "  1. Go to: http://localhost:3000/auth/signin" -ForegroundColor White
        Write-Host "  2. Login with the credentials above" -ForegroundColor White
        Write-Host "  3. Visit: http://localhost:3000/admin/users" -ForegroundColor White
        Write-Host "  4. Verify you can see admin users" -ForegroundColor White
        Write-Host "  5. Change your password in profile settings" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Red
        Write-Host " ❌ FAILED" -ForegroundColor Red
        Write-Host "================================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error: $($response.error)" -ForegroundColor Red
        Write-Host ""
        if ($response.error -like "*already exists*") {
            Write-Host "ℹ️  The admin user already exists. This is not an error." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "You can:" -ForegroundColor White
            Write-Host "  1. Login with: admin@cuilahore.edu.pk / Admin123!@#" -ForegroundColor Cyan
            Write-Host "  2. Or use the 'Forgot Password' feature to reset" -ForegroundColor Cyan
            Write-Host ""
        } else {
            Write-Host "Possible solutions:" -ForegroundColor Yellow
            Write-Host "  1. Check if Supabase environment variables are set" -ForegroundColor White
            Write-Host "  2. Run the RLS migration in Supabase SQL Editor" -ForegroundColor White
            Write-Host "  3. Check logs in terminal for more details" -ForegroundColor White
            Write-Host ""
        }
    }
} catch {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host " ❌ ERROR" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Failed to connect to the API endpoint." -ForegroundColor Red
    Write-Host ""
    Write-Host "Error details:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Gray
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Make sure dev server is running: npm run dev" -ForegroundColor White
    Write-Host "  2. Check if port 3000 is not blocked by firewall" -ForegroundColor White
    Write-Host "  3. Try accessing http://localhost:3000 in browser" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Read-Host "Press Enter to exit"
