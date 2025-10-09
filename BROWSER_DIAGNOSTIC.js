// Copy and paste this in browser console (F12) on http://localhost:3000/admin/users

console.log('🔍 DIAGNOSING ADMIN ISSUE...\n');

// Check 1: Current session
fetch('/api/auth/session')
  .then(r => r.json())
  .then(data => {
    console.log('1️⃣ Current Session:');
    console.log('   Logged in:', !!data.user);
    console.log('   Email:', data.user?.email || 'Not logged in');
    console.log('   User ID:', data.user?.id || 'N/A');
    console.log('');
  });

// Check 2: Try to fetch admin users (will show the 403 error)
fetch('/api/admin/admin-users')
  .then(r => r.json())
  .then(data => {
    console.log('2️⃣ Admin Users API Response:');
    if (data.error) {
      console.log('   ❌ ERROR:', data.error);
      console.log('   This means you are not logged in as an admin!');
    } else {
      console.log('   ✅ Success! Found', data.length, 'admin users');
      console.log('   Data:', data);
    }
    console.log('');
  });

// Check 3: Enable dev bypass
console.log('3️⃣ QUICK FIX - Enable Dev Bypass:');
console.log('   Run this command:');
console.log('   document.cookie = \"dev_admin=1; path=/\"; location.reload();');
console.log('');
