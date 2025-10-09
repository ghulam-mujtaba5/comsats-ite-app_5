# 🚨 URGENT: SET SERVICE_ROLE_KEY IN VERCEL

## ⚠️ **CRITICAL ISSUE**

Your production site is **still showing "Forbidden"** because:
- ✅ Code is fixed locally
- ✅ Changes pushed to GitHub  
- ✅ Vercel deployment triggered
- ❌ **SUPABASE_SERVICE_ROLE_KEY NOT SET IN VERCEL**

**Without the SERVICE_ROLE_KEY, the code falls back to ANON_KEY and the error persists!**

---

## 🎯 **FIX IT NOW (2 MINUTES)**

### **STEP 1: Get Your Service Role Key**

1. **I already opened this tab**: Supabase API Settings
2. Or go to: https://supabase.com/dashboard/project/ctixprrqbnfivhepifsa/settings/api
3. **Find**: "Project API keys" section
4. **Copy**: The **`service_role`** key (SECRET, starts with `eyJ...`)

---

### **STEP 2: Add to Vercel**

1. **I already opened this tab**: Vercel Dashboard
2. Or go to: https://vercel.com/dashboard
3. **Find your project**: comsats-ite-app_5
4. **Click**: Settings (left sidebar)
5. **Click**: Environment Variables
6. **Click**: Add New
7. **Fill in**:
   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJ... (paste the key you copied)
   Environments: ✓ Production ✓ Preview ✓ Development (check ALL)
   ```
8. **Click**: Save

---

### **STEP 3: Redeploy**

After adding the key:

1. **Go to**: Deployments tab (top)
2. **Find**: Latest deployment
3. **Click**: ⋯ (three dots menu)
4. **Click**: Redeploy
5. **Wait**: 2-3 minutes for deployment

---

### **STEP 4: Test**

After redeployment completes:

1. **Go to**: https://campusaxis.site/admin/auth
2. **Refresh**: Ctrl+F5 (hard refresh)
3. **Click**: "Continue as Admin"
4. ✅ **Should work!**

---

## 🔍 **HOW TO VERIFY SERVICE_ROLE_KEY IS SET**

### **In Vercel Dashboard:**

1. Go to: Settings → Environment Variables
2. Look for: `SUPABASE_SERVICE_ROLE_KEY`
3. Should show: `eyJ...` (partially masked)
4. Environments: Should say "Production, Preview, Development"

**If you DON'T see it → You MUST add it!**

---

## 📊 **WHY THIS IS REQUIRED**

```typescript
// In the code (app/api/admin/session/elevate/route.ts):
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// IF SERVICE_ROLE_KEY is NOT set in Vercel:
serviceKey = undefined || ANON_KEY  // Uses ANON_KEY ❌
// Result: RLS policies block the query = "Forbidden"

// IF SERVICE_ROLE_KEY IS set in Vercel:
serviceKey = SERVICE_ROLE_KEY  // Uses SERVICE_ROLE_KEY ✅
// Result: Bypasses RLS policies = Access granted!
```

---

## 🚨 **COMMON MISTAKES**

### ❌ **Don't do this:**
- Setting key only for "Production" (must be all 3 environments)
- Copy/paste the ANON key instead of SERVICE_ROLE key
- Forgetting to REDEPLOY after adding the key

### ✅ **Do this:**
- Copy the **service_role** key (SECRET, longer key)
- Set for **ALL environments** (Production, Preview, Development)
- **REDEPLOY** after saving the key

---

## 📖 **VISUAL GUIDE**

### **Supabase API Settings Page:**

```
Project API keys
├── Project URL: https://ctixprrqbnfivhepifsa.supabase.co
├── anon public: eyJhbG... (shorter key - DON'T use this)
└── service_role: eyJhbGciO... (LONGER key - USE THIS!) ✅
                  ⚠️ This key can bypass RLS. Never share publicly.
```

### **Vercel Environment Variables:**

```
Add New Environment Variable

Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (paste full key)

Environments:
☑ Production
☑ Preview  
☑ Development

[Cancel]  [Save]
```

---

## ⏱️ **TIMELINE**

- **Add SERVICE_ROLE_KEY**: 30 seconds
- **Vercel rebuild**: 2-3 minutes
- **Test access**: 10 seconds
- **Total**: ~3 minutes

---

## 🎯 **QUICK CHECKLIST**

- [ ] Copied `service_role` key from Supabase (starts with `eyJ...`)
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` to Vercel
- [ ] Checked ALL 3 environments (Production, Preview, Development)
- [ ] Clicked "Save"
- [ ] Redeployed from Deployments tab
- [ ] Waited for deployment to complete (green checkmark)
- [ ] Tested at https://campusaxis.site/admin/auth
- [ ] Clicked "Continue as Admin"
- [ ] ✅ Access granted!

---

## 📞 **STILL NOT WORKING?**

If after setting SERVICE_ROLE_KEY and redeploying you still get "Forbidden":

1. **Check Vercel Logs**:
   ```
   Go to: Deployments → Latest → View Function Logs
   Look for: "admin elevate error" or similar
   ```

2. **Verify the key is correct**:
   - Length: Should be ~500+ characters
   - Starts with: `eyJ`
   - From Supabase: Settings → API → service_role (SECRET)

3. **Clear browser cache**:
   ```
   Ctrl+Shift+Delete → Clear browsing data → Cached images and files
   ```

4. **Check deployment status**:
   ```
   Vercel Dashboard → Deployments
   Latest should show: ✓ Ready (green checkmark)
   ```

---

## 🎉 **AFTER SUCCESS**

Once admin access works:
- You'll be redirected to `/admin`
- You can view all 5 admin users
- You can promote/demote users
- Full admin panel access unlocked!

**GO ADD THE SERVICE_ROLE_KEY NOW!** 🚀
