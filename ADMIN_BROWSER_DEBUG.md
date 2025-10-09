# 🔍 ADMIN DEBUG - Browser Console Scripts

## Quick Diagnosis

Copy and paste these scripts into your browser console (F12 → Console) while on http://localhost:3000

---

## 1️⃣ Check Who You're Logged In As

```javascript
// Check current session
fetch('/api/admin/session')
  .then(r => r.json())
  .then(data => {
    console.log('═══════════════════════════════════');
    console.log('🔐 CURRENT SESSION');
    console.log('═══════════════════════════════════');
    if (data.user) {
      console.log('✅ Logged in as:', data.user.email);
      console.log('User ID:', data.user.id);
      console.log('Is Admin:', data.isAdmin ? '✅ YES' : '❌ NO');
      console.log('Admin Role:', data.adminRole || 'N/A');
      console.log('Permissions:', data.permissions || []);
    } else {
      console.log('❌ NOT LOGGED IN');
    }
    console.log('═══════════════════════════════════');
  })
  .catch(err => console.error('❌ Error:', err));
```

**Expected Output:**
- If admin: `✅ Logged in as: fa22-bse-199@cuilahore.edu.pk` + `Is Admin: ✅ YES`
- If not admin: `Is Admin: ❌ NO` → Need to login as admin!

---

## 2️⃣ Check Admin Users API

```javascript
// Fetch admin users
fetch('/api/admin/admin-users')
  .then(r => r.json())
  .then(data => {
    console.log('═══════════════════════════════════');
    console.log('👥 ADMIN USERS');
    console.log('═══════════════════════════════════');
    if (data.error) {
      console.error('❌ Error:', data.error);
      console.log('\n💡 Solution: Login as admin user');
    } else if (Array.isArray(data)) {
      console.log('✅ Found', data.length, 'admin(s)');
      data.forEach((admin, i) => {
        console.log(`\nAdmin ${i + 1}:`);
        console.log('  Email:', admin.user?.email || 'N/A');
        console.log('  Role:', admin.role);
        console.log('  Permissions:', admin.permissions);
        console.log('  ID:', admin.id);
      });
    } else {
      console.log('⚠️ Unexpected response:', data);
    }
    console.log('═══════════════════════════════════');
  })
  .catch(err => console.error('❌ Fetch failed:', err));
```

**Expected Output:**
- If authorized: `✅ Found 1 admin(s)` + list of admins
- If not authorized: `❌ Error: Unauthorized - Admin access required`

---

## 3️⃣ Enable Dev Admin Bypass (Development Only!)

```javascript
// Enable dev admin access (ONLY works in development!)
document.cookie = "dev_admin=1; path=/";
console.log('✅ Dev admin enabled! Reload the page.');
console.log('⚠️ This only works in NODE_ENV !== production');
```

**Then reload the page:**
- Press F5 or Ctrl+R
- Go to admin panel: http://localhost:3000/admin/users
- Should now have admin access ✅

**To disable:**
```javascript
document.cookie = "dev_admin=; path=/; max-age=0";
console.log('✅ Dev admin disabled! Reload the page.');
```

---

## 4️⃣ Check Supabase Connection

```javascript
// Test if Supabase is configured
fetch('/api/admin/session')
  .then(r => r.json())
  .then(data => {
    console.log('═══════════════════════════════════');
    console.log('🔧 SUPABASE CONFIG');
    console.log('═══════════════════════════════════');
    const configured = !data.error || data.error !== 'Server misconfigured';
    console.log('Supabase:', configured ? '✅ Connected' : '❌ Not configured');
    console.log('Environment variables:', configured ? '✅ Set' : '❌ Missing');
    console.log('═══════════════════════════════════');
  });
```

---

## 5️⃣ All-in-One Diagnostic

