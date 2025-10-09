@echo off
title Apply Admin Fix - Supabase SQL Editor
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          APPLY ADMIN FIX - SIMPLE METHOD                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo This will open:
echo   1. Supabase SQL Editor (in browser)
echo   2. Migration file (in Notepad)
echo.
echo Then you just:
echo   - Copy content from Notepad (Ctrl+A, Ctrl+C)
echo   - Paste in SQL Editor
echo   - Click 'Run'
echo   - Done! ✅
echo.
pause

echo.
echo Opening Supabase SQL Editor...
start https://supabase.com/dashboard/project/ctixprrqbnfivhepifsa/sql/new

timeout /t 2 /nobreak >nul

echo Opening migration file...
start notepad "supabase\migrations\20250109_fix_admin_system_production.sql"

echo.
echo ═══════════════════════════════════════════════════════════
echo  INSTRUCTIONS
echo ═══════════════════════════════════════════════════════════
echo.
echo 1. Copy ALL content from Notepad (Ctrl+A, then Ctrl+C)
echo 2. Switch to browser (SQL Editor tab)
echo 3. Paste in the editor (Ctrl+V)
echo 4. Click 'Run' button (or press Ctrl+Enter)
echo 5. Wait for success message
echo 6. Look for these NOTICE messages:
echo    - "Super admin configured: fa22-bse-199@cuilahore.edu.pk"
echo    - "Total admin users: 1"
echo    - "ADMIN SYSTEM SETUP COMPLETE"
echo.
echo ═══════════════════════════════════════════════════════════
echo  AFTER SUCCESS
echo ═══════════════════════════════════════════════════════════
echo.
echo Option A: Dev Bypass (Instant)
echo   1. Open http://localhost:3000 in browser
echo   2. Press F12 for console
echo   3. Paste: document.cookie = 'dev_admin=1; path=/'; location.reload();
echo   4. Go to /admin/users
echo   5. Done! ✅
echo.
echo Option B: Login as Admin
echo   1. Logout from current account
echo   2. Login as: fa22-bse-199@cuilahore.edu.pk
echo   3. Go to /admin/users
echo   4. Done! ✅
echo.
pause
