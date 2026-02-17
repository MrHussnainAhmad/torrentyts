## Quick Fix Guide

### Issue 1: Admin Login 404 Error
**Problem:** Trying to access `/admin/login` returns 404  
**Solution:** Created redirect page - now `/admin/login` redirects to `/auth/signin`

**Admin Login Credentials:**
- Username: `admin`
- Password: `admin123`

### Issue 2: Courses Not Showing (304 Cache)
**Problem:** Browser is caching the old API response  
**Solutions:**

**Option 1: Hard Refresh (Recommended)**
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Option 2: Clear Browser Cache**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Option 3: Disable Cache in DevTools**
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Disable cache"
4. Keep DevTools open while browsing

### Verify Your Course Status
1. Go to `http://localhost:3001/admin/courses`
2. Find your course
3. Click Edit
4. Make sure Status is set to "Published" (not "Draft")
5. Save

After doing this, hard refresh the homepage to see your courses!