```javascript
// Run all diagnostics
(async function() {
  console.clear();
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 ADMIN PANEL DIAGNOSTICS');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Check session
  console.log('1️⃣ Checking current session...');
  try {
    const session = await fetch('/api/admin/session').then(r => r.json());
    if (session.user) {
      console.log('   ✅ Logged in as:', session.user.email);
      console.log('   ✅ User ID:', session.user.id);
      console.log('   ' + (session.isAdmin ? '✅' : '❌') + ' Admin access:', session.isAdmin ? 'YES' : 'NO');
      if (session.isAdmin) {
        console.log('   ✅ Role:', session.adminRole);
      }
    } else {
      console.log('   ❌ NOT LOGGED IN');
    }
  } catch (err) {
    console.log('   ❌ Session check failed:', err.message);
  }

  console.log('');

  // 2. Check admin users API
  console.log('2️⃣ Checking admin users API...');
  try {
    const admins = await fetch('/api/admin/admin-users').then(r => r.json());
    if (admins.error) {
      console.log('   ❌ Error:', admins.error);
    } else if (Array.isArray(admins)) {
      console.log('   ✅ Found', admins.length, 'admin user(s)');
      admins.forEach((admin, i) => {
        console.log(`   ${i + 1}. ${admin.user?.email || 'Unknown'} (${admin.role})`);
      });
    }
  } catch (err) {
    console.log('   ❌ API check failed:', err.message);
  }

  console.log('');

  // 3. Summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n💡 SOLUTIONS:\n');
  console.log('If you see "NOT LOGGED IN":');
  console.log('  → Login as: fa22-bse-199@cuilahore.edu.pk');
  console.log('');
  console.log('If you see "Admin access: NO":');
  console.log('  → Your account is not in admin_users table');
  console.log('  → Run SQL in Supabase to add yourself');
  console.log('');
  console.log('If you see "Unauthorized" error:');
  console.log('  → Login as admin user first');
  console.log('  → Or enable dev bypass (dev mode only)');
  console.log('');
  console.log('Dev bypass (development only):');
  console.log('  document.cookie = "dev_admin=1; path=/";');
  console.log('  location.reload();');
  console.log('═══════════════════════════════════════════════════════');
})();
```

**This will show:**
- Current login status
- Admin access status
- Number of admin users found
- Specific errors (if any)
- Solutions for common issues

---

## 🎯 Common Results & Solutions

### Result: "NOT LOGGED IN"
**Solution:**
```
1. Go to: http://localhost:3000/auth/signin
2. Login with: fa22-bse-199@cuilahore.edu.pk
3. Re-run diagnostics
```

### Result: "Admin access: NO"
**Solution:**
```
1. Your account exists but not in admin_users table
2. Run SQL in Supabase:
   - See: supabase/migrations/verify_admin_user.sql
   - Insert your user_id into admin_users table
```

### Result: "Unauthorized - Admin access required"
**Solution:**
```
1. Login as admin user (fa22-bse-199@cuilahore.edu.pk)
2. Or enable dev bypass:
   document.cookie = "dev_admin=1; path=/";
   location.reload();
```

### Result: "Found 0 admin user(s)"
**Solution:**
```
1. Check Supabase → admin_users table
2. Verify row exists for your user
3. Run: supabase/migrations/verify_admin_user.sql
4. Add missing admin record
```

---

## ✅ Expected Working State

When everything is working, you should see:

```
═══════════════════════════════════════════════════════
🔍 ADMIN PANEL DIAGNOSTICS
═══════════════════════════════════════════════════════

1️⃣ Checking current session...
   ✅ Logged in as: fa22-bse-199@cuilahore.edu.pk
   ✅ User ID: abc123...
   ✅ Admin access: YES
   ✅ Role: super_admin

2️⃣ Checking admin users API...
   ✅ Found 1 admin user(s)
   1. fa22-bse-199@cuilahore.edu.pk (super_admin)
```

---

**Use these scripts to quickly diagnose and fix your admin access issue!** 🚀
